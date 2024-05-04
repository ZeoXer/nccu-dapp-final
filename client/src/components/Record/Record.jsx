import { useCallback, useEffect, useState } from "react";
import { useEth } from "../../contexts/EthContext";
import { config } from "../../config";
import Web3 from "web3";
import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/24/outline";

const Record = () => {
  const [balance, setBalance] = useState(0);
  const [currentTab, setCurrentTab] = useState("buy");
  const [buyerRecords, setBuyerRecords] = useState([]);
  const [sellerRecords, setSellerRecords] = useState([]);

  const web3 = new Web3(window.ethereum);
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

  const withdrawBalance = async () => {
    if (!contract) return;

    const balanceInWei = web3.utils.toWei(
      (balance / config.PRICE_BASE).toString(),
      "ether"
    );
    await contract.methods
      .withdrawBalance(balanceInWei)
      .send({ from: accounts[0] });
    window.location.reload();
  };

  const arrangeEvents = useCallback(
    (productEvents, balanceEvents) => {
      const buyerEvents = [];
      const sellerEvents = [];

      // 整理 ProductBuy 事件
      if (productEvents.length !== 0) {
        productEvents.forEach((event) => {
          const eventTarget = event.returnValues;
          if (eventTarget.buyer === accounts[0]) {
            buyerEvents.push({
              type: "BUY",
              number: event.blockNumber,
              name: eventTarget.productName,
              price: eventTarget.price / config.PRICE_BASE,
              quantity: eventTarget.quantity,
              from: eventTarget.seller,
            });
          } else if (eventTarget.seller === accounts[0]) {
            sellerEvents.push({
              name: eventTarget.productName,
              price: eventTarget.price / config.PRICE_BASE,
              quantity: +eventTarget.quantity,
              to: eventTarget.seller,
            });
          }
        });
      }

      // 整理 WithdrawBalance 事件
      if (balanceEvents.length !== 0) {
        balanceEvents.forEach((event) => {
          const eventTarget = event.returnValues;
          if (eventTarget.buyer === accounts[0]) {
            buyerEvents.push({
              type: "WITHDRAW",
              number: event.blockNumber,
              value: eventTarget.value,
            });
          }
        });
      }

      setBuyerRecords(
        buyerEvents
          .sort((a, b) => {
            return a.number - b.number;
          })
          .reverse()
      );
      setSellerRecords(sellerEvents.reverse());
    },
    [accounts]
  );

  const getEvents = useCallback(async () => {
    if (!contract) return;
    const productResponse = await contract.getPastEvents("ProductBuy", {
      fromBlock: 0,
      toBlock: "latest",
    });
    const withdrawResponse = await contract.getPastEvents("WithdrawBalance", {
      fromBlock: 0,
      toBlock: "latest",
    });

    arrangeEvents(productResponse, withdrawResponse);
  }, [contract, arrangeEvents]);

  useEffect(() => {
    getBalance();
    getEvents();
  }, [getBalance, getEvents]);

  const buyerRecordList = buyerRecords.map((record, idx) => {
    if (record.type === "BUY") {
      return (
        <div
          key={idx}
          className="border-b py-3 px-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-3xl font-semibold flex items-center">
              <span>{record.name}</span>{" "}
              <XMarkIcon className="w-6 inline mx-1" />{" "}
              <span>{record.quantity}</span>
            </h3>
            <p className="text-xl text-gray-400">從 {record.from}</p>
          </div>
          <p className="text-3xl font-semibold">
            - {record.price * record.quantity}
          </p>
        </div>
      );
    } else if (record.type === "WITHDRAW") {
      return (
        <div
          key={idx}
          className="border-b py-3 px-4 flex justify-between items-center"
        >
          <div>
            <h3 className="text-3xl font-semibold">提領</h3>
            <p className="text-xl text-gray-400">給 {accounts[0]}</p>
          </div>
          <p className="text-3xl font-semibold">- {record.value / 10 ** 18}</p>
        </div>
      );
    } else {
      return null;
    }
  });

  const sellerRecordList = sellerRecords.map((record, idx) => {
    return (
      <div
        key={idx}
        className="border-b py-3 px-4 flex justify-between items-center"
      >
        <div>
          <h3 className="text-3xl font-semibold flex items-center">
            <span>{record.name}</span> <XMarkIcon className="w-6 inline mx-1" />{" "}
            <span>{record.quantity}</span>
          </h3>
          <p className="text-xl text-gray-400">給 {record.to}</p>
        </div>
        <p className="text-3xl font-semibold">
          + {record.price * record.quantity}
        </p>
      </div>
    );
  });

  return (
    <div className="px-3 py-4">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-3xl mb-4 font-semibold">販賣總額</h2>
        <p className="text-4xl font-bold mb-4">{balance / config.PRICE_BASE}</p>
        <button
          className="bg-sky-300 text-white text-xl px-5 py-3 rounded-md disabled:bg-gray-300 disabled:cursor-not-allowed"
          onClick={withdrawBalance}
          disabled={balance <= 0}
        >
          提領
        </button>
      </div>
      <div>
        <div className="grid grid-cols-2">
          <div
            className={clsx(
              "text-2xl text-center font-semibold border py-2 rounded-t-md cursor-pointer",
              currentTab === "buy" && "bg-sky-300 text-white border-sky-300"
            )}
            onClick={() => setCurrentTab("buy")}
          >
            購買紀錄
          </div>
          <div
            className={clsx(
              "text-2xl text-center font-semibold border py-2 rounded-t-md cursor-pointer",
              currentTab === "sell" && "bg-sky-300 text-white border-sky-300"
            )}
            onClick={() => setCurrentTab("sell")}
          >
            販賣紀錄
          </div>
        </div>
        {currentTab === "buy"
          ? buyerRecordList
          : currentTab === "sell"
          ? sellerRecordList
          : "Error"}
      </div>
    </div>
  );
};

export default Record;
