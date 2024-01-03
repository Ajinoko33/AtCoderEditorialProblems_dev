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
    # オブジェクト変換
    def convert(row):
        return {
            "contest" : row["contest_id"].upper(),
            "category" : row["contest_id"][:3].upper(),
            "name" : row["name"],
            "difficulty" : row["difficulty"],
            "id" : row["id"],
            "start_epoch_second" : row["start_epoch_second"],
            "problem_index" : row["problem_index"],
            "is_official" : row["is_official"],
            "is_experimental": row["is_experimental"]
        }

    return list(map(convert, data))

def lambda_handler(event, context):
    # 検索処理
    res = find_problems_by_writer(event["writer"])

    # 返り値生成
    ret = make_response(res)

    return ret
