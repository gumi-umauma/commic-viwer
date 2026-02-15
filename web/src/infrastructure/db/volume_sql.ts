import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findVolumesByComicIdQuery = `-- name: FindVolumesByComicId :many
SELECT id, comic_id, volume_number
FROM volume
WHERE comic_id = $1
ORDER BY volume_number`;

export interface FindVolumesByComicIdArgs {
    comicId: string;
}

export interface FindVolumesByComicIdRow {
    id: string;
    comicId: string;
    volumeNumber: number;
}

export async function findVolumesByComicId(client: Client, args: FindVolumesByComicIdArgs): Promise<FindVolumesByComicIdRow[]> {
    const result = await client.query({
        text: findVolumesByComicIdQuery,
        values: [args.comicId],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            comicId: row[1],
            volumeNumber: row[2]
        };
    });
}

export const findVolumeByComicIdAndNumberQuery = `-- name: FindVolumeByComicIdAndNumber :one
SELECT id, comic_id, volume_number
FROM volume
WHERE comic_id = $1 AND volume_number = $2`;

export interface FindVolumeByComicIdAndNumberArgs {
    comicId: string;
    volumeNumber: number;
}

export interface FindVolumeByComicIdAndNumberRow {
    id: string;
    comicId: string;
    volumeNumber: number;
}

export async function findVolumeByComicIdAndNumber(client: Client, args: FindVolumeByComicIdAndNumberArgs): Promise<FindVolumeByComicIdAndNumberRow | null> {
    const result = await client.query({
        text: findVolumeByComicIdAndNumberQuery,
        values: [args.comicId, args.volumeNumber],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        comicId: row[1],
        volumeNumber: row[2]
    };
}

export const insertVolumeQuery = `-- name: InsertVolume :exec
INSERT INTO volume (id, comic_id, volume_number) VALUES ($1, $2, $3)`;

export interface InsertVolumeArgs {
    id: string;
    comicId: string;
    volumeNumber: number;
}

export async function insertVolume(client: Client, args: InsertVolumeArgs): Promise<void> {
    await client.query({
        text: insertVolumeQuery,
        values: [args.id, args.comicId, args.volumeNumber],
        rowMode: "array"
    });
}

export const deleteVolumeByComicIdAndNumberQuery = `-- name: DeleteVolumeByComicIdAndNumber :exec
DELETE FROM volume WHERE comic_id = $1 AND volume_number = $2`;

export interface DeleteVolumeByComicIdAndNumberArgs {
    comicId: string;
    volumeNumber: number;
}

export async function deleteVolumeByComicIdAndNumber(client: Client, args: DeleteVolumeByComicIdAndNumberArgs): Promise<void> {
    await client.query({
        text: deleteVolumeByComicIdAndNumberQuery,
        values: [args.comicId, args.volumeNumber],
        rowMode: "array"
    });
}

