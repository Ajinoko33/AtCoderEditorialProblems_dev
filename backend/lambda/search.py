import copy
import os
import json

import boto3

CLIENT = boto3.client("lambda")

def search_problems(writer):
    # Writer名から問題を検索
    res = CLIENT.invoke(
        FunctionName="searchProblems",
        LogType="Tail",
        Payload=json.dumps({
            "writer":writer
        })
    )

    if res["StatusCode"] != 200:
        print("Status code:", res["StatusCode"])
        raise RuntimeError("Lambda invocation error!")

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

    if res["StatusCode"] != 200:
        print("Status code:", res["StatusCode"])
        raise RuntimeError("Lambda invocation error!")
    
    return json.loads(res["Payload"].read())

def to_dict(source):
    # オブジェクトの配列をdict型に変換
    ret = {}
    for obj in source:
        ret[obj["problem_id"]] = obj["result_code"]
    
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
    params = event["queryStringParameters"]
    
    try:
        # Writer名から問題を検索
        problems = search_problems(params["writer"])
    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            'headers': {
                'Access-Control-Allow-Origin': os.environ["CORS_ORIGIN"],
            },
            "body": json.dumps({"message": "Internal Server Error"})
        }

    if "user" in params:
        try:
            # ユーザの提出AC状況を取得
            user_results = collect_user_results(params["user"])
        except Exception as e:
            print(e)
            return {
                "statusCode": 500,
                'headers': {
                    'Access-Control-Allow-Origin': os.environ["CORS_ORIGIN"],
                },
                "body": json.dumps({"message": "Internal Server Error"})
            }

        # 問題と統合
        problems = unite_results(problems, user_results)

    return {
        "statusCode": 200,
        'headers': {
            'Access-Control-Allow-Origin': os.environ["CORS_ORIGIN"],
        },
        "body": json.dumps(problems)
    }
