import { ArrowsPointingOutIcon, MinusIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { expenseModalOpenState } from "../../utils/state";

const ExpenseButton = () => {
  const [expenseModalOpen, setExpenseModalOpen] = useAtom(expenseModalOpenState);

  return (
    <button
      aria-label="Add Expense"
      data-microtip-position="bottom"
      role="tooltip"
      className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
      onClick={() => setExpenseModalOpen(true)}
    >
      <ArrowsPointingOutIcon className="h-5 w-5" />
      <span className="absolute bottom-0 right-0">
        <MinusIcon className="h-4 w-4 text-red-500" />
      </span>
    </button>
  );
};

export default ExpenseButton;
