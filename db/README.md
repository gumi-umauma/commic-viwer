# db/

データベース関連のソースファイルと中間生成物を管理するディレクトリ。

## 構成

```
db/
├── schema/          # スキーマ定義（DDL）
│   └── *.sql
└── tbls/            # tbls関連ファイル
    ├── .tbls.yml    # tbls設定
    ├── schema.json  # DBスキーマのJSON表現（CIの入力ソース）
    └── table.md.tmpl # カスタムテンプレート
```

## 設計書の更新方法

スキーマを変更したら、以下の手順で `schema.json` を更新する。
テーブル定義ドキュメントとER図の生成はCIが自動で行う。

ローカルDBに接続し、最新のスキーマをJSONとして出力してコミットする。

```bash
source .env.local && tbls out -t json -o db/tbls/schema.json $TBLS_DSN
```

### ローカルで確認したい場合

CIに頼らず手元で確認したい場合は、以下を実行する。

```bash
# テーブル定義ドキュメント生成
tbls doc --rm-dist --config db/tbls/.tbls.yml json://db/tbls/schema.json

# ER図生成
npm run erd
```

生成物は `docs/db/` 以下に出力される。

## 関連ファイル

| ファイル | 用途 |
|---------|------|
| `db/tbls/.tbls.yml` | tbls設定 |
| `db/tbls/schema.json` | DBスキーマのJSON表現（CIの入力ソース） |
| `db/tbls/table.md.tmpl` | カスタムテンプレート（コメント列を2列目に配置） |
| `docs/db/tables/` | tblsが生成するテーブル定義（GitHub Pages） |
| `docs/db/erd/` | Liam ERDが生成するER図（GitHub Pages） |
| `.github/workflows/deploy-docs.yml` | ドキュメント生成・デプロイのCIワークフロー |
