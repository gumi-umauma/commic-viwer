-- name: FindVolumesByComicId :many
-- 指定漫画の全巻を巻数順で取得
SELECT id, comic_id, volume_number
FROM volume
WHERE comic_id = $1
ORDER BY volume_number;

-- name: FindVolumeByComicIdAndNumber :one
-- 指定漫画の指定巻数の巻を取得
SELECT id, comic_id, volume_number
FROM volume
WHERE comic_id = $1 AND volume_number = $2;
