import boto3

client = boto3.client("dynamodb")

def convert_item(item):
    # DynamoDBからのレスポンスのItemの型を扱いやすい型に変換
    split_item_id = item["ItemId"]["S"].split('-')
    contest_id = split_item_id[1]
    problem_index = split_item_id[2]
    editorial_type =  "official" if split_item_id[3] == "O" else "user"
    ret = {
        "id" : item["ItemId"]["S"],
        "contest" : contest_id,
        "category" : contest_id[:3],
        "name" : item["ProblemName"]["S"],
        "start_epoch_second" : int(item["ContestStartEpochSecond"]["N"]),
        "problem_index" : problem_index,
        "editorial_type" : editorial_type,
        "is_experimental": item["ProblemIsExperimental"]["BOOL"],
        "problem_id": item["ProblemId"]["S"]
    }

    if "ProblemDifficulty" in item:
        ret["difficulty"] = int(item["ProblemDifficulty"]["N"])

    return ret

def find_problems_by_writer(writer):
    # 検索処理
    response = client.query(
        TableName="EditorialsWritersTable",
        IndexName="WriterName-ItemType-index",
        ExpressionAttributeValues={
            ":writerName": {
                "S": writer
            },
            ":itemType": {
                "S": "Editorial"
            }
        },
        KeyConditionExpression="WriterName = :writerName AND ItemType = :itemType",
    )

    return list(map(convert_item, response["Items"]))

def make_response(data):
    # 解説タイプをまとめる
    # 一つの問題に同一筆者が公式・ユーザ解説の両方を書いている場合があるため
    problems = {}
    for datum in data:
        key = datum["contest"] + datum["problem_index"]
        if key in problems:
            if datum["editorial_type"] not in problems[key]["editorial_types"]:
                problems[key]["editorial_types"].append(datum["editorial_type"])
        else:
            problems[key] = {
                "id" : datum["id"],
                "contest" : datum["contest"],
                "category" : datum["category"],
                "name" : datum["name"],
                "start_epoch_second" : datum["start_epoch_second"],
                "problem_index" : datum["problem_index"],
                "editorial_types" : [datum["editorial_type"]],
                "is_experimental": datum["is_experimental"],
                "problem_id": datum["problem_id"]
            }
            if "difficulty" in datum:
                problems[key]["difficulty"] = datum["difficulty"]

    return list(problems.values())

def lambda_handler(event, context):
    # 検索処理
    data = find_problems_by_writer(event["writer"])

    # 返り値生成
    ret = make_response(data)

    return ret
