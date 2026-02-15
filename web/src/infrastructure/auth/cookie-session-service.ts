import { createHmac } from "node:crypto";

export class CookieSessionService {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }

  sign(loginId: string): string {
    const signature = createHmac("sha256", this.secret)
      .update(loginId)
      .digest("hex");
    return `${loginId}.${signature}`;
  }

  verify(cookieValue: string): string | null {
    const dotIndex = cookieValue.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const loginId = cookieValue.substring(0, dotIndex);
    const signature = cookieValue.substring(dotIndex + 1);

    const expected = createHmac("sha256", this.secret)
      .update(loginId)
      .digest("hex");

    if (signature !== expected) return null;

    return loginId;
  }
}
