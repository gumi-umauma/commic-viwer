import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findAllComicsQuery = `-- name: FindAllComics :many
SELECT id, title FROM comic`;

export interface FindAllComicsRow {
    id: string;
    title: string;
}

export async function findAllComics(client: Client): Promise<FindAllComicsRow[]> {
    const result = await client.query({
        text: findAllComicsQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            title: row[1]
        };
    });
}

export const findAllComicsWithVolumesQuery = `-- name: FindAllComicsWithVolumes :many
SELECT c.id, c.title FROM comic c
WHERE EXISTS (SELECT 1 FROM volume v WHERE v.comic_id = c.id)`;

export interface FindAllComicsWithVolumesRow {
    id: string;
    title: string;
}

export async function findAllComicsWithVolumes(client: Client): Promise<FindAllComicsWithVolumesRow[]> {
    const result = await client.query({
        text: findAllComicsWithVolumesQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            title: row[1]
        };
    });
}

export const findComicByIdQuery = `-- name: FindComicById :one
SELECT id, title FROM comic WHERE id = $1`;

export interface FindComicByIdArgs {
    id: string;
}

export interface FindComicByIdRow {
    id: string;
    title: string;
}

export async function findComicById(client: Client, args: FindComicByIdArgs): Promise<FindComicByIdRow | null> {
    const result = await client.query({
        text: findComicByIdQuery,
        values: [args.id],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        title: row[1]
    };
}

export const updateComicTitleQuery = `-- name: UpdateComicTitle :exec
UPDATE comic SET title = $2, updated_at = NOW() WHERE id = $1`;

export interface UpdateComicTitleArgs {
    id: string;
    title: string;
}

export async function updateComicTitle(client: Client, args: UpdateComicTitleArgs): Promise<void> {
    await client.query({
        text: updateComicTitleQuery,
        values: [args.id, args.title],
        rowMode: "array"
    });
}

