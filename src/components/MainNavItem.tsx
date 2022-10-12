import clsx from "clsx";
import NextLink from "next/link";
import { ReactElement } from "react";

interface Props {
  icon: ReactElement;
  name: string;
  active?: boolean;
  href: string;
}

export default function MainNavItem({
  icon,
  name,
  active,
  href,
}: Props): JSX.Element {
  return (
    <div className="block w-full">
      <a
        href={href}
        className={clsx("block w-full rounded-md  px-2 hover:cursor-pointer ", {
          "bg-green-100": active,
          "hover:bg-gray-50": !active,
        })}
      >
        <span className="flex h-[35px] items-center rounded-md">
          {icon}
          <div className="ml-2">
            <span>{name}</span>
          </div>
        </span>
      </a>
    </div>
  );
}
