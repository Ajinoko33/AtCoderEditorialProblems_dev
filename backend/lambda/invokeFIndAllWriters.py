import json

import boto3

CLIENT = boto3.client("lambda")

def find_all_writers():
    res = CLIENT.invoke(
        FunctionName="findAllWriters",
        LogType="Tail",
    )

    if res["StatusCode"] != 200:
        print("Status code:", res["StatusCode"])
        raise RuntimeError("Lambda invocation error!")

    return res["Payload"].read()

def lambda_handler(event, context):
    # lambda呼び出し
    try:
        res = find_all_writers()
    except Exception as e:
        print(e)
        return {
            "statusCode": 500,
            "body": json.dumps({"message": "Internal Server Error"})
        }

    return res
