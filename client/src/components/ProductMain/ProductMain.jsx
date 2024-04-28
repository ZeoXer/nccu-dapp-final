import { useEth } from "../../contexts/EthContext";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "./ProductCard";

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

  return (
    <div className="px-3 py-4">
      <h2 className="text-3xl mb-8">商品列表</h2>
      <div className="grid grid-cols-4 gap-2">
        {products.map((product) => {
          return <ProductCard key={product.productId} product={product} />;
        })}
      </div>
    </div>
  );
};

export default ProductMain;
