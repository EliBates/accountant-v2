import { ArrowsPointingOutIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { incomeModalOpenState } from "../../utils/state";

const IncomeButton = () => {
  const [incomeModalOpen, setIncomeModalOpen] = useAtom(incomeModalOpenState);

  return (
    <>
      <button
        aria-label="Add Income"
        data-microtip-position="bottom"
        role="tooltip"
        className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
        onClick={() => setIncomeModalOpen(true)}
      >
        <ArrowsPointingOutIcon className="h-5 w-5" />
        <span className="absolute bottom-0 right-0">
          <PlusIcon className="h-4 w-4 text-green-500" />
        </span>
      </button>
    </>
  );
};

export default IncomeButton;
