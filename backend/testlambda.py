import textwrap
import os
import json

import psycopg2
from psycopg2.extras import DictCursor

def get_dsn():
    # DB接続情報を返す
    HOST = os.environ["HOST"]
    PORT = os.environ["PORT"]
    DBNAME = os.environ["DBNAME"]
    USER = os.environ["USER"]
    PASSWORD = os.environ["PASSWORD"]
    return f"host={HOST} port={PORT} dbname={DBNAME} user={USER} password={PASSWORD}"

def search_problems(writer, dsn):
    with psycopg2.connect(dsn) as con:
        with con.cursor(cursor_factory=DictCursor) as cur:
            # 検索
            sql = """\
                SELECT
                    *
                FROM
                    problems p
                INNER JOIN
                    writers w
                ON
                    p.writer_id = w.id
                WHERE
                    w.name = %s;"""
            data = (writer,)
            cur.execute(sql,data)

            print(cur.fetchall())

    return

def lambda_handler(event, context):
    # writer検索

    # DB接続情報を取得
    dsn = get_dsn()

    # 検索
    search_problems(event["writer"], dsn)

    return
