import json
import urllib.request
import gzip
import chardet

url = 'https://kenkoooo.com/atcoder/resources/problems.json'

def getHttpEX(_url):
  with urllib.request.urlopen(_url) as res:
    dec = None
    data = None
    
    dec = gzip.GzipFile(fileobj=res)
      
    try:
      data = dec.read()
    except Exception as e:
      data = res.read()
    enc = chardet.detect(data)['encoding']
    
    return data.decode(enc)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Cookie":"token=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",
    "Accept":"text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding":"gzip, deflate, br",
    "Cache-Control":"max-age=0"
}

req = urllib.request.Request(url=url, headers=headers)

result = getHttpEX(req)
j = json.loads(result)

maxLen = 0
str = ""
for p in j:
  if p["contest_id"][:3] not in ["abc","arc","agc"]:
    continue
  maxLen = max(maxLen, len(p["title"]))
  if maxLen == len(p["title"]):
    str=p["title"]

print(maxLen)
print(str)
