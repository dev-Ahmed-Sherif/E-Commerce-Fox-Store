import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { nextCookies } from "better-auth/next-js";
import { MongoClient } from "mongodb";

const globalForMongo = globalThis as unknown as {
  _foxAuthMongoClient?: MongoClient;
  _foxAuthMongoConnect?: Promise<MongoClient>;
};

function getMongoUri() {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error("DATABASE_URL is required for customer auth");
  }
  return uri;
}

/**
 * Atlas (`mongodb+srv`) and explicit replicaSet URIs support transactions.
 * Local standalone MongoDB does not — pass `transaction: false` or omit client.
 */
function mongoSupportsTransactions(uri: string) {
  return (
    uri.startsWith("mongodb+srv://") ||
    /[?&]replicaSet=/i.test(uri) ||
    process.env.BETTER_AUTH_MONGO_TRANSACTIONS === "true"
  );
}

function getMongoClient() {
  const uri = getMongoUri();

  if (!globalForMongo._foxAuthMongoClient) {
    globalForMongo._foxAuthMongoClient = new MongoClient(uri);
  }

  return globalForMongo._foxAuthMongoClient;
}

/** Ensure the shared client is connected (idempotent). */
export function connectCustomerAuthMongo() {
  const client = getMongoClient();
  if (!globalForMongo._foxAuthMongoConnect) {
    globalForMongo._foxAuthMongoConnect = client
      .connect()
      .catch((error) => {
        globalForMongo._foxAuthMongoConnect = undefined;
        throw error;
      });
  }
  return globalForMongo._foxAuthMongoConnect;
}

const uri = getMongoUri();
const client = getMongoClient();
const db = client.db();
const supportsTransactions = mongoSupportsTransactions(uri);

// Kick off connect early so index creation is less likely to race a cold client.
void connectCustomerAuthMongo().catch((error) => {
  console.error(
    "[customer-auth] MongoDB connect failed:",
    error instanceof Error ? error.message : error
  );
});

const googleConfigured =
  Boolean(process.env.GOOGLE_CLIENT_ID) &&
  Boolean(process.env.GOOGLE_CLIENT_SECRET);

/**
 * Customer storefront auth (email/password + Google).
 * Mounted at /api/customer-auth to avoid clashing with admin JWT routes at /api/auth/*.
 */
export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
    // Standalone local Mongo cannot run multi-doc transactions.
    transaction: supportsTransactions,
  }),
  baseURL: process.env.BETTER_AUTH_URL,
  basePath: "/api/customer-auth",
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    ...(googleConfigured
      ? {
          google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            prompt: "select_account" as const,
          },
        }
      : {}),
  },
  user: {
    modelName: "customer_user",
  },
  session: {
    modelName: "customer_session",
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60,
    },
  },
  account: {
    modelName: "customer_account",
  },
  verification: {
    modelName: "customer_verification",
  },
  plugins: [nextCookies()],
});

export type CustomerSession = typeof auth.$Infer.Session;
