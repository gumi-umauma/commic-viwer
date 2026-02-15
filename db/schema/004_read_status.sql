-- 既読状態テーブル
CREATE TABLE read_status (
    user_id TEXT NOT NULL REFERENCES app_user(id) ON DELETE CASCADE,
    volume_id TEXT NOT NULL REFERENCES volume(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_id, volume_id)
);

COMMENT ON TABLE read_status IS '既読状態';
COMMENT ON COLUMN read_status.user_id IS 'ユーザーID';
COMMENT ON COLUMN read_status.volume_id IS '巻ID';
COMMENT ON COLUMN read_status.created_at IS '作成日時';
