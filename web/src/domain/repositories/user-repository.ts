import { User } from "@/domain/entities/user";
import { UserId } from "@/domain/value-objects/user-id";

export interface UserRepository {
  findAll(): Promise<User[]>;
  findByLoginId(loginId: string): Promise<User | null>;
  insert(user: User): Promise<void>;
  delete(id: UserId): Promise<void>;
}
