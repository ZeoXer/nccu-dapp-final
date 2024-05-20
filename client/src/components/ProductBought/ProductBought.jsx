import { useEffect, useCallback, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import BoughtProductCard from "./BoughtProductCard";

const ProductBought = () => {
  const [products, setProducts] = useState([]);
  const {
    state: { contract, accounts },
  } = useEth();

  const getBoughtProduct = useCallback(async () => {
    if (!contract) return;
    const response = await contract.methods
      .getBuyerProducts()
      .call({ from: accounts[0] });
    setProducts(response);
  }, [accounts, contract]);

  useEffect(() => {
    getBoughtProduct();
  }, [getBoughtProduct]);

  const productList = products.map((product, idx) => {
    return <BoughtProductCard key={idx} product={product} />;
  });

  return (
    <div className="px-3 py-4">
      <h2 className="text-4xl mb-8 font-bold border-b pb-2 border-black">
        已購買的票券
      </h2>
      {productList[0] === null || productList?.length === 0 ? (
        <div className="py-8 text-center text-2xl">尚無購買的票券</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2">{productList}</div>
      )}
    </div>
  );
};

export default ProductBought;
