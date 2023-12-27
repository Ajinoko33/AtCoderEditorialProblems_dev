import os
import json

from aws_lambda_powertools.utilities.validation import SchemaValidationError, validate
import boto3

CLIENT = boto3.client("lambda")

INBOUND_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "required": ["writer"],
    "properties": {
        "writer": {
            "type": "string",
            "maxLength": 255
        },
        "user": {
            "type": "string",
            "maxLength": 255
        }
    },
}

def create_response(statusCode, body=""):
    if statusCode == 400:
        body = json.dumps({"message": "Internal Server Error"})
    elif statusCode == 500:
        body = json.dumps({"message": "Internal Server Error"})

    return {
        "statusCode": statusCode,
        'headers': {
            'Access-Control-Allow-Origin': os.environ["CORS_ORIGIN"],
        },
        "body": body
    }

def lambda_handler(event, context):
    # 入力バリデーション
    params = event["queryStringParameters"]
    try:
        validate(event=params, schema=INBOUND_SCHEMA)
    except SchemaValidationError as exception:
        # バリデーションエラー
        print("[ERROR] Input Validation Error")
        print("error detail : ", exception)
        return create_response(statusCode=400)

    # lambda呼び出し
    res = CLIENT.invoke(
        FunctionName="searchProblemsWithUserResultOption",
        LogType="Tail",
        Payload=json.dumps(params)
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

    # 正常系レスポンス
    return create_response(statusCode=200, body=res["Payload"].read())
