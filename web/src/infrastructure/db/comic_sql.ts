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

