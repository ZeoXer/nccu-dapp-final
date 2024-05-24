import { useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { config } from "../../config";
import clsx from "clsx";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";

const AddProductInput = ({
  label,
  type,
  value,
  onChange,
  min,
  step,
  noEdit,
}) => {
  return (
    <div className="mb-4">
      <label className="text-xl me-2 flex items-center">
        <p>{label}</p>
        {noEdit && (
          <span className="ms-2 text-sm text-red-500 flex items-center font-semibold">
            <ExclamationCircleIcon className="w-4" />
            票券發行後不可再次編輯
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border rounded-md text-lg px-2 py-1 w-full"
        min={min}
        step={step}
      />
    </div>
  );
};

const AddProductTextarea = ({ label, value, onChange }) => {
  return (
    <div className="mb-4">
      <label className="text-xl me-2 block">{label}</label>
      <textarea
        value={value}
        onChange={onChange}
        className="border rounded-md text-lg px-2 py-1 resize-none h-32 w-full"
      />
    </div>
  );
};

const AddProduct = () => {
  const [isModalShow, setIsModalShow] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
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
  };

  const getDateString = (date) => {
    const dateArr = new Date().toLocaleDateString().split("/");
    dateArr[1] = dateArr[1].padStart(2, "0");
    dateArr[2] = dateArr[2].padStart(2, "0");
    return dateArr.join("-");
  };

  const addProduct = async () => {
    const productPriceToStored = productPrice * config.PRICE_BASE;

    await contract.methods
      .addProduct(
        productName,
        productDescription,
        new Date(startDate).getTime(),
        new Date(endDate).getTime(),
        productPriceToStored,
        productStock
      )
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
        發行票券
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
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur overflow-y-scroll">
          <div className="w-[600px] bg-white rounded-md relative">
            <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
              <h4 className="text-2xl font-semibold">發行票券</h4>
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
              <div className="grid md:grid-cols-2 gap-2">
                <div>
                  <AddProductInput
                    label="活動名稱"
                    type="text"
                    value={productName}
                    onChange={(e) => {
                      setProductName(e.target.value);
                    }}
                  />
                  <AddProductTextarea
                    label="活動敘述"
                    value={productDescription}
                    onChange={(e) => {
                      setProductDescription(e.target.value);
                    }}
                  />
                </div>
                <div>
                  <AddProductInput
                    label="開始日期"
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      if (endDate < e.target.value) setEndDate(e.target.value);
                    }}
                    min={getDateString(new Date())}
                    noEdit
                  />
                  <AddProductInput
                    label="結束日期"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || getDateString(new Date())}
                    noEdit
                  />
                  <AddProductInput
                    label="票券價格"
                    type="number"
                    value={productPrice}
                    onChange={(e) => setProductPrice(e.target.value)}
                    min={new Date()}
                    step={0.01}
                    noEdit
                  />
                  <AddProductInput
                    label="票券庫存"
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
                確認發行
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProduct;
