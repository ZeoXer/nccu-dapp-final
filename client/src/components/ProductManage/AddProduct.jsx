import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { config } from "../../config";
import clsx from "clsx";

const AddProductInput = ({ label, type, value, onChange, min, step }) => {
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

const AddProduct = () => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState(0);
  const [productStock, setProductStock] = useState(0);

  const {
    state: { contract, accounts },
  } = useEth();

  const openModal = () => {
    setIsModalShow(true);
  };

  const closeModal = () => {
    setIsModalShow(false);
    // qrScanner.stop();
  };

  const addProduct = async () => {
    const productPriceToStored = productPrice * config.PRICE_BASE;

    await contract.methods
      .addProduct(productName, productPriceToStored, productStock)
      .send({ from: accounts[0] });

    closeModal();
    window.location.reload();
  };

  const AddProductButton = () => {
    return (
      <button
        className="bg-sky-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={openModal}
      >
        新增商品
      </button>
    );
  };

  return (
    <>
      <AddProductButton />
      <div
        className={clsx(
          "fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50",
          isModalShow ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
          <div className="w-[500px] bg-white rounded-md relative">
            <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
              <h4 className="text-2xl font-semibold">新增商品</h4>
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
              <div className="flex justify-between">
                <div>
                  <AddProductInput
                    label="商品名稱"
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                    }}
                  />
                  <AddProductInput
                    label="商品價格"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    min={0}
                    step={0.01}
                  />
                  <AddProductInput
                    label="商品庫存"
                    type="number"
                    value={productStock}
                    onChange={(e) => setProductStock(e.target.value)}
                    min={0}
                  />
                </div>
              </div>
              <button
                onClick={addProduct}
                className="bg-sky-300 px-4 py-2 text-white rounded-md text-xl"
              >
                新增
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
