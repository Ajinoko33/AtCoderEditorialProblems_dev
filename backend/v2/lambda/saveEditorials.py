import boto3

client = boto3.client("dynamodb")

# Lambdaの引数に渡されるeditorialをDynamoDBクライアントに渡す型に変換
def conver_editorial(editorial):
    upper_contest_id = editorial["contest_id"].upper()
    problem_index = editorial["problem_index"]
    editorial_type = "O" if editorial["is_official"] else "U"
    item = {
        "ItemId": {
            "S": f"E-{upper_contest_id}-{problem_index}-{editorial_type}-{editorial["writer_name"]}"
        },
        "ItemType": {
            "S": "Editorial"
        },
        "WriterName": {
            "S": editorial["writer_name"]
        },
        "ProblemName": {
            "S": editorial["problem_name"]
        },
        "ProblemTitle": {
            "S": editorial["problem_title"]
        },
        "ProblemIsExperimental": {
            "BOOL": editorial["problem_is_experimental"]
        },
        "ContestStartEpochSecond": {
            "N": str(editorial["contest_start_epoch_second"])
        }
    }

    if "problem_difficulty" in editorial:
        item["ProblemDifficulty"] = {
            "N": str(editorial["problem_difficulty"])
        }

    return item

# Writerを抽出し，DynamoDBクライアントに渡す型に変換
def create_writer_items(editorialItems):
    writer_names = set()
    for item in editorialItems:
        writer_names.add(item["WriterName"]["S"])

    return list(map(lambda writer_name: {
        "ItemId": {
            "S": f"W-{writer_name}"
        },
        "ItemType": {
            "S": "Writer"
        },
        "WriterName": {
            "S": writer_name
        }
    }, writer_names))

def upsert_editorials(editorial_items):
    for item in editorial_items:
        response = client.put_item(
            TableName="EditorialsWritersTable",
            Item=item
        )

        print("upsert editorials response:")
        print(response)

    return

def upsert_writers(writer_items):
    for item in writer_items:
        response = client.put_item(
            TableName="EditorialsWritersTable",
            Item=item
        )

        print("upsert editorials and writers response:")
        print(response)

    return

def lambda_handler(event, context):
    editorial_items = list(map(conver_editorial, event["editorials"]))

    # Writerを抽出
    writer_items = create_writer_items(editorial_items)

    # 格納
    upsert_editorials(editorial_items)
    upsert_writers(writer_items)

    print("upserted editorials:")
    print(editorial_items)
    print("upserted writers:")
    print(writer_items)

    return
