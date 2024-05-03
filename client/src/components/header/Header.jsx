import { TicketIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { Routes } from "../../routes/routes";

const Header = () => {
  return (
    <div className="w-full bg-sky-300 flex justify-between items-center px-3 py-4">
      <Link to={Routes.PRODUCT_MAIN}>
        <h1 className="text-3xl flex items-center font-black text-white">
          <TicketIcon className="w-12 me-2" />
          <p>券合</p>
        </h1>
      </Link>

      <div className="text-xl font-semibold text-white flex justify-between gap-4">
        <Link to={Routes.PRODUCT_MAIN}>商店首頁</Link>
        <Link to={Routes.PRODUCT_MANAGE}>管理商品</Link>
        <Link to={Routes.PRODUCT_BOUGHT}>已購買清單</Link>
        <Link to={Routes.RECORD}>交易紀錄</Link>
      </div>
    </div>
  );
};

export default Header;
