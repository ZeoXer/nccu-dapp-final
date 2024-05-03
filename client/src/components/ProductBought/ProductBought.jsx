import { useEffect, useCallback, useState } from "react";
import { useEth } from "../../contexts/EthContext";

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
    return (
      <div key={idx}>
        <div className="border border-gray-300 rounded-md p-2">
          <h3 className="text-3xl font-semibold">{product.productName}</h3>
        </div>
      </div>
    );
  });

  return (
    <div className="px-3 py-4">
      <h2 className="text-3xl mb-8">已購買的商品</h2>
      {productList[0] === null || productList?.length === 0 ? (
        <div className="py-8 text-center text-2xl">尚無購買的商品</div>
      ) : (
        <div className="grid grid-cols-4 gap-2">{productList}</div>
      )}
    </div>
  );
};

export default ProductBought;
