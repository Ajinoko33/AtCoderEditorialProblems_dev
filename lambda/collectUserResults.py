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

def is_validate(event):
    # バリデーション
    if "user" not in event:
        return False
    
    return True

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
            status_code = res.status_code
            print(f"API呼び出しエラー. ステータスコード:{status_code}")
            return []
        
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
            "problem_id" : problemId,
            "result_code" : resultCode
        })

    return res

def lambda_handler(event, context):
    # バリデーション
    if not is_validate(event):
        return []

    # 提出を全件取得
    submittions = collect_all_submittions(event["user"])

    # 結果を整理
    status = analyze_status_code(submittions)

    # 返り値成形
    res = make_response(status)

    return res
  