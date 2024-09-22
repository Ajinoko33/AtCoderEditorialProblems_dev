import datetime
import json
import math

import boto3

CLIENT = boto3.client("lambda")

# 1週間の長さ(秒)
ONE_WEEK_EPOCH_SECOND = 7 * 24 * 60 * 60

def lambda_handler(event, context):
    # 入力値作成
    now = math.ceil(datetime.datetime.now().timestamp())
    payload = {
        "from_epoch_second": now - ONE_WEEK_EPOCH_SECOND,
        "to_epoch_second": now
    }

    # lambda呼び出し(非同期処理)
    res = CLIENT.invoke(
        FunctionName="collectProblems",
        InvocationType="Event",
        LogType="Tail",
        Payload=json.dumps(payload)
    )

    if res["StatusCode"] != 202:
        print("[ERROR] Lambda Invocation Error")
        print("invocation result: ", res)
        raise RuntimeError("Lambda Invocation Error")

    return
