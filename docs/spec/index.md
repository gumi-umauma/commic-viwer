---
title: 機能仕様
---

## [URL一覧](./urls.md)

### URL設計方針

- 一覧は複数形（`/comics`）
- 特定リソースは単数形（`/comic/[id]`）

## API仕様

- [ページ画像取得API](./api/)

## 画面仕様

### ユーザー機能

| 画面名     | 仕様書                                 |
| ---------- | -------------------------------------- |
| 作品一覧   | [comics-list.md](./user/comics-list.md)     |
| 作品詳細   | [comic-detail.md](./user/comic-detail.md)   |
| ビューアー | [volume-viewer.md](./user/volume-viewer.md) |

### 管理機能

| 画面名       | 仕様書                                       |
| ------------ | -------------------------------------------- |
| 漫画管理一覧 | [comics-list.md](./admin/comics-list.md)     |
