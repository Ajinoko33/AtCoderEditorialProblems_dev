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
            p.problem_index,
            c.start_epoch_second
        FROM
            problems p
        INNER JOIN
            contests c
        ON
            p.contest_id = c.id
        WHERE
            p.writer = %s;"""
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
            "contest" : row["id"][:6].upper(),
            "category" : row["id"][:3].upper(),
            "name" : row["name"],
            "difficulty" : row["difficulty"],
            "id" : row["id"],
            "start_epoch_second" : row["start_epoch_second"],
            "problem_index" : row["problem_index"]
        }

    return list(map(convert, data))

def lambda_handler(event, context):
    # 検索処理
    res = find_problems_by_writer(event["writer"])

    # 返り値生成
    ret = make_response(res)

    return ret
