import { createColumnHelper, flexRender, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { useReducer, useState } from "react";
import IndeterminateCheckbox from "./IndeterminateCheckbox";
import DatePickerCell from "./DatePickerCell";
import TextCell from "./TextCell";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import OptionsMenu from "./OptionsMenu";
import { uuid } from "uuidv4";
import MoneyCell from "./MoneyCell";
import { ArrowDownTrayIcon, ArrowsPointingOutIcon, MinusIcon, PlusIcon } from "@heroicons/react/20/solid";
import { useAtom } from "jotai";
import { expenseModalOpenState, incomeModalOpenState } from "../../utils/state";
import IncomeModal from "../Modal/IncomeModal";
import ExpenseModal from "../Modal/ExpenseModal";

export interface Transaction {
  uuid: string;
  type: string;
  date: string;
  description: string;
  account: string;
  category: string;
  amount: string;
  reviewed: boolean;
}

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const defaultData: Transaction[] = [
  {
    uuid: "2fd32eff-bd5c-4098-b135-4d7bb00bccdd",
    type: "income",
    date: "2021-01-01",
    description: "Groceries",
    account: "Checking",
    category: "Food",
    amount: "100",
    reviewed: false,
  },
  {
    uuid: "7ad262e9-46ed-4191-9bd7-f4ff2c93ae21",
    type: "income",
    date: "2021-01-02",
    description: "Rent",
    account: "Checking",
    category: "Rent",
    amount: "1000",
    reviewed: true,
  },
];

const columnHelper = createColumnHelper<Transaction>();

const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TransactionTable = () => {
  const rerender = useReducer(() => ({}), {})[1];
  const [rowSelection, setRowSelection] = useState({});
  const [deleteSelection, setDeleteSelection] = useState({});
  const [expenseModalOpen, setExpenseModalOpen] = useAtom(expenseModalOpenState);
  const [incomeModalOpen, setIncomeModalOpen] = useAtom(incomeModalOpenState);

  // get all transaction accounts with query trpc query

  const columns = [
    columnHelper.display({
      id: "check",
      cell: ({ row }) => (
        <IndeterminateCheckbox
          {...{
            checked: row.getIsSelected(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler(),
          }}
        />
      ),
    }),
    columnHelper.accessor("date", {
      header: () => "Date",
      cell: (info) => <DatePickerCell info={info} />,
    }),
    columnHelper.accessor("description", {
      header: () => "Description",
      cell: (info) => <TextCell info={info} emptyMessage={"⚠️ Write a Description"} />,
    }),
    columnHelper.accessor("account", {
      header: () => "Account",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("category", {
      header: () => "Category",
      cell: (info) => info.renderValue(),
    }),
    columnHelper.accessor("amount", {
      header: () => "Amount",
      cell: (info) => <MoneyCell info={info} formatter={(value) => moneyFormat.format(Number(value) || 0)} />,
    }),
    columnHelper.accessor("reviewed", {
      header: () => "Actions",
      cell: (info) => {
        const {
          row,
          column: { id: columnId },
          table: updateTable,
        } = info;
        return (
          <div className="space-x-2">
            {row.original.reviewed ? (
              <button
                onClick={() => {
                  updateTable.options.meta?.updateData(row?.index, columnId, false);
                }}
                className={clsx(
                  "rounded-full border border-green-400 bg-green-400 p-2 text-white hover:border-green-300 hover:bg-green-200"
                )}
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={() => {
                  updateTable.options.meta?.updateData(row?.index, columnId, true);
                }}
                className={clsx("rounded-full border border-blue-200 p-2 hover:border-green-300 hover:bg-green-200")}
              >
                <CheckIcon className="h-4 w-4" />
              </button>
            )}
            <OptionsMenu info={info} />
          </div>
        );
      },
    }),
  ];

  const [data, setData] = useState(() => [...defaultData]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setData((old) =>
          old.map((row, index) => {
            if (index === rowIndex) {
              return {
                ...old[rowIndex]!,
                [columnId]: value,
              };
            }
            return row;
          })
        );
      },
    },
  });

  return (
    <div className="shadow-sm ring-1 ring-black ring-opacity-5">
      <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center space-x-2">
          <IndeterminateCheckbox
            {...{
              checked: table.getIsAllRowsSelected(),
              indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
          <span>Select All</span>
          <div className="space-x-4 px-4">
            <button
              onClick={() => {
                const selectedRows = table.getSelectedRowModel().rows;
                if (selectedRows.length > 0) {
                  setData((old) => {
                    // check if all selected rows are reviewed
                    const allReviewed = selectedRows.every((row) => row.original.reviewed);

                    const updatedRows = selectedRows.map((row) => {
                      if (allReviewed) {
                        return {
                          ...row.original,
                          reviewed: false,
                        };
                      }
                      return {
                        ...row.original,
                        reviewed: true,
                      };
                    });

                    // merge updated rows with old data
                    const newData = old.map((row) => {
                      const updatedRow = updatedRows.find((updatedRow) => updatedRow.uuid === row.uuid);
                      if (updatedRow) {
                        return updatedRow;
                      }
                      return row;
                    });

                    return newData;
                  });
                  setRowSelection({});
                }
              }}
              className={clsx("rounded-full border border-blue-200 p-2 hover:border-green-300 hover:bg-green-200", {
                hidden: table.getSelectedRowModel().rows.length === 0,
              })}
            >
              <CheckIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                if (table.getSelectedRowModel().rows.length > 0) {
                  setData((old) =>
                    //@ts-ignore
                    old.filter((_, index) => !rowSelection[index])
                  );
                  setRowSelection({});
                }
              }}
              className={clsx("rounded-full border border-blue-200 p-2 hover:border-red-300 hover:bg-red-200", {
                hidden: table.getSelectedRowModel().rows.length === 0,
              })}
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
            onClick={() => setIncomeModalOpen(true)}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
            <span className="absolute bottom-0 right-0">
              <PlusIcon className="h-4 w-4 text-green-500" />
            </span>
          </button>
          <button
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
            onClick={() => setExpenseModalOpen(true)}
          >
            <ArrowsPointingOutIcon className="h-5 w-5" />
            <span className="absolute bottom-0 right-0">
              <MinusIcon className="h-4 w-4 text-red-500" />
            </span>
          </button>
          <button
            onClick={() => {
              setData([
                {
                  uuid: uuid(),
                  type: "transaction",
                  date: format(new Date(), "yyyy-MM-dd"),
                  description: "",
                  account: "",
                  category: "Uncategorized transaction",
                  amount: "0",
                  reviewed: false,
                },
                ...data,
              ]);
            }}
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
          >
            Add Expense
          </button>
          <button
            onClick={() => {
              setData([
                {
                  uuid: uuid(),
                  type: "income",
                  date: format(new Date(), "yyyy-MM-dd"),
                  description: "",
                  account: "",
                  category: "Uncategorized income",
                  amount: "0",
                  reviewed: false,
                },
                ...data,
              ]);
            }}
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
          >
            Add Income
          </button>
          <button
            onClick={() => {
              console.log(data);
            }}
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={clsx("px-4 py-2 hover:bg-blue-50", {
                "bg-slate-200": row.original.reviewed,
              })}
            >
              {row.getVisibleCells().map((cell) => (
                <td className="whitespace-nowrap px-3 py-2 text-sm text-gray-500" key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <ExpenseModal />
      <IncomeModal />
    </div>
  );
};

export default TransactionTable;
