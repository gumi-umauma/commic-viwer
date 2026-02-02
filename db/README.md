# db/

データベース関連のソースファイルと中間生成物を管理するディレクトリ。

## 構成

```
db/
├── schema/          # スキーマ定義（DDL）
│   └── *.sql
└── tbls/            # tbls関連ファイル
    ├── .tbls.yml    # tbls設定
    ├── schema.json  # tbls出力（JSON）
    └── table.md.tmpl # カスタムテンプレート
```

## 設計書の更新方法

スキーマを変更したら、以下の手順で設計書を更新する。

### 1. tbls でドキュメント出力

```bash
source .env.local && tbls doc $TBLS_DSN --config db/tbls/.tbls.yml --force
```

### 2. tbls でJSON出力（ERD用）

```bash
source .env.local && tbls out -t json -o db/tbls/schema.json $TBLS_DSN
```

### 3. Liam ERDで可視化（docs/db/erd/ に出力）

```bash
npm run erd
```

## 関連ファイル

| ファイル | 用途 |
|---------|------|
| `db/tbls/.tbls.yml` | tbls設定 |
| `db/tbls/table.md.tmpl` | カスタムテンプレート（コメント列を2列目に配置） |
| `docs/db/` | 公開用ドキュメント（GitHub Pages） |
