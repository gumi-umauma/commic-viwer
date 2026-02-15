import { Pool } from "pg";
import { User } from "@/domain/entities/user";
import { UserRepository } from "@/domain/repositories/user-repository";
import { UserId } from "@/domain/value-objects/user-id";
import {
  findUserByLoginId,
  findAllUsers,
  insertUser,
  deleteUser,
} from "@/infrastructure/db/user_sql";

export class PgUserRepository implements UserRepository {
  constructor(private readonly pool: Pool) {}

  async findAll(): Promise<User[]> {
    const rows = await findAllUsers(this.pool);
    return rows.map((row) =>
      User.reconstruct(
        UserId.create(row.id),
        row.loginId,
        row.passwordHash,
        row.createdAt
      )
    );
  }

  async findByLoginId(loginId: string): Promise<User | null> {
    const row = await findUserByLoginId(this.pool, { loginId });
    if (!row) return null;
    return User.reconstruct(
      UserId.create(row.id),
      row.loginId,
      row.passwordHash,
      new Date()
    );
  }

  async insert(user: User): Promise<void> {
    await insertUser(this.pool, {
      id: user.id.value,
      loginId: user.loginId,
      passwordHash: user.passwordHash,
    });
  }

  async delete(id: UserId): Promise<void> {
    await deleteUser(this.pool, { id: id.value });
  }
}
