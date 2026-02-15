import { QueryArrayConfig, QueryArrayResult } from "pg";

interface Client {
    query: (config: QueryArrayConfig) => Promise<QueryArrayResult>;
}

export const findUserByLoginIdQuery = `-- name: FindUserByLoginId :one
SELECT id, login_id, password_hash FROM app_user WHERE login_id = $1`;

export interface FindUserByLoginIdArgs {
    loginId: string;
}

export interface FindUserByLoginIdRow {
    id: string;
    loginId: string;
    passwordHash: string;
}

export async function findUserByLoginId(client: Client, args: FindUserByLoginIdArgs): Promise<FindUserByLoginIdRow | null> {
    const result = await client.query({
        text: findUserByLoginIdQuery,
        values: [args.loginId],
        rowMode: "array"
    });
    if (result.rows.length !== 1) {
        return null;
    }
    const row = result.rows[0];
    return {
        id: row[0],
        loginId: row[1],
        passwordHash: row[2]
    };
}

export const insertUserQuery = `-- name: InsertUser :exec
INSERT INTO app_user (id, login_id, password_hash) VALUES ($1, $2, $3)`;

export interface InsertUserArgs {
    id: string;
    loginId: string;
    passwordHash: string;
}

export async function insertUser(client: Client, args: InsertUserArgs): Promise<void> {
    await client.query({
        text: insertUserQuery,
        values: [args.id, args.loginId, args.passwordHash],
        rowMode: "array"
    });
}

export const findAllUsersQuery = `-- name: FindAllUsers :many
SELECT id, login_id, password_hash, created_at FROM app_user ORDER BY created_at DESC`;

export interface FindAllUsersRow {
    id: string;
    loginId: string;
    passwordHash: string;
    createdAt: Date;
}

export async function findAllUsers(client: Client): Promise<FindAllUsersRow[]> {
    const result = await client.query({
        text: findAllUsersQuery,
        values: [],
        rowMode: "array"
    });
    return result.rows.map(row => {
        return {
            id: row[0],
            loginId: row[1],
            passwordHash: row[2],
            createdAt: row[3]
        };
    });
}

export const deleteUserQuery = `-- name: DeleteUser :exec
DELETE FROM app_user WHERE id = $1`;

export interface DeleteUserArgs {
    id: string;
}

export async function deleteUser(client: Client, args: DeleteUserArgs): Promise<void> {
    await client.query({
        text: deleteUserQuery,
        values: [args.id],
        rowMode: "array"
    });
}

