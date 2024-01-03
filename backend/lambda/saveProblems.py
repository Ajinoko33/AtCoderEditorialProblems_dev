import os

import psycopg2

# DB接続情報
CONN_INFO = f"host={os.environ['HOST']} port={os.environ['PORT']} dbname={os.environ['DBNAME']} user={os.environ['USER']} password={os.environ['PASSWORD']}"

def upsert_into_contests(contests, cur):
    if len(contests) == 0:
        return

    # SQL作成
    sql = "INSERT INTO contests (id, start_epoch_second) VALUES"
    sql += ",".join(["(%s, %s)"] * len(contests))
    sql += "ON CONFLICT (id) DO NOTHING;"
    
    # テーブルへ登録
    data = []
    for contest in contests:
        data.append(contest["id"])
        data.append(contest["start_epoch_second"])
    cur.execute(sql, data)

    return

def upsert_into_problems(problems, cur):
    if len(problems) == 0:
        return
    
    # SQL作成
    sql = "INSERT INTO problems (id, problem_index, name, title, difficulty, contest_id) VALUES"
    sql += ",".join(["(%s, %s, %s, %s, %s, %s)"] * len(problems))
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
    cur.execute(sql, data)

    return

def upsert_into_editorials(editorials, cur):
    if len(editorials) == 0:
        return
    
    # SQL作成
    sql = "INSERT INTO editorials (problem_id, writer, is_official) VALUES"
    sql += ",".join(["(%s, %s, %s)"] * len(editorials))
    sql += "ON CONFLICT (problem_id, writer, is_official) DO NOTHING;"

    # テーブルへの登録
    data = []
    for editorial in editorials:
        data.append(editorial["problem_id"])
        data.append(editorial["writer"])
        data.append(editorial["is_official"])
    cur.execute(sql, data)

    return

def lambda_handler(event, context):
    contests = event["contests"]
    problems = event["problems"]
    editorials = event["editorials"]

    # 格納
    with psycopg2.connect(CONN_INFO) as conn:
        with conn.cursor() as cur:
            # コンテストテーブルへ登録
            upsert_into_contests(contests, cur)

            # 問題テーブルへ登録
            upsert_into_problems(problems, cur)

            # 解説テーブルへ登録
            upsert_into_editorials(editorials, cur)

    return 
