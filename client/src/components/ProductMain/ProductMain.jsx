import { useEth } from "../../contexts/EthContext";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../common/ProductCard";
import BuyProduct from "./BuyProduct";

const ProductMain = () => {
  const [products, setProducts] = useState([]);
  const {
    state: { contract, accounts },
  } = useEth();

  const getAllProducts = useCallback(async () => {
    if (!contract) return;
    const response = await contract.methods
      .getAllProducts()
      .call({ from: accounts[0] });
    setProducts(response);
  }, [accounts, contract]);

  useEffect(() => {
    getAllProducts();
  }, [getAllProducts]);

  const productList = products.map((product) => {
    if (product.productId === "0") return null;
    return (
      <ProductCard
        key={product.productId}
        product={product}
        actionBtn={
          <div className="flex justify-end">
            <BuyProduct product={product} />
          </div>
        }
      />
    );
  });

  return (
    <div className="px-3 py-4">
      <h2 className="text-4xl mb-8 font-bold border-b pb-2 border-black">
        所有商品列表
      </h2>
      {productList[0] === null || productList?.length === 0 ? (
        <div className="py-8 text-center text-2xl">尚無商品</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
          {productList}
        </div>
      )}
    </div>
  );
};

export default ProductMain;
