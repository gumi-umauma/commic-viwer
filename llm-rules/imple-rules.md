# 実装フェーズ ルール

## 目的

TDD + クリーンアーキテクチャで依存性が明確で変更容易性が高いコードを実装する。

---

## TDD（テスト駆動開発）

現在の構成からどのようなテスト設計ができるかユーザーが把握できていないため、初回実装ではスキップしそのごテスト設計を行う

### サイクル

1. **Red** - 失敗するテストを先に書く
2. **Green** - テストが通る最小限の実装を書く
3. **Refactor** - コードを整理する（テストは通ったまま）

---

## クリーンアーキテクチャ

### 層構造

```
Presentation層 → Application層 → Domain層 ← Infrastructure層
```

### 依存ルール

| 層             | 依存先         | 役割                                                     |
| -------------- | -------------- | -------------------------------------------------------- |
| Domain         | なし（最重要） | エンティティ、値オブジェクト、リポジトリインターフェース |
| Application    | Domain層のみ   | ユースケース                                             |
| Infrastructure | Domain層       | リポジトリ実装、外部サービス                             |
| Presentation   | Application層  | コントローラー、API                                      |

### パッケージ構成

```
backend/src/main/kotlin/com/example/manga/
├── domain/           # Domain層
├── application/      # Application層（UseCase）
├── presentation/     # Presentation層（API）
└── infrastructure/   # Infrastructure層
```

---

## 軽量DDD（部分採用）

DDDのパターンを全て厳密に適用するのではなく、クリーンアーキテクチャをベースに有用なパターンを部分採用する。

### 採用するパターン

| パターン                       | 適用方法                                           |
| ------------------------------ | -------------------------------------------------- |
| **ユビキタス言語**             | glossary.md の用語をコードでそのまま使用           |
| **エンティティにロジック集約** | ビジネスルール・不変条件はエンティティに書く       |
| **値オブジェクト**             | ID（WorkId, VolumeId等）、将来的に他の値も         |
| **リポジトリパターン**         | Domain層にインターフェース、Infrastructure層に実装 |

### 緩く扱うパターン

| パターン | 方針                                                                                      |
| -------- | ----------------------------------------------------------------------------------------- |
| **集約** | Work / Volume / Reader を別リポジトリとし、柔軟に取得可能にする。厳密な集約境界は設けない |

### 採用しないパターン

- ドメインイベント（今回のスコープ外）
- ファクトリ（必要になったら検討）

---

## エラー表現

### Result型を使う場面

ビジネスロジックで起こりうるエラーは Result型（sealed interface）で表現:

- 命名: `{操作名}Result`（例: `GetWorkResult`, `AddBookmarkResult`）
- 成功ケース: `Success`
- エラーケース: 具体的な名前（`NotFound`, `AlreadyExists`, `InvalidInput` など）

### 例外を使う場面

以下の場合のみ例外を使用:

- **プログラムのバグ**（IllegalStateException, IllegalArgumentException）
- **インフラ層の障害**（DB接続エラーなど、回復不能なエラー）
- **フレームワークが期待する例外**（Spring Security の認証エラーなど）

---

## コーディング規約

### 命名規則

| 対象       | ルール              | 例                  |
| ---------- | ------------------- | ------------------- |
| クラス名   | PascalCase          | `WorkRepository`    |
| 関数名     | camelCase           | `findById`          |
| 変数名     | camelCase           | `workList`          |
| 定数       | UPPER_SNAKE_CASE    | `MAX_PAGE_SIZE`     |
| ファイル名 | PascalCase (Kotlin) | `WorkRepository.kt` |

### Kotlin固有

- `data class` をエンティティ・値オブジェクトに使用
- null安全を活用（`?`と`!!`の使い分け）
- 拡張関数を適切に使用

**値オブジェクトの特徴:**

- 不変（immutable）
- 等価性は値で判断（IDではない）
- バリデーションを `init` ブロックで行う
- ID は `@JvmInline value class` で軽量化

```

**エンティティの特徴:**

- IDで識別される
- ビジネスロジック・不変条件を持つ
- 可能な限り immutable（copy で新インスタンス生成）

### TypeScript/React固有

- 型定義を必ず行う（安易な`any`禁止）
- コンポーネントは関数コンポーネントで記述
- App Router のルール（Server Components優先）に従う

---

## 禁止事項

---

## 変更履歴

| 日付       | 変更内容                                  |
| ---------- | ----------------------------------------- |
| 2026-01-25 | 再作成（system-reminderの情報を基に復元） |
```
