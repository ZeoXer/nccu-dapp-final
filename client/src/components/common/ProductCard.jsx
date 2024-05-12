import { useState } from "react";
import clsx from "clsx";
import { config } from "../../config";

const ProductCard = ({ product, actionBtn }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getRandomImgUrl = () => {
    return `https://picsum.photos/id/${product.productId}/500/300`;
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
      {!isLoaded && (
        <div className="animate-pulse bg-gray-300 h-44 rounded-t-md"></div>
      )}
      <img
        src={getRandomImgUrl()}
        onLoad={() => setIsLoaded(true)}
        alt="random img"
        className={clsx("rounded-t-md", isLoaded ? "block" : "invisible")}
      />
      <div className="p-2 flex items-end justify-between">
        <div>
          <h3 className="text-3xl font-semibold">{product.productName}</h3>
          <p className="text-xl">
            價格{" "}
            <span className="text-2xl">
              {product.price / config.PRICE_BASE}
            </span>
          </p>
          <p className="text-xl">
            庫存 <span className="text-2xl">{product.stock}</span>
          </p>
        </div>
        {actionBtn}
      </div>
    </div>
  );
};

export default ProductCard;
