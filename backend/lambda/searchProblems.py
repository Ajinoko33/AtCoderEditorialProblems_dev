import textwrap
import os

from aws_lambda_powertools.utilities.validation import validator
import psycopg2
from psycopg2.extras import DictCursor

INBOUND_SCHEMA = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "type": "object",
    "requierd": ["writer"],
    "properties": {
        "writer": {
            "type": "string",
            "maxLength": 255
        }
    },
    "additionalProperties": False
}

def connect_db():
    # DBに接続
    HOST = os.environ["HOST"]
    PORT = os.environ["PORT"]
    DBNAME = os.environ["DBNAME"]
    USER = os.environ["USER"]
    PASSWORD = os.environ["PASSWORD"]
    tgt = f"host={HOST} port={PORT} dbname={DBNAME} user={USER} password={PASSWORD}"
    
    return psycopg2.connect(tgt)
    
def select_problems_by_writer(writer, con):
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
    cur = con.cursor(cursor_factory=DictCursor)
    cur.execute(textwrap.dedent(sql), data)

    # dict型のリストに変換して返す
    return list(map(dict, cur.fetchall()))

def make_response(data):
    # オブジェクト変換
    def convert(row):
        obj = {}
        obj["contest"] = row["id"][:6].upper()
        obj["category"] = row["id"][:3].upper()
        obj["name"] = row["name"]
        obj["difficulty"] = row["difficulty"]
        obj["id"] = row["id"]
        obj["start_epoch_second"] = row["start_epoch_second"]
        obj["problem_index"] = row["problem_index"]
        return obj

    ret = list(map(convert, data))
    return ret

@validator(inbound_schema=INBOUND_SCHEMA)
def lambda_handler(event, context):
    # DBに接続
    con = connect_db()

    # 検索処理
    res = select_problems_by_writer(event["writer"], con)

    # 返り値生成
    ret = make_response(res)

    return ret
