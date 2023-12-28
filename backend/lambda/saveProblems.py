import os
import textwrap

import psycopg2

# DB接続情報
CONN_INFO = f"host={os.environ['HOST']} port={os.environ['PORT']} dbname={os.environ['DBNAME']} user={os.environ['USER']} password={os.environ['PASSWORD']}"

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

def insert_problems(problems):
    # コンテストを洗い出す
    contests = {}
    for problem in problems:
        if problem["contest_id"] not in contests:
            contests[problem["contest_id"]] = problem["start_epoch_second"]

    # 登録処理
    try:
        with psycopg2.connect(CONN_INFO) as conn:
            with conn.cursor() as cur:
                # コンテストテーブルへ登録
                upsert_into_contests(contests, cur)

                # 問題テーブルへ登録
                upsert_into_problems(problems, cur)
    except Exception as exception:
        print("[ERROR] Error in DB Access")
        print("error detail : ", exception)
        raise exception

    return

def lambda_handler(event, context):
    # 格納
    insert_problems(event)

    return 
