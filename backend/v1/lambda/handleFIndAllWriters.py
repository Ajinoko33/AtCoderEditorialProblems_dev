import os
import json

import boto3

CLIENT = boto3.client("lambda")

def create_response(statusCode, body=""):
    if statusCode == 500:
        body = json.dumps({"message": "Internal Server Error"})

    return {
        "statusCode": statusCode,
        'headers': {
            'Access-Control-Allow-Origin': os.environ["CORS_ORIGIN"],
        },
        "body": body
    }

def lambda_handler(event, context):
    # lambda呼び出し
    res = CLIENT.invoke(
        FunctionName="findAllWriters",
        LogType="Tail",
    )

    if res["StatusCode"] != 200:
        # 呼び出しエラー
        print("[ERROR] Lambda Invocation Error")
        print("invocation result: ", res)
        return create_response(statusCode=500)

    if "FunctionError" in res:
        # 関数エラー
        print("[ERROR] Function Error")
        print("invocation result: ", res)
        return create_response(statusCode=500)

    return create_response(200, res["Payload"].read())
