-- 漫画テーブル
CREATE TABLE comic (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE comic IS '漫画作品';
COMMENT ON COLUMN comic.id IS 'ID';
COMMENT ON COLUMN comic.title IS 'タイトル';
COMMENT ON COLUMN comic.created_at IS '作成日時';
COMMENT ON COLUMN comic.updated_at IS '更新日時';
