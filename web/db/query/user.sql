-- name: FindUserByLoginId :one
-- ログインIDでユーザーを検索
SELECT id, login_id, password_hash FROM app_user WHERE login_id = $1;

-- name: InsertUser :exec
-- ユーザーを新規登録
INSERT INTO app_user (id, login_id, password_hash) VALUES ($1, $2, $3);

-- name: FindAllUsers :many
-- 全ユーザーを取得（作成日時の降順）
SELECT id, login_id, password_hash, created_at FROM app_user ORDER BY created_at DESC;

-- name: DeleteUser :exec
-- ユーザーを削除
DELETE FROM app_user WHERE id = $1;
