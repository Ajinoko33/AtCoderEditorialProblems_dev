import copy
import datetime
import json
import math
from string import Template

from aws_lambda_powertools.utilities.validation import validator
import requests
from bs4 import BeautifulSoup
import boto3

# APIエンドポイント
API_URL = "https://kenkoooo.com/atcoder/resources"
# AtCoder解説一覧ページURLテンプレート
EDITORIAL_URL_TEMPLATE = Template("https://atcoder.jp/contests/${contest_id}/editorial?editorialLang=ja&lang=ja")

CLIENT = boto3.client("lambda")

INBOUND_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "properties": {
        "from_epoch_second": {
            "type": "integer"
        },
        "to_epoch_second": {
            "type": "integer"
        }
    },
    "additionalProperties": False
}

def set_props(event):
    # 値が設定されてなければ設定
    ONE_YEAR_EPOCH_SECOND = 365 * 24 * 60 * 60
    exist_from = "from_epoch_second" in event
    exist_to = "to_epoch_second" in event

    if exist_from and exist_to:
        return event
    elif exist_from and not exist_to:
        event["to_epoch_second"] = event["from_epoch_second"] + ONE_YEAR_EPOCH_SECOND
        return event
    elif not exist_from and exist_to:
        event["from_epoch_second"] = event["to_epoch_second"] - ONE_YEAR_EPOCH_SECOND
        return event
    else:
        event["to_epoch_second"] = math.ceil(datetime.datetime.now().timestamp())
        event["from_epoch_second"] = event["to_epoch_second"] - ONE_YEAR_EPOCH_SECOND
        return event

def correlation_validation(event):
    # 時刻大小関係
    if event["from_epoch_second"] > event["to_epoch_second"]:
        print("Invalid inbound:")
        print(event)
        raise RuntimeError("Correlation Validation Error!")

def collect_contest_start_epoch_secs(from_epoch_second, to_epoch_second):
    # APIからコンテスト開始時刻を取得
    url = API_URL + "/contests.json"
    res = requests.get(url)

    if res.status_code != 200:
        # API先でのエラー
        res.raise_for_status()

    contests = json.loads(res.text)

    # 開始時刻がfromからtoまでの間にあるコンテストを抽出
    target_contests = list(filter(lambda c: from_epoch_second <= c["start_epoch_second"] <= to_epoch_second, contests))
    # 開始時刻を抽出
    ret = {}
    for contest in target_contests:
        ret[contest["id"]] = contest["start_epoch_second"]

    return ret

def collect_problems(contest_ids):
    # APIから問題情報を取得
    url = API_URL + "/problems.json"
    res = requests.get(url)

    if res.status_code != 200:
        # API先でのエラー
        res.raise_for_status()

    problems = json.loads(res.text)

    # コンテストの問題を抽出
    ret = list(filter(lambda p: p["contest_id"] in contest_ids, problems))

    return ret

def collect_difficulty(problem_ids):
    # APIからdifficulty取得
    url = API_URL + "/problem-models.json"
    res = requests.get(url)

    if res.status_code != 200:
        # API先でのエラー
        res.raise_for_status()

    problem_models = json.loads(res.text)

    # 問題のdifficultyを抽出
    ret = {}
    for problem_id in problem_ids:
        if problem_id not in problem_models or "difficulty" not in problem_models[problem_id]:
            continue
        ret[problem_id] = problem_models[problem_id]["difficulty"]

    return ret

def collect_writers(contest_ids):
    # AtCoder公式解説ページからWriter情報取得
    ret = {}
    for contest_id in contest_ids:
        # 解説一覧ページを取得し，パース
        url = EDITORIAL_URL_TEMPLATE.substitute(contest_id=contest_id)
        text = requests.get(url).text
        soup = BeautifulSoup(text, "html.parser")

        # 各問題のWriterを抽出
        h3s = soup.find_all("h3")
        for h3 in h3s:
            if h3.get_text() == "コンテスト全体の解説":
                continue
            # 問題URLの末尾から問題IDを抽出
            problem_id = h3.a["href"].split("/")[-1]
            # Writer名を抽出
            writer = h3.next_sibling.next_sibling.li.find_all("a")[1].span.get_text()
            ret[problem_id] = writer

    return ret

def unite_into_problems(problems, start_epoch_secs, difficulties, writers):
    # 情報を問題ごとに整理
    ret = copy.deepcopy(problems)
    for problem in ret:
        problem["start_epoch_second"] = start_epoch_secs[problem["contest_id"]]
        problem["writer"] = writers[problem["id"]]
        if problem["id"] in difficulties:
            problem["difficulty"] = difficulties[problem["id"]]

    return ret

def invoke_save_lambda(problems):
    # lambdaを非同期で呼び出して問題をDBに格納
    res = CLIENT.invoke(
        FunctionName="saveProblems",
        InvocationType="Event",
        LogType="Tail",
        Payload=json.dumps(problems)
    )

    if res["StatusCode"] != 202:
        print("Lambda Invocation error! Status code :", res["StatusCode"])

    return


@validator(inbound_schema=INBOUND_SCHEMA)
def lambda_handler(event, context):
    # 値の設定
    filled_event = set_props(event)

    # 相関バリデーション
    correlation_validation(filled_event)
    
    # APIからコンテスト開始時刻取得
    start_epoch_secs = collect_contest_start_epoch_secs(filled_event["from_epoch_second"], filled_event["to_epoch_second"])

    # APIから問題情報取得
    contest_ids = start_epoch_secs.keys()
    problems = collect_problems(contest_ids)

    # APIからdifficulty情報取得
    problem_ids = [p["id"] for p in problems]
    difficulties = collect_difficulty(problem_ids)

    # AtCoder公式解説ページからWriter情報取得
    writers = collect_writers(contest_ids)

    # 情報を問題ごとに整理
    united_problems = unite_into_problems(problems, start_epoch_secs, difficulties, writers)

    # lambda呼び出し(非同期処理)
    invoke_save_lambda(united_problems)
    

    return
