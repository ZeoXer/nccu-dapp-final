import { useState } from "react";
import clsx from "clsx";
import { config } from "../../config";
import {
  BanknotesIcon,
  ClockIcon,
  TicketIcon,
} from "@heroicons/react/24/outline";

const ProductCard = ({ product, actionBtn }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  console.log(product);

  const getRandomImgUrl = () => {
    return `https://picsum.photos/id/${
      product.productId * Math.round(Math.random() * 10)
    }/500/300`;
  };

  const getDateString = (date) => {
    const dateArr = new Date(+date).toLocaleDateString().split("/");
    dateArr[1] = dateArr[1].padStart(2, "0");
    dateArr[2] = dateArr[2].padStart(2, "0");
    return dateArr.join("/");
  };

  const isOutOfDate = () => {
    const now = new Date().getTime();
    return now > new Date(+product.endTime).getTime();
  };

  return (
    <div className="border border-gray-300 rounded-md relative">
      <div
        className={clsx(
          "absolute inset-0 bg-gray-700 rounded-md bg-opacity-50 z-10 flex items-center justify-center",
          product.stock === "0" ? "block" : "hidden"
        )}
      >
        <span className="text-3xl text-white font-semibold size-32 rounded-full flex items-center justify-center bg-blue-300">
          已售完
        </span>
      </div>
      <div
        className={clsx(
          "absolute inset-0 bg-gray-700 rounded-md bg-opacity-50 z-10 flex items-center justify-center",
          isOutOfDate() ? "block" : "hidden"
        )}
      >
        <span className="text-3xl text-white font-semibold size-32 rounded-full flex items-center justify-center bg-blue-300">
          已過期
        </span>
      </div>
      <p className="text-xl absolute top-2 left-2 flex items-center bg-white w-8 overflow-hidden p-1 transition-all rounded-md hover:w-[90%]">
        <ClockIcon className="w-6 me-1 flex-shrink-0" />
        <span className="text-lg flex-shrink-0">
          {getDateString(product.startTime)} - {getDateString(product.endTime)}
        </span>
      </p>
      {!isLoaded && (
        <div className="animate-pulse bg-gray-300 h-44 rounded-t-md"></div>
      )}
      <img
        src={getRandomImgUrl()}
        onLoad={() => setIsLoaded(true)}
        alt="random img"
        className={clsx("rounded-t-md", isLoaded ? "block" : "invisible")}
      />
      <div className="p-2">
        <div>
          <h3 className="text-3xl mb-2 font-semibold flex items-center gap-2">
            {product.productName}
            {product.releaser !== product.seller && (
              <span className="text-lg px-2 py-1 text-white bg-orange-300 rounded-md">
                轉售
              </span>
            )}
          </h3>
          <textarea
            readOnly
            value={product.productDescription}
            className="text-xl mb-1 focus:outline-none border-y-2 py-2 p-1 w-full resize-none"
          />
          <p className="text-xl flex items-center">
            <BanknotesIcon className="w-6 me-1" />
            <span className="text-2xl">
              {product.price / config.PRICE_BASE}
            </span>
          </p>
          <p className="text-xl flex items-center">
            <TicketIcon className="w-6 me-1" />
            <span className="text-2xl">{product.stock}</span>
          </p>
        </div>
        {actionBtn}
      </div>
    </div>
  );
};

export default ProductCard;
