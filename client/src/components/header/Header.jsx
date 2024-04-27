import { BuildingStorefrontIcon } from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import { Routes } from "../../routes/routes";

const Header = () => {
  return (
    <div className="w-full bg-sky-300 flex justify-between items-center px-3 py-4">
      <Link to={Routes.PRODUCT_MAIN}>
        <h1 className="text-3xl flex items-center font-black text-white">
          <BuildingStorefrontIcon className="w-12 me-2" />
          <p>D-Store</p>
        </h1>
      </Link>

      <div className="text-xl font-semibold text-white grid grid-cols-2">
        <Link to={Routes.PRODUCT_MANAGE}>商品管理</Link>
        <Link to={Routes.PRODUCT_MANAGE}>已購買清單</Link>
      </div>
    </div>
  );
};

export default Header;
