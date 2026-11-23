import { getSession } from "./session";

/** Dashboard/admin JWT user id (Store.userId). Not customer Better Auth. */
export async function getAdminUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.id ?? null;
}
