import json
import time
import re

from aws_lambda_powertools.utilities.validation import validator
import requests

# ユーザの提出を取得するAPIエンドポイント
API_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions"
# 1回のリクエストで取得可能な提出数の最大値
MAX_NUMS = 500
# API呼び出し間隔
SLEEP_TIME = 1
# コンテストの正規表現パターン
CONTEST_PATTERN = r"^(abc|arc|agc)\d{3}$"

INBOUND_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "required": ["user"],
    "properties": {
        "user": {
            "type": "string",
            "maxLength": 255
        }
    },
    "additionalProperties": False
}

def collect_all_submittions(user):
    # 提出を全件取得
    headers = {'content-type': 'application/json'}
    params = {
        "user" : user,
        "from_second" : 0
    }
    last_second = 0
    last_nums = MAX_NUMS
    all_submittions = []

    while last_nums == MAX_NUMS:
        if last_second != 0:
            time.sleep(SLEEP_TIME)

        params["from_second"] = last_second
        res = requests.get(
            API_URL,
            headers=headers,
            params=params
        )
        if res.status_code != 200:
            # API呼び出しエラー
            res.raise_for_status()
        
        submissons = json.loads(res.text)
        all_submittions += submissons

        last_nums = len(submissons)
        if last_nums > 0:
            last_second = submissons[-1]["epoch_second"]

    return all_submittions

def analyze_status_code(submittions):
    # 結果を整理
    # 結果コード(1:AC, 2:未AC)
    ptn = re.compile(CONTEST_PATTERN)
    status = {}
    for subm in submittions:
        contestId = subm["contest_id"]
        if ptn.fullmatch(contestId) is None:
            # 対象外のコンテストは無視
            continue

        problemId = subm["problem_id"]
        resultCode = 1 if subm["result"] == "AC" else 2
        if problemId in status:
            status[problemId] = min(resultCode, status[problemId])
        else:
            status[problemId] = resultCode

    return status

def make_response(status):
    # 返り値成形
    res = []
    for problemId, resultCode in status.items():
        res.append({
            "id" : problemId,
            "result_code" : resultCode
        })

    return res

@validator(inbound_schema=INBOUND_SCHEMA)
def lambda_handler(event, context):
    # 提出を全件取得
    submittions = collect_all_submittions(event["user"])

    # 結果を整理
    status = analyze_status_code(submittions)

    # 返り値成形
    res = make_response(status)

    return res
  