-- 漫画テーブル
CREATE TABLE comic (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL
);

COMMENT ON TABLE comic IS '漫画作品';
COMMENT ON COLUMN comic.id IS 'ID';
COMMENT ON COLUMN comic.title IS 'タイトル';
