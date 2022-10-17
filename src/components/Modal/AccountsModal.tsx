import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { accountsModalOpenState } from "../../utils/state";
import { useAtom } from "jotai";
import { PlusCircleIcon } from "@heroicons/react/20/solid";
import { trpc } from "../../utils/trpc";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import clsx from "clsx";

export default function AccountsModal() {
  const [accountsModalOpen, setAccountsModalOpen] = useAtom(accountsModalOpenState);
  const [accountToAdd, setAccountToAdd] = useState<string>("");

  const utils = trpc.useContext();
  const { data: accounts } = trpc.transactionAccount.getAll.useQuery();
  const addAccount = trpc.transactionAccount.add.useMutation();
  const removeAccount = trpc.transactionAccount.remove.useMutation();

  const [parent] = useAutoAnimate<HTMLDivElement>(/* optional config */);

  const executeAddAccount = () => {
    if (accountToAdd.length > 0) {
      addAccount.mutate(
        {
          alias: accountToAdd,
        },
        {
          onSuccess: () => {
            utils.transactionAccount.invalidate();
          },
        }
      );
      setAccountToAdd("");
    }
  };

  const executeRemoveAccount = (id: string) => {
    removeAccount.mutate(
      {
        id,
      },
      {
        onSuccess: () => {
          utils.transactionAccount.invalidate();
        },
      }
    );
  };

  return (
    <Transition.Root show={accountsModalOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setAccountsModalOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form action="" className="space-y-6">
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Add account
                    </label>
                    <div className="mt-1 flex space-x-1">
                      <input
                        type="text"
                        value={accountToAdd}
                        onChange={(e) => setAccountToAdd(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            executeAddAccount();
                          }
                        }}
                        name="description"
                        id="description"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Account name"
                      />
                      <button type="button" className="text-blue-500 hover:text-blue-600" onClick={executeAddAccount}>
                        <PlusCircleIcon className="h-8 w-8 " />
                      </button>
                    </div>
                  </div>
                </form>

                <div
                  className={clsx("mt-3 grid w-full gap-1", {
                    "grid-cols-2": accounts && accounts?.length > 5,
                  })}
                  ref={parent}
                >
                  {accounts?.map(({ alias, id }) => (
                    <div
                      key={id}
                      className="rounded-md bg-gray-50 p-2 hover:cursor-pointer hover:bg-gray-100"
                      onClick={() => executeRemoveAccount(id)}
                    >
                      <p>{alias}</p>
                      <p className="truncate">{id}</p>
                    </div>
                  ))}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
