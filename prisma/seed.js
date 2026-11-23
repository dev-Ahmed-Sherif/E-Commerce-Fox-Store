const { loadEnvConfig } = require("@next/env");
const { MongoClient, ObjectId } = require("mongodb");

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const roles = [
  { name: "SUPER", description: "Full access to every store and setting" },
  { name: "ADMIN", description: "Manage the store catalog and settings" },
  { name: "SUBADMIN", description: "Limited store administration" },
  { name: "CUSTOMER", description: "Storefront customer account" },
  { name: "USER", description: "Default authenticated user" },
];

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set");

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const rolesCollection = client.db().collection("Role");

    for (const role of roles) {
      const now = new Date();
      // updateOne + upsert works on standalone MongoDB, unlike Prisma's
      // upsert/create which need a replica set for transactions.
      await rolesCollection.updateOne(
        { name: role.name },
        {
          $setOnInsert: {
            _id: new ObjectId(),
            ...role,
            createdAt: now,
            updatedAt: now,
          },
        },
        { upsert: true }
      );

      const saved = await rolesCollection.findOne({ name: role.name });
      console.log(`role ready: ${saved.name} (${saved._id})`);
    }

    const count = await rolesCollection.countDocuments();
    console.log(`total roles: ${count}`);
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("[seed] failed:", error);
  process.exitCode = 1;
});
