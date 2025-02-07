import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";

import ModalProvider from "@/providers/modal-provider";

type SetupLayoutProps = {
  children: React.ReactNode;
};

export default async function SetupLayout({ children }: SetupLayoutProps) {
  const { userId } = await auth();
  console.log(typeof userId);
  console.log(userId);
  const objectId = new ObjectId(userId as string);
  if (!userId) redirect("/sign-in");
  // const store = await prismadb.store.findFirst({
  //   where: { userId: objectId },
  // });

  // if (store) redirect(`/${store.id}`);

  return (
    <>
      <ModalProvider />
      {children}
    </>
  );
}
