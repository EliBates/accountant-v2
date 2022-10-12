import clsx from "clsx";
import BottomControl from "./BottomControl";
import TopControl from "./TopControl";

const TopSideNavPanel = () => {
  return (
    <div className={clsx("flex flex-col px-4 py-2")}>
      <TopControl />
      <BottomControl />
    </div>
  );
};

export default TopSideNavPanel;
