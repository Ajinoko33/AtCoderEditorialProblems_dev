import datetime
import json
import math

import boto3

CLIENT = boto3.client("lambda")

def lambda_handler(event, context):
    # 入力値作成
    ONE_WEEK_EPOCH_SECOND = 7 * 24 * 60 * 60
    NOW = math.ceil(datetime.datetime.now().timestamp())
    payload = {
        "from_epoch_second": NOW - ONE_WEEK_EPOCH_SECOND,
        "to_epoch_second": NOW
    }

    # lambda呼び出し(非同期処理)
    res = CLIENT.invoke(
        FunctionName="collectProblems",
        InvocationType="Event",
        LogType="Tail",
        Payload=json.dumps(payload)
    )

    if res["StatusCode"] != 202:
        print("Status code:", res["StatusCode"])
        raise RuntimeError("Lambda invocation error!")

    return
