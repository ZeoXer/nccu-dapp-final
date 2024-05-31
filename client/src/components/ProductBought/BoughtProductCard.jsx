import { useState, useEffect, useCallback } from "react";
import { useEth } from "../../contexts/EthContext";
import clsx from "clsx";
import { toDataURL } from "qrcode";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";
import {
  ClockIcon,
  ExclamationCircleIcon,
  QrCodeIcon,
} from "@heroicons/react/24/outline";
import { config } from "../../config";

const qrcodeOptions = {
  errorCorrectionLevel: "H",
  type: "image/png",
  quality: 0.5,
  margin: 4,
  color: {
    dark: "#000000",
    light: "#ffffff",
  },
};

const BoughtProductCard = ({ product }) => {
  const releasePrice = product.releasePrice / config.PRICE_BASE;
  const [isLoaded, setIsLoaded] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const [soldModal, setSoldModal] = useState(false);
  const [soldPrice, setSoldPrice] = useState(releasePrice);
  const {
    state: { accounts, contract },
  } = useEth();

  const getRandomImgUrl = () => {
    return `https://picsum.photos/id/${
      product.productId * Math.round(Math.random() * 20)
    }/500/300`;
  };

  const generateQRCode = useCallback(
    (product) => {
      toDataURL(
        `${product.productName}-${accounts[0]}-${product.releaser}-${product.endTime}`,
        qrcodeOptions,
        (err, url) => {
          if (err) throw err;
          setQrCodeUrl(url);
        }
      );
    },
    [accounts]
  );

  const soldProduct = async () => {
    if (!contract) return;

    const soldPriceWei = soldPrice * config.PRICE_BASE;

    await contract.methods
      .resellProduct(
        product.productId,
        product.releaser,
        product.productName,
        product.productDescription,
        product.startTime,
        product.endTime,
        product.releasePrice,
        soldPriceWei
      )
      .send({ from: accounts[0] });
    closeSoldModal();
    window.location.reload();
  };

  const openQrCodeModal = () => {
    setQrCodeModal(true);
  };

  const closeQrCodeModal = () => {
    setQrCodeModal(false);
  };

  const openSoldModal = () => {
    setSoldModal(true);
  };

  const closeSoldModal = () => {
    setSoldModal(false);
  };

  const isOutOfDate = () => {
    const now = new Date().getTime();
    return now > new Date(+product.endTime).getTime();
  };

  const getDateString = (date) => {
    const dateArr = new Date(+date).toLocaleDateString().split("/");
    dateArr[1] = dateArr[1].padStart(2, "0");
    dateArr[2] = dateArr[2].padStart(2, "0");
    return dateArr.join("/");
  };

  const OpenQrCodeBtn = () => {
    return (
      <button
        className="bg-sky-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={openQrCodeModal}
      >
        <QrCodeIcon className="w-7" />
      </button>
    );
  };

  const SoldBtn = () => {
    return (
      <button
        className="bg-orange-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={openSoldModal}
      >
        轉售
      </button>
    );
  };

  useEffect(() => {
    generateQRCode(product);
  }, [product, generateQRCode]);

  useEffect(() => {
    if (soldPrice > releasePrice) {
      setSoldPrice(releasePrice);
    }
  }, [soldPrice, releasePrice]);

  return (
    <>
      <div className="border border-gray-300 rounded-md relative">
        <div
          className={clsx(
            "absolute inset-0 bg-gray-700 rounded-md bg-opacity-50 z-10 flex items-center justify-center",
            isOutOfDate() ? "block" : "hidden"
          )}
        >
          <span className="text-3xl text-white font-semibold size-32 rounded-full flex items-center justify-center bg-blue-300">
            已過期
          </span>
        </div>
        <p className="text-xl absolute top-2 left-2 flex items-center bg-white w-8 overflow-hidden p-1 transition-all rounded-md hover:w-[90%]">
          <ClockIcon className="w-6 me-1 flex-shrink-0" />
          <span className="text-lg flex-shrink-0">
            {getDateString(product.startTime)} -{" "}
            {getDateString(product.endTime)}
          </span>
        </p>
        {!isLoaded && (
          <div className="animate-pulse bg-gray-300 h-[250px] rounded-t-md"></div>
        )}
        <img
          src={getRandomImgUrl()}
          onLoad={() => setIsLoaded(true)}
          alt="random img"
          className={clsx("rounded-t-md", isLoaded ? "block" : "invisible")}
        />
        <div className="p-2">
          <h3 className="text-3xl font-semibold mb-2">{product.productName}</h3>
          <div className="flex gap-2">
            <OpenQrCodeBtn />
            <SoldBtn />
          </div>
        </div>
      </div>
      {qrCodeModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50">
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
              <div className="w-[300px] bg-white rounded-md">
                <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
                  <h4 className="text-2xl font-semibold">
                    {product.productName}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      closeQrCodeModal();
                    }}
                  >
                    <XMarkIcon className="w-8" />
                  </button>
                </div>
                <div className="flex items-center justify-center px-4 py-8">
                  <img src={qrCodeUrl} alt="QR Code" className="size-40" />
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
      {soldModal &&
        createPortal(
          <div className="fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50">
            <div className="fixed inset-0 flex items-center justify-center backdrop-blur">
              <div className="w-[500px] bg-white rounded-md">
                <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
                  <h4 className="text-2xl font-semibold">
                    轉售 {product.productName}
                  </h4>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      closeSoldModal();
                    }}
                  >
                    <XMarkIcon className="w-8" />
                  </button>
                </div>
                <div className="px-3 py-4">
                  <div className="mb-4">
                    <label className="text-xl me-2 flex items-center">
                      <p>轉售價格</p>
                      <span className="ms-2 text-sm text-red-500 flex items-center font-semibold">
                        <ExclamationCircleIcon className="w-4" />
                        轉售價格不可高於發行價格 {releasePrice}
                      </span>
                    </label>
                    <input
                      type="number"
                      value={soldPrice}
                      onChange={(e) => setSoldPrice(e.target.value)}
                      className="border rounded-md text-lg px-2 py-1 w-full"
                      max={releasePrice}
                      step={0.01}
                    />
                  </div>
                  <button
                    onClick={soldProduct}
                    className="bg-sky-300 px-4 py-2 text-white rounded-md text-xl"
                  >
                    確認轉售
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

export default BoughtProductCard;
