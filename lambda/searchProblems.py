import os

import psycopg2
from psycopg2.extras import DictCursor

def is_validate(event):
    # バリデーション
    if "writer" not in event:
        return False
    
    return True

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
    sql = \
        "SELECT" \
        "    p.id, " \
        "    p.title, " \
        "    p.difficulty, " \
        "    c.start_epoch_second, " \
        "    pi.sort_order " \
        "FROM" \
        "    problems p " \
        "INNER JOIN" \
        "    contests c " \
        "ON" \
        "    p.contest_id = c.id " \
        "INNER JOIN" \
        "    problem_index pi " \
        "ON" \
        "    p.index_id = pi.id " \
        "INNER JOIN" \
        "    writers w " \
        "ON" \
        "    p.writer_id = w.id " \
        "WHERE" \
        "    w.name = %s;"
    data = (writer,)
    cur = con.cursor(cursor_factory=DictCursor)
    cur.execute(sql, data)

    # dict型のリストに変換して返す
    return list(map(dict, cur.fetchall()))

def make_response(data):
    # オブジェクト変換
    def convert(row):
        obj = {}
        obj["contest"] = row["id"][:6].upper()
        obj["category"] = row["id"][:3].upper()
        obj["title"] = row["title"]
        obj["difficulty"] = row["difficulty"]
        obj["problem_id"] = row["id"]
        obj["start_epoch_second"] = row["start_epoch_second"]
        obj["sort_order"] = row["sort_order"]
        return obj

    ret = list(map(convert, data))
    return ret

def lambda_handler(event, context):
    # バリデーション
    if not is_validate(event):
        return []
    
    # DBに接続
    con = connect_db()

    # 検索処理
    res = select_problems_by_writer(event["writer"], con)

    # 返り値生成
    ret = make_response(res)

    return ret
