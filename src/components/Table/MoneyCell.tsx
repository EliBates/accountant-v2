import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Transaction } from "./TransactionTable";

interface Props {
  info: CellContext<Transaction, string>;
  formatter?: (value: string) => string;
  emptyMessage?: string;
}

const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const MoneyCell = (props: Props) => {
  const {
    getValue,
    row: { index },
    column: { id },
    table,
  } = props.info;

  const initialValue = getValue();
  const [value, setValue] = useState<string>(initialValue);

  const [editing, setEditing] = useState(false);
  const textInput = useRef<HTMLInputElement>(null);

  const getFormattedValue = () => {
    if (value === "") return props?.emptyMessage ?? "⚠️ Empty";

    if (props.formatter) {
      return props.formatter(value);
    }
    return value;
  };

  const startEditing = () => {
    setEditing(true);
    setTimeout(() => {
      textInput.current?.select();
      textInput.current?.focus();
    }, 100);
  };

  const stopEditing = () => {
    setEditing(false);
    let num = parseFloat(value);
    if (isNaN(num)) {
      setValue("0");
      num = 0;
    }
    table.options.meta?.updateData(index, id, num);
  };

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <>
      {editing ? (
        <input
          ref={textInput}
          type="text"
          value={value as string}
          onBlur={stopEditing}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              stopEditing();
            }
          }}
          className={clsx(
            "w-[120px] max-w-[120px] rounded-md py-2 pl-1 pr-4 text-left text-sm"
          )}
        />
      ) : (
        <button
          onClick={startEditing}
          className={clsx(
            "w-[120px] max-w-[120px] rounded-md border border-transparent py-2 pr-4 text-left hover:border-gray-400 hover:pl-1"
          )}
        >
          <span
            className={clsx("block font-semibold", {
              "text-red-200": value === "",
            })}
          >
            {getFormattedValue()}
          </span>
        </button>
      )}
    </>
  );
};

export default MoneyCell;
