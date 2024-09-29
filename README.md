# AtCoder Editorial Problems (dev)

[AtCoder Editorial Problems](https://ajinoko33.github.io/AtCoderEditorialProblems/)の開発用リポジトリです。

### static exportの手順

1. `/frontend/atcoder-editorial-problems/next.config.js`内の`basePath`, `trailingSlash`のコメントアウトを外す．
2. `/frontend/atcoder-editorial-problems`でbuild. `/frontend/atcoder-editorial-problems/out`に出力される．
```bash
npm run build
```

### OpenAPIのバンドル

[Redocly CLI](https://redocly.com/docs/cli)を使用してOpenAPIをバンドルする．

1. (初回のみ)Redocly CLIをインストール．

```bash
npm i -g @redocly/cli@latest
```

2. バンドルする．`/openapi`配下の`output`ディレクトリに出力される．

```bash
redocly bundle
```

### バックログ

- 未完了
  - difficulty filterのもっさりUI解消
  - drawioでシステム構成図作成
  - OpenAPIからAPI Gateway生成
  - ヘルプページをMarkdownで記述
  - ヘルプページの全リンク末尾に新しいタブで開くアイコンを表示
- 完了
  - orvalでOpenAPIからAPIクライアント生成(2024/09/29)
  - 永続層をRDSから低コストのサービス(DynamoDB)に変更(2024/09/24)
  - コンボボックス内の絞り込みで大文字/小文字を区別しないようにする(2024/09/24)
