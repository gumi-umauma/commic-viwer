import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findReadVolumeIdsByUserAndComicQuery = `-- name: FindReadVolumeIdsByUserAndComic :many
SELECT rs.volume_id FROM read_status rs
JOIN volume v ON v.id = rs.volume_id
WHERE rs.user_id = $1 AND v.comic_id = $2`;

export interface FindReadVolumeIdsByUserAndComicArgs {
    userId: string;
    comicId: string;
}

export interface FindReadVolumeIdsByUserAndComicRow {
    volumeId: string;
}

export async function findReadVolumeIdsByUserAndComic(client: Client, args: FindReadVolumeIdsByUserAndComicArgs): Promise<FindReadVolumeIdsByUserAndComicRow[]> {
    const result = await client.query({
        text: findReadVolumeIdsByUserAndComicQuery,
        values: [args.userId, args.comicId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            volumeId: row[0]
        };
    });
}

export const insertReadStatusQuery = `-- name: InsertReadStatus :exec
INSERT INTO read_status (user_id, volume_id) VALUES ($1, $2)
ON CONFLICT DO NOTHING`;

export interface InsertReadStatusArgs {
    userId: string;
    volumeId: string;
}

export async function insertReadStatus(client: Client, args: InsertReadStatusArgs): Promise<void> {
    await client.query({
        text: insertReadStatusQuery,
        values: [args.userId, args.volumeId],
        rowMode: "array"
    });
}

export const deleteReadStatusQuery = `-- name: DeleteReadStatus :exec
DELETE FROM read_status WHERE user_id = $1 AND volume_id = $2`;

export interface DeleteReadStatusArgs {
    userId: string;
    volumeId: string;
}

export async function deleteReadStatus(client: Client, args: DeleteReadStatusArgs): Promise<void> {
    await client.query({
        text: deleteReadStatusQuery,
        values: [args.userId, args.volumeId],
        rowMode: "array"
    });
}

export const findReadStatusQuery = `-- name: FindReadStatus :one
SELECT user_id, volume_id FROM read_status WHERE user_id = $1 AND volume_id = $2`;

export interface FindReadStatusArgs {
    userId: string;
    volumeId: string;
}

export interface FindReadStatusRow {
    userId: string;
    volumeId: string;
}

export async function findReadStatus(client: Client, args: FindReadStatusArgs): Promise<FindReadStatusRow | null> {
    const result = await client.query({
        text: findReadStatusQuery,
        values: [args.userId, args.volumeId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        userId: row[0],
        volumeId: row[1]
    };
}

