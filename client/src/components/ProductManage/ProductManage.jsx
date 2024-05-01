import AddProduct from "./AddProduct";
import { useEth } from "../../contexts/EthContext";
import { useCallback, useEffect, useState } from "react";
import ProductCard from "../common/ProductCard";
import EditProduct from "./EditProduct";

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

  const toggleSoldProduct = async (id) => {
    if (!contract) return;
    const response = await contract.methods
      .toggleSoldProduct(id)
      .call({ from: accounts[0] });
    console.log(response);
  };

  useEffect(() => {
    getSellerProducts();
  }, [getSellerProducts]);

  const productList = products.map((product) => {
    if (product.productId === "0") return null;
    return (
      <ProductCard
        key={product.productId}
        product={product}
        actionBtn={
          <div>
            <EditProduct product={product} />
            <button
              className="bg-orange-300 text-white text-xl px-4 py-3 rounded-md"
              onClick={() => toggleSoldProduct(product.productId)}
            >
              下架
            </button>
          </div>
        }
      />
    );
  });

  return (
    <div className="px-3 py-4">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl">商品管理</h2>
        <AddProduct />
      </div>

      {productList[0] === null || productList.length === 0 ? (
        <div className="py-8 text-center text-2xl">尚未新增商品</div>
      ) : (
        <div className="grid grid-cols-4 gap-2">{productList}</div>
      )}
    </div>
  );
};

export default ProductManage;
