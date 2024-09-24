import copy
import json

import boto3

CLIENT = boto3.client("lambda")

def check_error(res):
    if res["StatusCode"] != 200:
        # 呼び出しエラー
        print("[ERROR] Lambda Invocation Error")
        print("invocation result: ", res)
        raise RuntimeError("Lambda Invocation Error")

    if "FunctionError" in res:
        # 関数エラー
        print("[ERROR] Function Error")
        print("invocation result: ", res)
        raise RuntimeError("Function Error")

    return

def search_problems(writer):
    # Writer名から問題を検索
    res = CLIENT.invoke(
        FunctionName="searchProblemsByWriter",
        LogType="Tail",
        Payload=json.dumps({
            "writer":writer
        })
    )

    check_error(res)

    return json.loads(res["Payload"].read())


def collect_user_results(user):
    # ユーザのAC状況を取得
    res = CLIENT.invoke(
        FunctionName="collectUserResults",
        LogType="Tail",
        Payload=json.dumps({
            "user":user
        })
    )

    check_error(res)

    return json.loads(res["Payload"].read())

def to_dict(source):
    # オブジェクトの配列をdict型に変換
    ret = {}
    for obj in source:
        ret[obj["id"]] = obj["result_code"]

    return ret

def unite_results(problems, user_results):
    # 問題にユーザのAC状況を合わせる
    result_codes = to_dict(user_results)
    ret = []
    for problem in problems:
        united_problem = copy.deepcopy(problem)
        problem_id = united_problem["problem_id"]
        if problem_id in result_codes:
            united_problem["result_code"] = result_codes[problem_id]
        ret.append(united_problem)

    return ret

def lambda_handler(event, context):
        # Writer名から問題を検索
    problems = search_problems(event["writer"])

    if "user" in event:
        # ユーザの提出AC状況を取得
        user_results = collect_user_results(event["user"])

        # 問題と統合
        problems = unite_results(problems, user_results)

    return problems
