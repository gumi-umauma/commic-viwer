-- 漫画テーブル
CREATE TABLE comic (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
);

COMMENT ON TABLE comic IS '漫画作品の基本情報';
COMMENT ON COLUMN comic.id IS '作品の一意識別子';
COMMENT ON COLUMN comic.title IS '作品タイトル';
