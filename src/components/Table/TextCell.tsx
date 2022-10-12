import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import { Transaction } from "./TransactionTable";

interface Props {
  info: CellContext<Transaction, string>;
  formatter?: (value: string) => string;
  emptyMessage?: string;
  style?: string;
}

const TextCell = (props: Props) => {
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
    table.options.meta?.updateData(index, id, value);
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
            "rounded-md py-2 pl-1 pr-4 text-left text-sm",
            props.style
          )}
        />
      ) : (
        <button
          onClick={startEditing}
          className={clsx(
            "w-[200px] max-w-[200px] rounded-md border border-transparent py-2 pr-4 text-left hover:border-gray-400 hover:pl-1",
            props.style
          )}
        >
          <span
            className={clsx("block truncate font-semibold", {
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

export default TextCell;
