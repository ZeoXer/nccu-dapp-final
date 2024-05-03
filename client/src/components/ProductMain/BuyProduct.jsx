import { useState, useEffect } from "react";
import { useEth } from "../../contexts/EthContext";
import {
  MinusCircleIcon,
  PlusCircleIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { config } from "../../config";

const BuyProduct = ({ product }) => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [quantity, setQuantity] = useState(1);

  const {
    state: { contract, accounts },
  } = useEth();

  const openModal = () => {
    setIsModalShow(true);
  };

  const closeModal = () => {
    setIsModalShow(false);
  };

  const minusQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const plusQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const buyProduct = async (product, quantity) => {
    if (!contract) return;
    await contract.methods
      .buyProduct(product.seller, product.productId, quantity)
      .send({ from: accounts[0], value: product.price * quantity });
    closeModal();
    window.location.reload();
  };

  const BuyProductButton = () => {
    return (
      <button
        className="bg-sky-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={openModal}
      >
        購買
      </button>
    );
  };

  useEffect(() => {
    setQuantity(1);
  }, []);

  return (
    <>
      <BuyProductButton />
      {isModalShow && (
        <div className="fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50">
          <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
            <div className="w-[500px] bg-white rounded-md relative">
              <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
                <h4 className="text-2xl font-semibold">
                  購買 {product.productName}
                </h4>
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
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xl">數量</h5>
                    <button onClick={minusQuantity}>
                      <MinusCircleIcon className="text-sky-300 size-9" />
                    </button>
                    <div className="border rounded-md px-5 py-1 text-xl">
                      {quantity}
                    </div>
                    <button onClick={plusQuantity}>
                      <PlusCircleIcon className="text-sky-300 size-9" />
                    </button>
                  </div>
                  <div className="flex items-center justify-end">
                    <h5 className="text-xl me-2">總價</h5>
                    <div className="border rounded-md w-24 py-1 text-center text-xl">
                      {(quantity * product.price) / config.PRICE_BASE}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => buyProduct(product, quantity)}
                  className="bg-sky-300 px-4 py-2 text-white rounded-md text-xl"
                >
                  確定購買
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BuyProduct;
