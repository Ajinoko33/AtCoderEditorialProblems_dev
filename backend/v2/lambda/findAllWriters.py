import boto3

client = boto3.client("dynamodb")

def find_all_writers():
    # 全件取得
    response = client.query(
        TableName="EditorialsWritersTable",
        IndexName="ItemType-WriterName-index",
        ExpressionAttributeValues={
            ":itemType": {
                "S": "Writer"
            }
        },
        KeyConditionExpression="ItemType = :itemType",
    )

    # 一次元リストに変換して返す
    res = [item["WriterName"]["S"] for item in response["Items"]]
    return res

def lambda_handler(event, context):
    # 全件取得
    res = find_all_writers()

    return res
