import AddProduct from "./AddProduct";

const ProductManage = () => {
  return (
    <div className="px-3 py-4">
      <div className="flex justify-between items-start">
        <h2 className="text-3xl">商品管理</h2>
        <AddProduct />
      </div>
    </div>
  );
};

export default ProductManage;
