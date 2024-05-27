import ScanTicket from "./ScanTicket";

const Scanner = () => {
  return (
    <div className="px-3 py-4">
      <h2 className="text-4xl mb-8 font-bold border-b pb-2 border-black">
        掃描票券
      </h2>
      <ScanTicket />
    </div>
  );
};

export default Scanner;
