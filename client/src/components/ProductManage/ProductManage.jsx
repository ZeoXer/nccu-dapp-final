import AddProduct from "./AddProduct";
import { useEth } from "../../contexts/EthContext";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../common/ProductCard";

const ProductManage = () => {
  const [products, setProducts] = useState([]);
  const {
    state: { contract, accounts },
  } = useEth();

  const getSellerProducts = useCallback(async () => {
    if (!contract) return;
    const response = await contract.methods
      .getSellerProducts()
      .call({ from: accounts[0] });
    setProducts(response);
  }, [accounts, contract]);

  useEffect(() => {
    getSellerProducts();
  }, [getSellerProducts]);

  const productList = products.map((product) => {
    if (product.productId === "0") return null;
    return <ProductCard key={product.productId} product={product} />;
  });

  return (
    <div className="px-3 py-4">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl">商品管理</h2>
        <AddProduct />
      </div>

      {productList[0] === null ? (
        <div className="py-8 text-center text-2xl">尚未新增商品</div>
      ) : (
        <div className="grid grid-cols-4 gap-2">{productList}</div>
      )}
    </div>
  );
};

export default ProductManage;
