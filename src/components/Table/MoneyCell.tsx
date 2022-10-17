import { Transaction } from "@prisma/client";
import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import { useRef, useState } from "react";
import { trpc } from "../../utils/trpc";

interface Props {
  info: CellContext<Transaction, bigint>;
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

  const formatAsString = (number: bigint): string => {
    const convertedNumber = Number(number);
    if (isNaN(convertedNumber)) {
      return props.formatter ? props.formatter("0") : moneyFormat.format(0);
    }
    const dollars = convertedNumber / 100;
    return props.formatter ? props.formatter(dollars + "") : moneyFormat.format(dollars);
  };

  const initialValue = getValue();
  const [value, setValue] = useState<string>(formatAsString(initialValue));
  const [editing, setEditing] = useState(false);
  const textInput = useRef<HTMLInputElement>(null);
  const updateTransaction = trpc.transaction.update.useMutation();
  const utils = trpc.useContext();

  const formatAsDatabaseValue = (text: string) => {
    const cleanNumber = parseFloat(text.replaceAll(/^(\,)|(\$)+/g, ""));
    if (isNaN(cleanNumber)) return 0n;
    return BigInt(Math.round(cleanNumber * 100));
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
    const databaseValue = formatAsDatabaseValue(value);
    const displayValue = formatAsString(databaseValue);
    setValue(displayValue);
    table.options.meta?.updateData(index, id, databaseValue);
    updateTransaction.mutate(
      {
        id: props.info.row.original.id,
        amount: databaseValue,
      },
      {
        onSuccess: () => {
          utils.transaction.invalidate();
        },
      }
    );
  };

  return (
    <>
      {editing ? (
        <input
          ref={textInput}
          type="text"
          value={value}
          onBlur={stopEditing}
          onChange={(e) => setValue(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              stopEditing();
            }
          }}
          className={clsx("w-[120px] max-w-[120px] rounded-md py-2 pl-1 pr-4 text-left text-sm")}
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
              "text-red-200": Number(value) === 0,
            })}
          >
            {value + ""}
          </span>
        </button>
      )}
    </>
  );
};

export default MoneyCell;
