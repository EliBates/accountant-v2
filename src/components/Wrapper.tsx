import clsx from "clsx";

interface Props {
  children: React.ReactNode;
}

const Wrapper = ({ children }: Props) => {
  return (
    <div
      className={clsx(
        "flex flex-row w-full h-full min-h-screen overflow-hidden items-stretch"
      )}
    >
      {children}
    </div>
  );
};

export default Wrapper;
