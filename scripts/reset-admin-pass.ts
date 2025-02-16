import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  const hashedPassword = await hashPassword("admin123");
  console.log("UPDATE users SET password = '" + hashedPassword + "' WHERE email = 'admin@resumate.com';");
}

main().catch(console.error);
