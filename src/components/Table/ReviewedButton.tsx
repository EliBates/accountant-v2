import { CheckIcon } from "@heroicons/react/24/solid";
import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Transaction } from "./TransactionTable";

interface Props {
  info: CellContext<Transaction, string>;
  initialValue: Boolean;
}

const ReviewedButton = (props: Props) => {
  const {
    getValue,
    row: { index },
    column: { id },
    table,
  } = props.info;

  const initialValue = props.initialValue;
  const [value, setValue] = useState<Boolean>(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <button
      onClick={() => {
        //@ts-ignore
        table.options.meta?.updateData(index, id, true);
      }}
      className={clsx(
        "rounded-full border border-blue-200 p-2 hover:border-green-200 hover:bg-green-200"
      )}
    >
      <CheckIcon className="h-4 w-4" />
    </button>
  );
};

export default ReviewedButton;
