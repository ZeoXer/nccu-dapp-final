import QrScanner from "qr-scanner";
import { useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";

const ScanTicket = () => {
  const [qrScanner, setQrScanner] = useState(null);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [title, setTitle] = useState("");
  const [buyer, setBuyer] = useState("");
  const [releaser, setReleaser] = useState("");
  const [endTime, setEndTime] = useState("");
  const {
    state: { accounts },
  } = useEth();

  useEffect(() => {
    const qrScannerElm = document.getElementById("qr-scanner");
    const qrScanner = new QrScanner(
      qrScannerElm,
      (result) => {
        const [title, buyer, releaser, endTime] = result.data.split("-");
        setTitle(title);
        setBuyer(buyer);
        setReleaser(releaser);
        setEndTime(endTime);
        qrScanner.stop();
        qrScannerElm.style.display = "none";
        setIsScan(true);
      },
      {}
    );
    setQrScanner(qrScanner);
  }, []);

  const OpenScannerButton = () => {
    return (
      <button
        className="bg-sky-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={openScanner}
      >
        開始掃描
      </button>
    );
  };

  const checkTicket = () => {
    if (!accounts) return false;

    if (!title || !buyer || !releaser || !endTime) {
      return "無效票券";
    }

    const isReleaser = releaser === accounts[0];
    if (!isReleaser) return "非本單位發行之票券";

    const isOnTime = new Date().getTime() < new Date(+endTime).getTime();
    if (!isOnTime) return "票券已過期";

    return "";
  };

  const openScanner = () => {
    setIsModalShow(true);
    document.getElementById("qr-scanner").style.display = "block";
    qrScanner.start();
  };

  const closeScanner = () => {
    qrScanner.stop();
    setIsScan(false);
    setIsModalShow(false);
  };

  return (
    <>
      <OpenScannerButton />
      <div
        className={clsx(
          "fixed inset-0 z-[1000] bg-gray-500 bg-opacity-50",
          isModalShow ? "block" : "hidden"
        )}
      >
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur overflow-y-scroll">
          <div className="w-[400px] bg-white rounded-md relative">
            <div className="bg-sky-300 px-3 py-4 rounded-t-md text-white flex items-center justify-between">
              <h4 className="text-2xl font-semibold">掃描票券</h4>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  closeScanner();
                }}
              >
                <XMarkIcon className="w-8" />
              </button>
            </div>
            <div className="p-1">
              <div className="flex items-center justify-center">
                <video id="qr-scanner" className="size-80"></video>
              </div>
              {isScan &&
                (!checkTicket() ? (
                  <div className="px-3 py-4">
                    <h5 className="text-xl text-center mb-4">
                      驗證 <span className="text-2xl font-bold">{title}</span>{" "}
                      成功
                    </h5>
                    <p className="text-gray-500 text-center mb-2 w-4/5 truncate">
                      使用者 {buyer}
                    </p>
                  </div>
                ) : (
                  <div className={"px-3 py-4"}>
                    <h5 className="text-2xl text-center mb-4">
                      {checkTicket()}
                    </h5>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ScanTicket;
