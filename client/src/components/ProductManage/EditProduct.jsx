import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { config } from "../../config";

const EditProductInput = ({ label, type, value, onChange, min, step }) => {
  return (
    <div className="mb-4">
      <label className="text-xl me-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border rounded-md text-lg px-2 py-1"
        min={min}
        step={step}
      />
    </div>
  );
};

const EditProduct = ({ product }) => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [productName, setProductName] = useState(product.productName);
  const [productPrice, setProductPrice] = useState(
    product.price / config.PRICE_BASE
  );
  const [productStock, setProductStock] = useState(product.stock);
  
  const {
    state: { contract, accounts },
  } = useEth();

  const openModal = () => {
    setIsModalShow(true);
  };

  const closeModal = () => {
    setIsModalShow(false);
  };

  const editProduct = async () => {
    const productPriceToStored = productPrice * config.PRICE_BASE;

    await contract.methods
      .updateProduct(
        product.productId,
        productName,
        productPriceToStored,
        productStock
      )
      .send({ from: accounts[0] });

    closeModal();
    window.location.reload();
  };

  const EditProductButton = () => {
    return (
      <button
        className="bg-sky-300 me-1 text-white text-xl px-4 py-3 rounded-md"
        onClick={openModal}
      >
        編輯
      </button>
    );
  };

  return (
    <>
      <EditProductButton />
      {isModalShow && (
        <div className="fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50">
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
            <div className="w-[500px] bg-white rounded-md relative">
              <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
                <h4 className="text-2xl font-semibold">編輯商品</h4>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    closeModal();
                  }}
                >
                  <XMarkIcon className="w-8" />
                </button>
              </div>
              <div className="px-3 py-4">
                <EditProductInput
                  label="商品名稱"
                  type="text"
                  value={productName}
                  onChange={(e) => {
                    setProductName(e.target.value);
                  }}
                />
                <EditProductInput
                  label="商品價格"
                  type="number"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  min={0}
                  step={0.01}
                />
                <EditProductInput
                  label="商品庫存"
                  type="number"
                  value={productStock}
                  onChange={(e) => setProductStock(e.target.value)}
                  min={0}
                />
                <button
                  onClick={editProduct}
                  className="bg-sky-300 px-4 py-2 text-white rounded-md text-xl"
                >
                  確認修改
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProduct;
