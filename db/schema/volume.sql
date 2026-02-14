-- 巻テーブル
CREATE TABLE volume (
    id TEXT PRIMARY KEY,
    comic_id TEXT NOT NULL REFERENCES comic(id),
    volume_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (comic_id, volume_number)
);

COMMENT ON TABLE volume IS '巻';
COMMENT ON COLUMN volume.id IS 'ID';
COMMENT ON COLUMN volume.comic_id IS '漫画ID';
COMMENT ON COLUMN volume.volume_number IS '巻数';
COMMENT ON COLUMN volume.created_at IS '作成日時';
COMMENT ON COLUMN volume.updated_at IS '更新日時';
