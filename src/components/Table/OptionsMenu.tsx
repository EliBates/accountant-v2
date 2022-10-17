import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Transaction } from "@prisma/client";
import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import { Fragment } from "react";
import { trpc } from "../../utils/trpc";

interface Props {
  info: CellContext<Transaction, boolean>;
}

const OptionsMenu = (props: Props) => {
  const {
    getValue,
    row: { index },
    column: { id },
    table,
  } = props.info;

  const deleteTransaction = trpc.transaction.remove.useMutation();
  const utils = trpc.useContext();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button className={clsx("rounded-full border border-blue-200 p-2 hover:border-blue-300 hover:bg-blue-200")}>
        <ChevronDownIcon className="h-4 w-4" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="w-30 absolute right-0 z-10 mt-2 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  Edit
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  Upload Document
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={() => {
                    deleteTransaction.mutate(
                      {
                        id: props.info.row.original.id,
                      },
                      {
                        onSuccess: () => {
                          utils.transaction.invalidate();
                        },
                      }
                    );
                  }}
                  className={clsx(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  Delete
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  className={clsx(
                    active ? "bg-gray-100 text-gray-900" : "text-gray-700",
                    "block w-full px-4 py-2 text-left text-sm"
                  )}
                >
                  Duplicate
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default OptionsMenu;
