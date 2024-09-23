import time
import datetime
import json
import math
from string import Template

import requests
from bs4 import BeautifulSoup
import boto3

# APIエンドポイント
API_URL = "https://kenkoooo.com/atcoder/resources"
# AtCoder解説一覧ページURLテンプレート
EDITORIAL_URL_TEMPLATE = Template("https://atcoder.jp/contests/${contest_id}/editorial?editorialLang=ja&lang=ja")
# 抽出対象のコンテスト(コンテストIDの先頭3文字)
TARGET_CONTESTS = ["abc", "arc"]
# 1年間の長さ(秒)
ONE_YEAR_EPOCH_SECOND = 365 * 24 * 60 * 60
# リクエスト間隔(秒)
REQUEST_INTERVAL = 1
# サーバと接続を確立するまでの待機時間(秒)
CONNECT_TIMEOUT = 3.5
# サーバがレスポンスを返すまでの待機時間(秒)
READ_TIMEOUT = 3.5

CLIENT = boto3.client("lambda")

def correlative_validate(event):
    # 時刻大小関係
    if event["from_epoch_second"] > event["to_epoch_second"]:
        print("Invalid inbound:", event)
        raise RuntimeError("Correlation validation error!")

def validate(event):
    # 値が設定されてなければ設定
    # 期間は最長1年間
    exist_from = "from_epoch_second" in event
    exist_to = "to_epoch_second" in event

    if exist_from and exist_to:
        # 相関バリデーション
        correlative_validate(event)

        return {
            "from_epoch_second": max(event["from_epoch_second"], event["to_epoch_second"] - ONE_YEAR_EPOCH_SECOND),
            "to_epoch_second": event["to_epoch_second"]
        }
    elif exist_from and not exist_to:
        return {
            "from_epoch_second": event["from_epoch_second"],
            "to_epoch_second": event["from_epoch_second"] + ONE_YEAR_EPOCH_SECOND
        }
    elif not exist_from and exist_to:
        return {
            "from_epoch_second": event["to_epoch_second"] - ONE_YEAR_EPOCH_SECOND,
            "to_epoch_second": event["to_epoch_second"]
        }
    else:
        now = math.ceil(datetime.datetime.now().timestamp())
        return {
            "from_epoch_second": now - ONE_YEAR_EPOCH_SECOND,
            "to_epoch_second": now
        }

def get_request(url):
    time.sleep(REQUEST_INTERVAL)
    res = requests.get(url, timeout=(CONNECT_TIMEOUT, READ_TIMEOUT))

    if res.status_code != 200:
        # HTTPリクエストエラー
        res.raise_for_status()

    return res

def collect_contests(from_epoch_second, to_epoch_second):
    # APIからコンテスト開始時刻を取得
    url = API_URL + "/contests.json"
    res = get_request(url)

    contests = json.loads(res.text)

    # 対象コンテストで、かつ開始時刻が[from,to]にあるコンテストを抽出
    target_contests = list(filter(lambda c: c["id"][:3] in TARGET_CONTESTS and from_epoch_second <= c["start_epoch_second"] <= to_epoch_second, contests))

    ret = {}
    for target_contest in target_contests:
        ret[target_contest["id"]] = {
            "start_epoch_second": target_contest["start_epoch_second"]
        }

    return ret

def collect_pairs(contest_ids):
    # APIからコンテストと問題のペア情報取得
    url = API_URL + "/contest-problem.json"
    res = get_request(url)

    pairs = json.loads(res.text)

    # 対象コンテストを抽出
    ret = list(filter(lambda p: p["contest_id"] in contest_ids, pairs))

    return ret

def collect_problems_base(problem_ids):
    # APIから問題情報取得
    url = API_URL + "/problems.json"
    res = get_request(url)

    problems = json.loads(res.text)

    # 問題を抽出
    ret = list(filter(lambda p: p["id"] in problem_ids, problems))

    return ret

def collect_difficulty(problem_ids):
    # APIからdifficulty取得
    url = API_URL + "/problem-models.json"
    res = get_request(url)

    problem_models = json.loads(res.text)

    # 問題のdifficultyを抽出
    ret = {}
    for problem_id in problem_ids:
        if problem_id not in problem_models:
            continue

        if "difficulty" in problem_models[problem_id]:
            ret[problem_id] = {
                "difficulty": problem_models[problem_id]["difficulty"],
                "is_experimental": problem_models[problem_id]["is_experimental"]
            }
        else:
            ret[problem_id] = {
                "is_experimental": problem_models[problem_id]["is_experimental"]
            }

    return ret

def unite_difficulties(problems, difficulties):
    ret = {}
    for problem in problems:
        united_problem = problem.copy()
        united_problem["is_experimental"] = False
        if united_problem["id"] in difficulties:
            united_problem = {**united_problem, **difficulties[united_problem["id"]]}

        ret[united_problem["id"]] = united_problem

    return ret

def collect_problems(problem_ids):
    # APIから問題情報を取得
    problems_base = collect_problems_base(problem_ids)

    # APIからdifficulty情報取得
    difficulties = collect_difficulty(problem_ids)

    # 問題情報とdifficulty情報を整理
    ret = unite_difficulties(problems_base, difficulties)

    return ret

def collect_editorial_entries(contest_ids):
    # AtCoder解説タブから解説情報取得
    ret = {}
    for contest_id in contest_ids:
        # 解説一覧ページを取得し，パース
        url = EDITORIAL_URL_TEMPLATE.substitute(contest_id=contest_id)
        text = get_request(url).text
        soup = BeautifulSoup(text, "html.parser")

        # 各問題の解説Writerを抽出
        h3s = soup.find_all("h3")
        for h3 in h3s:
            if h3.get_text() == "コンテスト全体の解説":
                continue

            # 問題URLの末尾から問題IDを抽出
            problem_id = h3.a["href"].split("/")[-1]

            next_tag = h3.next_sibling.next_sibling
            if next_tag.name == "ul":
                # 解説あり
                official_writers = set()
                user_writers = set()
                for li in next_tag.find_all("li"):
                    is_official = (li.find_all("span")[0].get_text() == "公式")
                    writer = li.find_all("a")[1].span.get_text()
                    if is_official:
                        official_writers.add(writer)
                    else:
                        user_writers.add(writer)

                ret[problem_id] = []
                for writer in official_writers:
                    ret[problem_id].append({
                        "writer": writer,
                        "is_official": True
                    })
                for writer in user_writers:
                    ret[problem_id].append({
                        "writer": writer,
                        "is_official": False
                    })

    return ret

def create_editorials(contests, problems, contests_problems, editorial_entries):
    ret = []
    for pair in contests_problems:
        if pair["problem_id"] in editorial_entries:
            # 解説あり
            contest = contests[pair["contest_id"]]
            problem = problems[pair["problem_id"]]
            editorial_entry_list = editorial_entries[pair["problem_id"]]

            for editorial_entry in editorial_entry_list:
                editorial = {
                    "writer_name": editorial_entry["writer"],
                    "problem_name": problem["name"],
                    "problem_title": problem["title"],
                    "problem_is_experimental": problem["is_experimental"],
                    "contest_id": pair["contest_id"],
                    "problem_index": pair["problem_index"],
                    "contest_start_epoch_second": contest["start_epoch_second"],
                    "is_official": editorial_entry["is_official"],
                    }

                if "difficulty" in problem:
                    editorial["problem_difficulty"] = problem["difficulty"]

                ret.append(editorial)

    return ret

def invoke_save_lambda(editorials):
    # lambdaを非同期で呼び出して問題をDBに格納
    res = CLIENT.invoke(
        FunctionName="saveEditorials",
        InvocationType="Event",
        LogType="Tail",
        Payload=json.dumps({
            "editorials": editorials,
        })
    )

    if res["StatusCode"] != 202:
        # 呼び出しエラー
        print("[ERROR] Lambda Invocation Error")
        print("invocation result: ", res)
        raise RuntimeError("Lambda Invocation Error")

    return

def lambda_handler(event, context):
    # バリデーション
    filled_event = validate(event)

    # 対象コンテスト取得
    contests = collect_contests(filled_event["from_epoch_second"], filled_event["to_epoch_second"])

    # コンテストと問題IDのペア取得
    contest_ids = set(contests.keys())
    contests_problems = collect_pairs(contest_ids)

    # 問題IDより問題情報取得
    problem_ids = set([p["problem_id"] for p in contests_problems])
    problems = collect_problems(problem_ids)

    # コンテストIDより解説情報取得
    editorial_entries = collect_editorial_entries(contest_ids)

    # 解説情報オブジェクトに整理
    editorials = create_editorials(contests, problems, contests_problems, editorial_entries)

    # lambda呼び出し(非同期処理)
    invoke_save_lambda(editorials)

    print("saved contests:")
    print(contests)
    print("saved problems:")
    print(problems)
    print("saved editorials:")
    print(editorial_entries)

    return
