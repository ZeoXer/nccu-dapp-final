import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { createPortal } from "react-dom";

const EditProductInput = ({ label, type, value, onChange, min, step }) => {
  return (
    <div className="mb-4">
      <label className="text-xl me-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border rounded-md text-lg px-2 py-1 w-80"
        min={min}
        step={step}
      />
    </div>
  );
};

const EditProductTextarea = ({ label, value, onChange }) => {
  return (
    <div className="mb-4 flex items-start">
      <label className="text-xl me-2">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        className="border rounded-md text-lg px-2 py-1 resize-none h-32 w-80"
      />
    </div>
  );
};

const EditProduct = ({ product }) => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [productName, setProductName] = useState(product.productName);
  const [productDescription, setProductDescription] = useState(
    product.productDescription
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
    await contract.methods
      .updateProduct(
        product.productId,
        productName,
        productDescription,
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
      {isModalShow &&
        createPortal(
          <div className="fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50">
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
              <div className="w-[500px] bg-white rounded-md">
                <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
                  <h4 className="text-2xl font-semibold">編輯票券</h4>
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
                    label="活動名稱"
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                    }}
                  />
                  <EditProductTextarea
                    label="活動敘述"
                    value={productDescription}
                    onChange={(e) => {
                      setProductDescription(e.target.value);
                    }}
                  />
                  <EditProductInput
                    label="票券庫存"
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
          </div>,
          document.body
        )}
    </>
  );
};

export default EditProduct;
