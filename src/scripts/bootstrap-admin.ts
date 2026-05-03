import { eq } from "drizzle-orm";
import { db } from "~/lib/db";
import { admins } from "~/lib/db/schema";
import { hashPassword } from "~/lib/auth/password";
import "dotenv/config";

function readArg(name: string) {
  const index = process.argv.findIndex((arg) => arg === `--${name}`);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

async function main() {
  const email = readArg("email");
  const password = readArg("password");

  if (!email || !password) {
    console.error(
      "Usage: npm run admin:bootstrap -- --email you@example.com --password yourpassword",
    );
    process.exit(1);
  }

  const [existing] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, email))
    .limit(1);

  if (existing) {
    console.error(`Admin with email ${email} already exists.`);
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await db.insert(admins).values({
    email,
    passwordHash,
  });

  console.log(`Admin account created for ${email}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
