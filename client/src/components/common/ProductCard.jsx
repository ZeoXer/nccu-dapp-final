import { useState } from "react";
import clsx from "clsx";
import { config } from "../../config";

const ProductCard = ({ product, actionBtn }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  const getRandomImgUrl = () => {
    const randomId = Math.floor(Math.random() * 100);
    return `https://picsum.photos/id/${randomId}/500/300`;
  };

  return (
    <div className="border border-gray-300 rounded-md">
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
