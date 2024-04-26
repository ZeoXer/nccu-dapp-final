import { useState } from "react";
import { useEth } from "../../contexts/EthContext";

const AddProductBtn = () => {
  const [isModalShow, setIsModalShow] = useState(false);
  const {
    state: { contract, accounts },
  } = useEth();

  const openModal = () => {
    setIsModalShow(true);
  };

  const addProduct = async () => {
    await contract.methods.addProduct().send({ from: accounts[0] });
  };

  return (
    <div>
      <button className="btn btn-primary" onClick={openModal}>
        Add Product
      </button>
      {isModalShow && (
        <div>
          <div>
            <label>Product Name</label>
            <input type="text" />
          </div>
          <div>
            <label>Price</label>
            <input type="number" />
          </div>
          <button onClick={addProduct}>Add</button>
        </div>
      )}
    </div>
  );
};

export default AddProductBtn;
