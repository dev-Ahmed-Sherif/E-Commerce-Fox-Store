const { loadEnvConfig } = require("@next/env");
const { MongoClient } = require("mongodb");

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

/**
 * Backfills User.roleId for documents created while Role was still a Prisma
 * enum (they only have a `role` string such as "ADMIN" or "CUSTOMER").
 *
 * Usage: npm run db:migrate-roles
 */
async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set");

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const db = client.db();
    const roles = await db.collection("Role").find({}).toArray();
    const rolesByName = new Map(roles.map((role) => [role.name, role._id]));

    if (rolesByName.size === 0) {
      throw new Error("No Role documents found. Run `npm run db:seed` first.");
    }

    const users = await db
      .collection("User")
      .find({ roleId: { $exists: false } })
      .toArray();

    let migrated = 0;
    let skipped = 0;

    for (const user of users) {
      const legacyRole = String(user.role || "CUSTOMER").toUpperCase();
      const roleId = rolesByName.get(legacyRole) ?? rolesByName.get("CUSTOMER");

      if (!roleId) {
        skipped += 1;
        console.warn(`skipped ${user.email || user._id}: no matching role`);
        continue;
      }

      await db.collection("User").updateOne(
        { _id: user._id },
        {
          $set: { roleId },
          $unset: { role: "" },
          $currentDate: { updatedAt: true },
        }
      );
      migrated += 1;
      console.log(`migrated ${user.email || user._id}: ${legacyRole}`);
    }

    console.log(`done: ${migrated} migrated, ${skipped} skipped`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("[migrate-roles] failed:", error);
  process.exitCode = 1;
});
