# URL一覧

## 認証

| 画面名 | メソッド | URL | 備考 |
| ------ | -------- | --- | ---- |
| ログイン | GET | /login | 未認証時のリダイレクト先 |

## ユーザー機能

| 画面名 | メソッド | URL | 備考 |
| ------ | -------- | --- | ---- |
| 作品一覧 | GET | /comics | `/` からリダイレクト |
| 作品詳細 | GET | /comic/{id} | |
| ビューアー | GET | /comic/{id}/volume/{number} | |

## 管理機能

| 画面名 | メソッド | URL | 備考 |
| ------ | -------- | --- | ---- |
| 漫画管理一覧 | GET | /admin/comics | |
| 漫画管理詳細 | GET | /admin/comic/{id} | |
| 漫画新規登録 | GET | /admin/comic/register | |
| 巻追加 | GET | /admin/volume/register | |
| ユーザー管理 | GET | /admin/user | ユーザー一覧・登録・削除 |

## API

todo あとでOpen API形式作成してからリンク張る。
