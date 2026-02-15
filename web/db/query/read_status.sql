-- name: FindReadVolumeIdsByUserAndComic :many
SELECT rs.volume_id FROM read_status rs
JOIN volume v ON v.id = rs.volume_id
WHERE rs.user_id = $1 AND v.comic_id = $2;

-- name: InsertReadStatus :exec
INSERT INTO read_status (user_id, volume_id) VALUES ($1, $2)
ON CONFLICT DO NOTHING;

-- name: DeleteReadStatus :exec
DELETE FROM read_status WHERE user_id = $1 AND volume_id = $2;

-- name: FindReadStatus :one
SELECT user_id, volume_id FROM read_status WHERE user_id = $1 AND volume_id = $2;
