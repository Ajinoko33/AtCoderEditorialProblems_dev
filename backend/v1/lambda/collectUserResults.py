import json
import time
import re

import requests

# ユーザの提出を取得するAPIエンドポイント
API_URL = "https://kenkoooo.com/atcoder/atcoder-api/v3/user/submissions"
# 1回のリクエストで取得可能な提出数の最大値(AtCoder Problems APIでの上限)
MAX_SUBMISSION_NUMS = 500
# リクエスト間隔(秒)
REQUEST_INTERVAL = 1
# コンテストの正規表現パターン
CONTEST_PATTERN = r"^(abc|arc)\d{3}$"
# サーバと接続を確立するまでの待機時間(秒)
CONNECT_TIMEOUT = 3.5
# サーバがレスポンスを返すまでの待機時間(秒)
READ_TIMEOUT = 3.5

def collect_all_submissions(user):
    # 提出を全件取得
    headers = {'content-type': 'application/json'}
    params = {
        "user" : user,
        "from_second" : 0
    }
    last_second = 0
    last_nums = MAX_SUBMISSION_NUMS
    all_submissions = []

    try:
        while last_nums == MAX_SUBMISSION_NUMS:
            if last_second != 0:
                time.sleep(REQUEST_INTERVAL)

            params["from_second"] = last_second
            res = requests.get(
                API_URL,
                headers=headers,
                params=params,
                timeout=(CONNECT_TIMEOUT, READ_TIMEOUT)
            )
            if res.status_code != 200:
                # HTTPリクエストエラー
                res.raise_for_status()
            
            submissons = json.loads(res.text)
            all_submissions += submissons

            last_nums = len(submissons)
            if last_nums > 0:
                last_second = submissons[-1]["epoch_second"]
    except Exception as exception:
        print("[ERROR] Error in HTTP requests")
        print("error detail : ", exception)
        raise exception

    return all_submissions

def analyze_status_code(submissions):
    # 結果を整理
    # 結果コード(AC, Trying)
    ptn = re.compile(CONTEST_PATTERN)
    status = {}
    for subm in submissions:
        contestId = subm["contest_id"]
        if ptn.fullmatch(contestId) is None:
            # 対象外のコンテストは無視
            continue

        problemId = subm["problem_id"]
        resultCode = "AC" if subm["result"] == "AC" else "Trying"
        if problemId in status:
            if resultCode == "AC" or status[problemId] == "AC":
                status[problemId] = "AC"
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

def lambda_handler(event, context):
    # 提出を全件取得
    submissions = collect_all_submissions(event["user"])

    # 結果を整理
    status = analyze_status_code(submissions)

    # 返り値成形
    res = make_response(status)

    return res
  