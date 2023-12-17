import itertools
import textwrap
import os

import psycopg2
from psycopg2.extras import DictCursor

def connect_db():
    # DBに接続
    HOST = os.environ["HOST"]
    PORT = os.environ["PORT"]
    DBNAME = os.environ["DBNAME"]
    USER = os.environ["USER"]
    PASSWORD = os.environ["PASSWORD"]
    tgt = f"host={HOST} port={PORT} dbname={DBNAME} user={USER} password={PASSWORD}"
    
    return psycopg2.connect(tgt)

def find_all_writers(con):
    # 全件取得
    sql = """\
        SELECT DISTINCT
            p.writer
        FROM
            problems p
        ORDER BY
            p.writer;"""
    cur = con.cursor(cursor_factory=DictCursor)
    cur.execute(textwrap.dedent(sql))

    # 一次元リストに変換して返す
    return list(itertools.chain.from_iterable(cur.fetchall()))

def lambda_handler(event, context):
    # DBに接続
    con = connect_db()

    # 全件取得
    res = find_all_writers(con)

    return res
