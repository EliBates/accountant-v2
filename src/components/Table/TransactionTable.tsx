import { createColumnHelper, flexRender, getCoreRowModel, RowData, useReactTable } from "@tanstack/react-table";
import { format } from "date-fns";
import { useReducer, useState } from "react";
import IndeterminateCheckbox from "./IndeterminateCheckbox";
import DatePickerCell from "./DatePickerCell";
import TextCell from "./TextCell";
import { CheckIcon, TrashIcon } from "@heroicons/react/24/solid";
import clsx from "clsx";
import OptionsMenu from "./OptionsMenu";
import MoneyCell from "./MoneyCell";
import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import IncomeModal from "../Modal/IncomeModal";
import ExpenseModal from "../Modal/ExpenseModal";
import IncomeButton from "../Buttons/IncomeButton";
import ExpenseButton from "../Buttons/ExpenseButton";
import AccountPickerCell from "./AccountPickerCell";
import { Transaction } from "@prisma/client";
import { trpc } from "../../utils/trpc";

declare module "@tanstack/react-table" {
  interface TableMeta<TData extends RowData> {
    updateData: (rowIndex: number, columnId: string, value: unknown) => void;
  }
}

const columnHelper = createColumnHelper<Transaction>();

const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const TransactionTable = () => {
  const rerender = useReducer(() => ({}), {})[1];
  const [rowSelection, setRowSelection] = useState({});
  const [deleteSelection, setDeleteSelection] = useState({});

  const { data: transactions } = trpc.transaction.getAll.useQuery();
  const updateTransaction = trpc.transaction.update.useMutation();
  const addTransaction = trpc.transaction.add.useMutation();
  const utils = trpc.useContext();

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
      cell: (info) => (
        <TextCell
          info={info}
          emptyMessage={"⚠️ Write a Description"}
          onChange={(description) => {
            updateTransaction.mutate(
              {
                id: info.row.original.id,
                description,
              },
              {
                onSuccess: () => {
                  utils.transaction.invalidate();
                },
              }
            );
          }}
        />
      ),
    }),
    columnHelper.accessor("transactionAccountId", {
      header: () => "Account",
      cell: (info) => <AccountPickerCell info={info} />,
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
                  updateTransaction.mutate(
                    {
                      id: info.row.original.id,
                      reviewed: false,
                    },
                    {
                      onSuccess: () => {
                        utils.transaction.invalidate();
                      },
                    }
                  );
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
                  updateTransaction.mutate(
                    {
                      id: info.row.original.id,
                      reviewed: true,
                    },
                    {
                      onSuccess: () => {
                        utils.transaction.invalidate();
                      },
                    }
                  );
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

  // const [data, setData] = useState(() => [...transactions]);

  const table = useReactTable({
    data: transactions ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="pb-16 shadow-sm ring-1 ring-black ring-opacity-5">
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
                // const selectedRows = table.getSelectedRowModel().rows;
                // if (selectedRows.length > 0) {
                //   setData((old) => {
                //     // check if all selected rows are reviewed
                //     const allReviewed = selectedRows.every((row) => row.original.reviewed);
                //     const updatedRows = selectedRows.map((row) => {
                //       if (allReviewed) {
                //         return {
                //           ...row.original,
                //           reviewed: false,
                //         };
                //       }
                //       return {
                //         ...row.original,
                //         reviewed: true,
                //       };
                //     });
                //     // merge updated rows with old data
                //     const newData = old.map((row: Transaction) => {
                //       const updatedRow = updatedRows.find((updatedRow) => updatedRow.id === row.id);
                //       if (updatedRow) {
                //         return updatedRow;
                //       }
                //       return row;
                //     });
                //     return newData;
                //   });
                //   setRowSelection({});
                // }
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
          <IncomeButton />
          <ExpenseButton />
          <button
            onClick={() => {
              addTransaction.mutate(
                {
                  type: "income",
                  date: format(new Date(), "yyyy-MM-dd"),
                  description: "",
                  amount: 0n,
                  category: "Uncategorized",
                  reviewed: false,
                },
                {
                  onSuccess: () => {
                    utils.transaction.invalidate();
                  },
                }
              );
            }}
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
          >
            Add Income
          </button>
          <button
            onClick={() => {
              addTransaction.mutate(
                {
                  type: "expense",
                  date: format(new Date(), "yyyy-MM-dd"),
                  description: "",
                  amount: 0n,
                  category: "Uncategorized",
                  reviewed: false,
                },
                {
                  onSuccess: () => {
                    utils.transaction.invalidate();
                  },
                }
              );
            }}
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
          >
            Add Expense
          </button>
          <button
            onClick={() => {
              // console.log(data);
            }}
            className="relative rounded-md border border-transparent bg-gray-200 p-2 text-sm hover:border-gray-200 hover:bg-gray-100"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
      <table className="block min-w-full divide-y divide-gray-300 overflow-hidden">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="sticky top-0 z-10 bg-gray-50 px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="h-full divide-y divide-gray-200 overflow-y-scroll bg-white">
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
