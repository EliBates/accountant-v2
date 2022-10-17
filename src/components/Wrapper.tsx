import clsx from "clsx";
import AccountsModal from "./Modal/AccountsModal";

interface Props {
  children: React.ReactNode;
}

const Wrapper = ({ children }: Props) => {
  return (
    <>
      <div className={clsx("flex h-full min-h-screen w-full flex-row items-stretch overflow-hidden")}>{children}</div>
      <AccountsModal />
    </>
  );
};

export default Wrapper;
