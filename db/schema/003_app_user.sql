-- ユーザーテーブル
CREATE TABLE app_user (
    id TEXT PRIMARY KEY,
    login_id TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE app_user IS 'ユーザー';
COMMENT ON COLUMN app_user.id IS 'ID';
COMMENT ON COLUMN app_user.login_id IS 'ログインID';
COMMENT ON COLUMN app_user.password_hash IS 'パスワードハッシュ';
COMMENT ON COLUMN app_user.created_at IS '作成日時';
COMMENT ON COLUMN app_user.updated_at IS '更新日時';
