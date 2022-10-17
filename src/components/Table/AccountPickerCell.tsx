import { Fragment, useEffect, useState } from "react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Listbox, Transition } from "@headlessui/react";
import { CellContext } from "@tanstack/react-table";
import clsx from "clsx";
import { trpc } from "../../utils/trpc";
import { Transaction, TransactionAccount } from "@prisma/client";
import { accountsModalOpenState } from "../../utils/state";
import { useAtom } from "jotai";
import { util } from "zod/lib/helpers/util";

interface Props {
  info: CellContext<Transaction, string | null>;
}

export default function AccountPickerCell(props: Props) {
  const { getValue } = props.info;

  const [query, setQuery] = useState("");
  const { data: accounts } = trpc.transactionAccount.getAll.useQuery();
  const updateTransaction = trpc.transaction.update.useMutation();
  const utils = trpc.useContext();
  const [selected, setSelected] = useState<TransactionAccount | null>(
    accounts?.find((a) => a.id === getValue()) ?? null
  );

  const [accountsModalOpen, setAccountsModalOpen] = useAtom(accountsModalOpenState);

  const filteredAccounts =
    query === ""
      ? accounts ?? []
      : accounts?.filter((account) => {
          return account.alias.toLowerCase().includes(query.toLowerCase());
        }) ?? [];

  useEffect(() => {
    const accountValue = getValue();
    if (accountValue) {
      setSelected(accounts?.find((account) => account.id === accountValue) ?? null);
    }
  }, [getValue, accounts]);

  const setAccount = async (account: TransactionAccount) => {
    setSelected(account);
    updateTransaction.mutate(
      {
        id: props.info.row.original.id,
        transactionAccountId: account.id,
      },
      {
        onSuccess: () => {
          utils.transaction.invalidate();
        },
      }
    );
  };

  return (
    <Listbox value={selected} onChange={setAccount}>
      {({ open }) => (
        <>
          <div className="relative mt-1">
            <Listbox.Button className="relative w-full cursor-pointer rounded-md border border-transparent bg-transparent py-2 pl-3 pr-4 text-left hover:border-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
              {selected ? (
                <span className="flex items-center">
                  <span className="block truncate">{selected.alias}</span>
                </span>
              ) : (
                <>
                  <span>Select Account</span>
                </>
              )}
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                <div className="w-full p-2">
                  <input
                    type="text"
                    name=""
                    id=""
                    onChange={(event) => setQuery(event.target.value)}
                    onBlur={() => setQuery("")}
                    className="w-full max-w-sm rounded-md border py-1 hover:border-gray-400"
                    placeholder="Search.."
                  />
                </div>
                {filteredAccounts.map((account) => (
                  <Listbox.Option
                    key={account.id}
                    className={({ active }) =>
                      clsx(
                        active ? "bg-indigo-600 text-white" : "text-gray-900",
                        "relative cursor-pointer select-none py-2 pl-3 pr-9"
                      )
                    }
                    value={account}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className="flex items-center">
                          <img
                            src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt=""
                            className="h-6 w-6 flex-shrink-0 rounded-full"
                          />
                          <span className={clsx(selected ? "font-semibold" : "font-normal", "ml-3 block truncate")}>
                            {account.alias}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={clsx(
                              active ? "text-white" : "text-indigo-600",
                              "absolute inset-y-0 right-0 flex items-center pr-4"
                            )}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
}
