import { useCallback, useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { config } from "../../config";

const Record = () => {
  const [balance, setBalance] = useState(0);

  const {
    state: { contract, accounts },
  } = useEth();

  const getBalance = useCallback(async () => {
    if (!contract) return;
    const response = await contract.methods
      .getBalance()
      .call({ from: accounts[0] });
    setBalance(response);
  }, [accounts, contract]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  return (
    <div className="px-3 py-4">
      <div className="flex flex-col items-center">
        <h2 className="text-3xl mb-4">售賣總額</h2>
        <p className="text-4xl font-bold italic mb-4">
          {balance / config.PRICE_BASE}
        </p>
        <button className="bg-sky-300 text-white text-xl px-5 py-3 rounded-md">
          提領
        </button>
      </div>
    </div>
  );
};

export default Record;
