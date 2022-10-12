import MainNavItem from "./MainNavItem";
import clsx from "clsx";
import TopSideNavPanel from "./TopSideNavPanel/TopSideNavPanel";
import { BanknotesIcon, KeyIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";

// make an array of nav items
const navItems = [
  {
    name: "Transactions",
    icon: <BanknotesIcon className="h-5 w-5 text-blue-500" />,
    href: "/transactions",
  },
  {
    name: "Accounts",
    icon: <KeyIcon className="h-5 w-5 text-blue-500" />,
    href: "/accounts",
  },
];

const SideNav = () => {
  // get the router and check the path name
  const router = useRouter();

  return (
    <nav
      className={clsx(
        "flex select-none flex-col border-r border-gray-200 transition-opacity duration-100 ease-in-out"
      )}
    >
      <TopSideNavPanel />
      <div className="px-2 py-2">
        <div className="m-[1px] rounded-md">
          {navItems.map((item) => (
            <MainNavItem
              key={item.name}
              name={item.name}
              icon={item.icon}
              href={item.href}
              active={router.pathname === item.href}
            />
          ))}
        </div>
      </div>
    </nav>
  );
};

export default SideNav;
