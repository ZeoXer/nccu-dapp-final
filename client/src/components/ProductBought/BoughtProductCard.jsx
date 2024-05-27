import { useState, useEffect, useCallback } from "react";
import { useEth } from "../../contexts/EthContext";
import clsx from "clsx";
import { toDataURL } from "qrcode";
import { createPortal } from "react-dom";
import { XMarkIcon } from "@heroicons/react/20/solid";

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
  const [isLoaded, setIsLoaded] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [qrCodeModal, setQrCodeModal] = useState(false);
  const {
    state: { accounts },
  } = useEth();

  const getRandomImgUrl = () => {
    return `https://picsum.photos/id/${product.productId}/500/300`;
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

  const openModal = () => {
    setQrCodeModal(true);
  };

  const closeModal = () => {
    setQrCodeModal(false);
  };

  const isOutOfDate = () => {
    const now = new Date().getTime();
    return now > new Date(+product.endTime).getTime();
  };

  const OpenQrCodeBtn = () => {
    return (
      <button
        className="bg-sky-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={openModal}
      >
        開啟 QR Code
      </button>
    );
  };

  useEffect(() => {
    generateQRCode(product);
  }, [product, generateQRCode]);

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
        {!isLoaded && (
          <div className="animate-pulse bg-gray-300 h-[250px] rounded-t-md"></div>
        )}
        <img
          src={getRandomImgUrl()}
          onLoad={() => setIsLoaded(true)}
          alt="random img"
          className={clsx("rounded-t-md", isLoaded ? "block" : "invisible")}
        />
        <div className="p-2 flex items-center justify-between">
          <div>
            <h3 className="text-3xl font-semibold">{product.productName}</h3>
          </div>
          <OpenQrCodeBtn />
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
                      closeModal();
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
    </>
  );
};

export default BoughtProductCard;
