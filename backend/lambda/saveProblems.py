import os
import textwrap

from aws_lambda_powertools.utilities.validation import validator
import psycopg2

INBOUND_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "array",
    "items": {
        "type": "object",
        "required": ["id", "contest_id", "start_epoch_second", "problem_index", "name", "title", "writer"],
        "properties": {
            "id": {
                "type": "string",
                "maxLength": 255
            },
            "contest_id": {
                "type": "string",
                "maxLength": 255
            },
            "start_epoch_second": {
                "type": "integer"
            },
            "problem_index": {
                "type": "string",
                "maxLength": 255
            },
            "name": {
                "type": "string",
                "maxLength": 255
            },
            "title": {
                "type": "string",
                "maxLength": 255
            },
            "difficulty": {
                "type": "integer"
            },
            "writer": {
                "type": "string",
                "maxLength": 255
            }
        },
        "additionalProperties": False
    }
}

def get_dsn():
    # DB接続情報を返す
    HOST = os.environ["HOST"]
    PORT = os.environ["PORT"]
    DBNAME = os.environ["DBNAME"]
    USER = os.environ["USER"]
    PASSWORD = os.environ["PASSWORD"]
    return f"host={HOST} port={PORT} dbname={DBNAME} user={USER} password={PASSWORD}"

def upsert_into_contests(contests, cur):
    if len(contests.keys()) == 0:
        return

    # SQL作成
    sql = "INSERT INTO contests (id, start_epoch_second) VALUES"
    sql += ",".join(["(%s, %s)"] * len(contests))
    sql += "ON CONFLICT (id) DO NOTHING;"
    
    # テーブルへ登録
    data = []
    for id, ses in contests.items():
        data.append(id)
        data.append(ses)
    cur.execute(sql, data)

    return

def upsert_into_problems(problems, cur):
    if len(problems) == 0:
        return
    
    # SQL作成
    value_tmpl = "(%s, %s, %s, %s, %s, %s, %s)"
    sql = "INSERT INTO problems (id, problem_index, name, title, difficulty, contest_id, writer) VALUES"
    sql += ",".join([textwrap.dedent(value_tmpl)] * len(problems))
    sql += "ON CONFLICT (id) DO NOTHING;"

    # テーブルへ登録
    data = []
    for problem in problems:
        data.append(problem["id"])
        data.append(problem["problem_index"])
        data.append(problem["name"])
        data.append(problem["title"])
        data.append(problem["difficulty"] if "difficulty" in problem else None)
        data.append(problem["contest_id"])
        data.append(problem["writer"])
    cur.execute(sql, data)

    return

def insert_problems(problems, dsn):
    # コンテストを洗い出す
    contests = {}
    for problem in problems:
        if problem["contest_id"] not in contests:
            contests[problem["contest_id"]] = problem["start_epoch_second"]

    # 登録処理
    with psycopg2.connect(dsn) as con:
        with con.cursor() as cur:
            # コンテストテーブルへ登録
            upsert_into_contests(contests, cur)

            # 問題テーブルへ登録
            upsert_into_problems(problems, cur)

    return

@validator(inbound_schema=INBOUND_SCHEMA)
def lambda_handler(event, context):
    # DB接続情報を取得
    dsn = get_dsn()

    # 格納
    insert_problems(event, dsn)

    return 
