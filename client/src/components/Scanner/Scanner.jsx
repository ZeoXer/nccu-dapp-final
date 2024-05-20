import QrScanner from "qr-scanner";
import { useState, useEffect } from "react";

const Scanner = () => {
  const [qrScanner, setQrScanner] = useState(null);

  const handleQRCodeScanner = () => {
    qrScanner.start();
  };

  useEffect(() => {
    const qrScannerElm = document.getElementById("qr-scanner");
    const qrScanner = new QrScanner(
      qrScannerElm,
      (result) => console.log(result),
      {}
    );
    setQrScanner(qrScanner);
  }, []);

  return (
    <div className="px-3 py-4">
      <h2 className="text-4xl mb-8 font-bold border-b pb-2 border-black">
        掃描票券
      </h2>
      <button
        className="bg-sky-300 text-white text-xl px-4 py-3 rounded-md"
        onClick={handleQRCodeScanner}
      >
        開始掃描
      </button>
      <div className="flex items-center">
        <video id="qr-scanner" className="size-40"></video>
      </div>
    </div>
  );
};

export default Scanner;
