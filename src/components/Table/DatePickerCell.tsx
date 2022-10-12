import { Fragment, useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { Popover, Transition } from "@headlessui/react";
import { CellContext } from "@tanstack/react-table";
import { Transaction } from "./TransactionTable";
import dayjs from "dayjs";

interface Props {
  info: CellContext<Transaction, string>;
}

const DatePickerCell = (props: Props) => {
  const {
    getValue,
    row: { index },
    column: { id },
    table,
  } = props.info;

  const initialDate = dayjs(getValue()).toDate();
  console.log(initialDate);
  const [date, setDate] = useState<Date>(initialDate);
  const [tempDate, setTempDate] = useState<string>(getValue());
  const textInput = useRef<HTMLInputElement>(null);

  return (
    <>
      <Popover className="relative">
        {({ close }) => (
          <>
            <Popover.Button
              onClick={() => {
                setTimeout(() => {
                  textInput.current?.select();
                  textInput.current?.focus();
                }, 100);
                console.log("clicked");
              }}
              className="rounded-md border border-transparent py-2 pr-4 hover:border-gray-400"
            >
              {format(date, "MMM dd, yyyy")}
            </Popover.Button>

            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="opacity-0 translate-y-1"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-1"
            >
              <Popover.Panel className="absolute left-1/2 z-10 mt-3 w-screen max-w-xs -translate-x-1/2 transform px-2 sm:px-0">
                <div className="overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                  <div className="relative  bg-white">
                    <div className="px-4 pt-4">
                      <input
                        ref={textInput}
                        className="w-full rounded-md"
                        type="text"
                        value={tempDate}
                        onChange={(e) => {
                          setTempDate(e.target.value);
                        }}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const parsedDate = dayjs(tempDate).toDate();
                            if (parsedDate.toString() !== "Invalid Date") {
                              setDate(parsedDate);
                              setTempDate(format(parsedDate, "MMM dd, yyyy"));
                            } else {
                              setTempDate(format(date, "MMM dd, yyyy"));
                            }
                          }
                        }}
                        onBlur={(e) => {
                          const parsedDate = dayjs(e.target.value).toDate();

                          // if parsedDate is valid then set the state
                          if (parsedDate.toString() !== "Invalid Date") {
                            setDate(parsedDate);
                            setTempDate(format(parsedDate, "MMM dd, yyyy"));
                          } else {
                            setTempDate(format(date, "MMM dd, yyyy"));
                          }
                        }}
                      />
                    </div>

                    <DayPicker
                      fromYear={2020}
                      toYear={2022}
                      captionLayout="dropdown"
                      mode="single"
                      selected={date}
                      defaultMonth={date}
                      onSelect={(day: any) => {
                        setDate(day);
                        setTempDate(format(day, "MMM dd, yyyy"));
                        close();
                      }}
                    />
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default DatePickerCell;
