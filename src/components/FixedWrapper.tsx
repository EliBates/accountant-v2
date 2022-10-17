import clsx from "clsx";
import AccountsModal from "./Modal/AccountsModal";
import { PropsWithChildren } from "react";

const FixedWrapper = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className={clsx("flex h-full min-h-screen w-full flex-row items-stretch overflow-hidden md:h-screen")}>
        {children}
      </div>
      <AccountsModal />
    </>
  );
};

export default FixedWrapper;
