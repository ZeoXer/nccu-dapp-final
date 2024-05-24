import { Bars3Icon, TicketIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { Link } from "react-router-dom";
import { Routes } from "../../routes/routes";
import clsx from "clsx";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const {
    state: { accounts },
  } = useEth();

  return (
    <div className="relative">
      <div className="w-full bg-sky-300 flex justify-between items-center px-3 py-4">
        <div className="flex items-center">
          <Link to={Routes.PRODUCT_MAIN}>
            <h1 className="text-3xl flex items-center font-black text-white">
              <TicketIcon className="w-12 me-2" />
              <p>券合</p>
            </h1>
          </Link>
          <div className="ms-4 w-36 font-bold bg-sky-300 text-lg text-white border-2 border-white px-2 py-1 rounded-md truncate">
            {accounts && accounts[0]}
          </div>
        </div>

        <div className="text-xl font-semibold text-white justify-between gap-4 hidden md:flex">
          <Link to={Routes.PRODUCT_MAIN}>商店首頁</Link>
          <Link to={Routes.PRODUCT_MANAGE}>管理商品</Link>
          <Link to={Routes.PRODUCT_BOUGHT}>已購買清單</Link>
          <Link to={Routes.RECORD}>交易紀錄</Link>
          <Link to={Routes.SCAN}>掃描票券</Link>
        </div>
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? (
            <XMarkIcon className="w-8 text-white" />
          ) : (
            <Bars3Icon className="w-8 text-white" />
          )}
        </button>
      </div>
      <div
        className={clsx(
          "text-xl font-semibold text-white bg-sky-300 transition duration-200 overflow-hidden absolute top-full w-full z-[1000]",
          menuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <Link
          className="block py-2 text-center border-y border-white"
          to={Routes.PRODUCT_MAIN}
        >
          商店首頁
        </Link>
        <Link
          className="block py-2 text-center border-y border-white"
          to={Routes.PRODUCT_MANAGE}
        >
          管理商品
        </Link>
        <Link
          className="block py-2 text-center border-y border-white"
          to={Routes.PRODUCT_BOUGHT}
        >
          已購買清單
        </Link>
        <Link
          className="block py-2 text-center border-y border-white"
          to={Routes.RECORD}
        >
          交易紀錄
        </Link>
        <Link
          className="block py-1 text-center border-y border-white"
          to={Routes.SCAN}
        >
          掃描票券
        </Link>
      </div>
    </div>
  );
};

export default Header;
