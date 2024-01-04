import textwrap
import os

import psycopg2
from psycopg2.extras import DictCursor

# DB接続情報
CONN_INFO = f"host={os.environ['HOST']} port={os.environ['PORT']} dbname={os.environ['DBNAME']} user={os.environ['USER']} password={os.environ['PASSWORD']}"

def find_problems_by_writer(writer):
    # 検索処理
    sql = """\
        SELECT
            p.id,
            p.name,
            p.difficulty,
            cp.problem_index,
            c.start_epoch_second,
            e.is_official,
            p.is_experimental,
            c.id contest_id
        FROM
            editorials e
        INNER JOIN
            problems p
        ON
            e.problem_id = p.id
        INNER JOIN
            contests_problems cp
        ON
            e.problem_id = cp.problem_id
        INNER JOIN
            contests c
        ON
            cp.contest_id = c.id
        WHERE
            e.writer = %s;"""
    data = (writer,)

    res = []
    with psycopg2.connect(CONN_INFO) as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur.execute(textwrap.dedent(sql), data)
            res = list(map(dict, cur.fetchall()))

    return res

def make_response(data):
    # 解説タイプをまとめる
    # 一つの問題に同一筆者が公式・ユーザ解説の両方を書いている場合があるため
    problems = {}
    for row in data:
        key = row["contest_id"] + row["problem_index"]
        editorial_type = "official" if row["is_official"] else "user"
        if key in problems:
            if editorial_type not in problems[key]["editorial_types"]:
                problems[key]["editorial_types"].append(editorial_type)
        else:
            problems[key] = {
                "id" : row["id"],
                "contest" : row["contest_id"].upper(),
                "category" : row["contest_id"][:3].upper(),
                "name" : row["name"],
                "difficulty" : row["difficulty"],
                "start_epoch_second" : row["start_epoch_second"],
                "problem_index" : row["problem_index"],
                "editorial_types" : [editorial_type],
                "is_experimental": row["is_experimental"]
            }

    return list(problems.values())

def lambda_handler(event, context):
    # 検索処理
    res = find_problems_by_writer(event["writer"])

    # 返り値生成
    ret = make_response(res)

    return ret
