const ProductBought = () => {
  const productList = [];
  
  return (
    <div className="px-3 py-4">
      <h2 className="text-3xl mb-8">所有商品列表</h2>
      {productList[0] === null || productList?.length === 0 ? (
        <div className="py-8 text-center text-2xl">尚無商品</div>
      ) : (
        <div className="grid grid-cols-4 gap-2">{productList}</div>
      )}
    </div>
  );
};

export default ProductBought;
