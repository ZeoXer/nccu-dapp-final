import QrScanner from "qr-scanner";
import { useEffect, useState, useCallback } from "react";
import { useEth } from "../../contexts/EthContext";
import { XMarkIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const ScanTicket = () => {
  const [qrScanner, setQrScanner] = useState(null);
  const [isModalShow, setIsModalShow] = useState(false);
  const [isScan, setIsScan] = useState(false);
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState({});
  const {
    state: { accounts, contract },
  } = useEth();

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

  const checkTicket = useCallback(
    async (id, releaser, start, end, isUsed) => {
      if (!accounts) return false;

      await contract.methods
        .verifyTicket(id, releaser, start, end, isUsed)
        .send({ from: accounts[0] });
    },
    [accounts, contract]
  );

  const openScanner = () => {
    setIsModalShow(true);
    document.getElementById("qr-scanner").style.visibility = "visable";
    setMessage("掃描中...");
    qrScanner.start();
  };

  const closeScanner = () => {
    qrScanner.stop();
    setIsScan(false);
    setIsModalShow(false);
  };

  useEffect(() => {
    const qrScannerElm = document.getElementById("qr-scanner");
    const qrScanner = new QrScanner(
      qrScannerElm,
      (result) => {
        const [id, releaser, buyer, title, start, end, isUsed] =
          result.data.split("@");
        setTicket({
          buyer,
          title,
        });
        console.log(id, releaser, buyer, title, start, end, isUsed === "true");
        checkTicket(id, releaser, +start, +end, isUsed === "true");
        qrScanner.stop();
        qrScannerElm.style.visibility = "invisible";
        setIsScan(true);
      },
      {}
    );
    setQrScanner(qrScanner);
  }, [checkTicket, ticket]);

  useEffect(() => {
    const subscribeEvent = async () => {
      contract?.events.TicketChecked({}, (error, event) => {
        if (error) {
          console.error(error);
        } else {
          console.log(event.returnValues.message);
          switch (event.returnValues.message) {
            case "ticket verified":
              setMessage("成功");
              break;
            case "ticket used":
              setMessage("票券已使用");
              break;
            case "ticket unstarted":
              setMessage("票券時間未開始");
              break;
            case "ticket expired":
              setMessage("票券已過期");
              break;
            case "ticket unauthorized":
              setMessage("非本單位發行之票券");
              break;
            default:
              setMessage("掃描中...");
              break;
          }
        }
      });
    };

    subscribeEvent();

    // Don't forget to unsubscribe when the component unmounts
    return () => {
      contract?.events.TicketChecked().unsubscribe();
    };
  }, [contract]);

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
              <div className="flex items-center justify-center relative">
                <video id="qr-scanner" className="size-40"></video>
                {isScan && (
                  <div className="absolute left-1/2 -translate-x-1/2">
                    <MagnifyingGlassIcon className="w-20" />
                  </div>
                )}
              </div>
              {isScan &&
                (message === "成功" ? (
                  <div className="px-3 py-4">
                    <h5 className="text-xl text-center mb-4">
                      驗證{" "}
                      <span className="text-2xl font-bold">
                        {ticket?.title}
                      </span>{" "}
                      完成
                    </h5>
                    <p className="text-gray-500 text-center mb-2">使用者</p>
                    <p className="text-gray-500 mx-auto mb-4 w-44 truncate">
                      {ticket?.buyer}
                    </p>
                  </div>
                ) : (
                  <div className={"px-3 py-4"}>
                    <h5 className="text-2xl text-center mb-4">{message}</h5>
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
