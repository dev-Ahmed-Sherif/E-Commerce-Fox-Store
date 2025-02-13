// import { useEffect } from "react";
import { useStoreModal } from "@/hooks/use-store-modal";

export const revalidate = 0;

const SetupPage = () => {
  const isOpen = useStoreModal((state) => state.isOpen);
  const onOpen = useStoreModal((state) => state.onOpen);

  // useEffect(() => {
  //   if (!isOpen) {
  //     onOpen();
  //   }
  // }, [isOpen, onOpen]);

  return <div>Root Page</div>;
};

export default SetupPage;
