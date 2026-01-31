# db/

データベース関連のソースファイルと中間生成物を管理するディレクトリ。

## 構成

```
db/
├── .tbls.yml        # tbls設定
├── schema/          # スキーマ定義（DDL）- 全アプリ共通
│   └── *.sql
└── out/             # 中間生成ファイル（コミット対象外可）
    └── schema.json  # tbls出力
```

## 設計書の更新方法

スキーマを変更したら、以下の手順で設計書を更新する。

### 1. tbls でJSON出力

```bash
cd db && tbls out -t json -o out/schema.json
```

### 2. Liam ERDで可視化（docs/db/erd/ に出力）

```bash
npm run erd
```

## 関連ファイル

| ファイル | 用途 |
|---------|------|
| `db/.tbls.yml` | tbls設定 |
| `docs/db/` | 公開用ドキュメント（GitHub Pages） |
