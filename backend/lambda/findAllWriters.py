import itertools
import textwrap
import os

import psycopg2
from psycopg2.extras import DictCursor

# DB接続情報
CONN_INFO = f"host={os.environ['HOST']} port={os.environ['PORT']} dbname={os.environ['DBNAME']} user={os.environ['USER']} password={os.environ['PASSWORD']}"

def find_all_writers():
    # 全件取得
    sql = """\
        SELECT DISTINCT
            p.writer
        FROM
            problems p
        ORDER BY
            p.writer;"""
    
    res = []
    with psycopg2.connect(CONN_INFO) as conn:
        with conn.cursor(cursor_factory=DictCursor) as cur:
            cur = conn.cursor(cursor_factory=DictCursor)
            cur.execute(textwrap.dedent(sql))
            res = list(itertools.chain.from_iterable(cur.fetchall()))

    # 一次元リストに変換して返す
    return res

def lambda_handler(event, context):
    # 全件取得
    res = find_all_writers()

    return res
