const { loadEnvConfig } = require("@next/env");
const bcrypt = require("bcryptjs");
const { MongoClient, ObjectId } = require("mongodb");

loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const roles = [
  { name: "SUPER", description: "Full access to every store and setting" },
  { name: "ADMIN", description: "Manage the store catalog and settings" },
  { name: "SUBADMIN", description: "Limited store administration" },
  { name: "CUSTOMER", description: "Storefront customer account" },
  { name: "USER", description: "Default authenticated user" },
];

const defaultPassword = process.env.SEED_DEFAULT_PASSWORD || "FoxStore@2026!";

const users = [
  {
    email: "super@fox-store.com",
    name: "Super Admin",
    role: "SUPER",
    password: process.env.SEED_SUPER_PASSWORD || defaultPassword,
  },
  {
    email: "admin@fox-store.com",
    name: "Store Admin",
    role: "ADMIN",
    password: process.env.SEED_ADMIN_PASSWORD || defaultPassword,
  },
];

async function main() {
  const uri = process.env.DATABASE_URL;
  if (!uri) throw new Error("DATABASE_URL is not set");

  const client = new MongoClient(uri);
  await client.connect();

  try {
    const rolesCollection = client.db().collection("Role");
    const roleIds = new Map();

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
      roleIds.set(saved.name, saved._id);
      console.log(`role ready: ${saved.name} (${saved._id})`);
    }

    const count = await rolesCollection.countDocuments();
    console.log(`total roles: ${count}`);

    // === Admin Users ===
    const usersCollection = client.db().collection("User");

    for (const user of users) {
      const roleId = roleIds.get(user.role);
      if (!roleId) {
        throw new Error(`Role ${user.role} is missing for ${user.email}`);
      }

      const existing = await usersCollection.findOne({ email: user.email });
      if (existing) {
        await usersCollection.updateOne(
          { _id: existing._id },
          {
            $set: {
              name: user.name,
              roleId,
              updatedAt: new Date(),
            },
            $unset: { role: "" },
          }
        );
        console.log(`user ready: ${user.email} (${user.role}, existing)`);
      } else {
        const now = new Date();
        const passwordHash = await bcrypt.hash(user.password, 10);
        await usersCollection.insertOne({
          _id: new ObjectId(),
          email: user.email,
          password: passwordHash,
          name: user.name,
          roleId,
          createdAt: now,
          updatedAt: now,
        });
        console.log(`user created: ${user.email} (${user.role})`);
      }
    }

    const userCount = await usersCollection.countDocuments();
    console.log(`total users: ${userCount}`);

    // === Category Image Migration ===
    // Seed imageUrl for existing categories that don't have one yet
    const categoriesCollection = client.db().collection("Category");
    const categoriesWithoutImage = await categoriesCollection.find({
      imageUrl: { $exists: false },
    }).toArray();

    if (categoriesWithoutImage.length > 0) {
      const bulk = categoriesCollection.initializeUnorderedBulkOp();
      categoriesWithoutImage.forEach((cat) => {
        bulk.find({ _id: cat._id }).updateOne({
          $set: {
            imageUrl: `/catalog/category-default-${cat._id.toString().slice(0, 4)}.jpg`,
          },
        });
      });
      await bulk.execute();
      console.log(
        `Category migration: updated ${categoriesWithoutImage.length} categories with default imageUrl`
      );
    } else {
      console.log("Category migration: all categories already have imageUrl");
    }

    // === Product Image Migration (optional) ===
    const productsCollection = client.db().collection("Product");
    const productsWithoutImage = await productsCollection.find({
      imageUrl: { $exists: false },
    }).toArray();

    if (productsWithoutImage.length > 0) {
      const bulk = productsCollection.initializeUnorderedBulkOp();
      productsWithoutImage.forEach((prod) => {
        bulk.find({ _id: prod._id }).updateOne({
          $set: {
            imageUrl: `/catalog/placeholder-${prod._id.toString().slice(0, 4)}.jpg`,
          },
        });
      });
      await bulk.execute();
      console.log(
        `Product migration: updated ${productsWithoutImage.length} products with placeholder imageUrl`
      );
    } else {
      console.log("Product migration: all products already have imageUrl");
    }
  } finally {
    await client.close();
  }
}

main().catch((error) => {
  console.error("[seed] failed:", error);
  process.exitCode = 1;
});
