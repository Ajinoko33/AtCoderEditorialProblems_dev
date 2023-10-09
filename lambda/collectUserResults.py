import json
import time
import re

import requests

# ユーザの提出を取得するAPIエンドポイント
API_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions"
# 1回のリクエストで取得可能な提出数の最大値
MAX_NUMS = 500
# API呼び出し間隔
SLEEP_TIME = 1
# コンテストの正規表現パターン
CONTEST_PATTERN = r"^(abc|arc|agc)\d{3}$"

def lambda_handler(event, context):
    if "username" not in event:
        return {}

    # 提出を全件取得
    headers = {'content-type': 'application/json'}
    params = {
        "user" : event["username"],
        "from_second" : 0
    }
    lastSecond = 0
    lastNums = MAX_NUMS
    allSubmissions = []

    while lastNums == MAX_NUMS:
        if lastSecond != 0:
            time.sleep(SLEEP_TIME)

        params["from_second"] = lastSecond
        res = requests.get(
            API_URL,
            headers=headers,
            params=params
        )
        if res.status_code != 200:
            # API呼び出しエラー
            return {}
        
        submissons = json.loads(res.text)
        allSubmissions += submissons

        lastNums = len(submissons)
        if lastNums > 0:
            lastSecond = submissons[-1]["epoch_second"]

    # 結果を整理
    # 結果コード(1:AC, 2:未AC)
    ptn = re.compile(CONTEST_PATTERN)
    status = {}
    for subm in allSubmissions:
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

    # 返り値成形
    res = []
    for problemId, resultCode in status.items():
        res.append({
            "problem_id" : problemId,
            "result_code" : resultCode
        })

    return res
  