-- name: FindAllComics :many
-- 全漫画を取得
SELECT id, title FROM comic;

-- name: FindAllComicsWithVolumes :many
-- 巻が1件以上存在する漫画を取得
SELECT c.id, c.title FROM comic c
WHERE EXISTS (SELECT 1 FROM volume v WHERE v.comic_id = c.id);

-- name: FindComicById :one
-- 指定IDの漫画を取得
SELECT id, title FROM comic WHERE id = $1;

-- name: UpdateComicTitle :exec
-- 漫画タイトルを更新
UPDATE comic SET title = $2, updated_at = NOW() WHERE id = $1;

-- name: InsertComic :exec
-- 漫画を新規登録
INSERT INTO comic (id, title) VALUES ($1, $2);

-- name: FindComicByTitle :one
-- タイトルで漫画を検索
SELECT id, title FROM comic WHERE title = $1;

-- name: DeleteComic :exec
-- 漫画を削除（volumeはCASCADEで自動削除）
DELETE FROM comic WHERE id = $1;
