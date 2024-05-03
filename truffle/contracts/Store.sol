// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Store {
    address public owner;
    struct Product {
        address seller;
        uint256 productId;
        string productName;
        uint256 price;
        uint256 stock;
        bool onSell;
    }

    struct BuyerProduct {
        uint256 productId;
        string productName;
    }

    constructor() {
        owner = msg.sender;
    }

    // 賣家帳戶餘額
    mapping(address => uint256) public balances;

    // 紀錄商品列表
    mapping(uint256 => Product) public products;

    // 紀錄買家購買的商品
    mapping(address => BuyerProduct[]) public buyerProducts;

    // 紀錄商品編號
    uint256 public productIds = 0;

    // 紀錄監聽重要事件
    event ProductAdd(
        address indexed seller,
        uint256 indexed productId,
        string indexed productName,
        uint256 price,
        uint256 stock
    );
    event ProductUpdate(
        address indexed seller,
        uint256 indexed productId,
        string indexed productName,
        uint256 price,
        uint256 stock
    );
    event ProductToggleSold(address indexed seller, uint256 indexed productId);
    event ProductBuy(
        address indexed buyer,
        address indexed seller,
        uint256 indexed productId,
        uint256 price,
        uint256 quantity
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier checkIsSeller(address productSeller, address sender) {
        require(productSeller == sender, "Product doesn't belong to sender");
        _;
    }

    function addProduct(
        string memory productName,
        uint256 price,
        uint256 stock
    ) public {
        productIds++;
        products[productIds] = Product(
            msg.sender,
            productIds,
            productName,
            price,
            stock,
            true
        );
        emit ProductAdd(msg.sender, productIds, productName, price, stock);
    }

    function updateProduct(
        uint256 productId,
        string memory productName,
        uint256 price,
        uint256 stock
    ) public checkIsSeller(products[productId].seller, msg.sender) {
        products[productId].productName = productName;
        products[productId].stock = stock;
        products[productId].price = price;
        emit ProductUpdate(msg.sender, productId, productName, price, stock);
    }

    function toggleSoldProduct(
        uint256 productId
    ) public checkIsSeller(products[productId].seller, msg.sender) {
        products[productId].onSell = !products[productId].onSell;
        emit ProductToggleSold(msg.sender, productId);
    }

    function buyProduct(
        address seller,
        uint256 productId,
        uint256 quantity
    ) public payable {
        require(
            products[productId].stock > quantity,
            "Insufficient quantity of product"
        );
        require(
            msg.value >= products[productId].price * quantity,
            "Insufficient funds"
        );
        // 計算賣方的帳戶餘額
        balances[seller] += products[productId].price * quantity;
        products[productId].stock -= quantity;
        // 將商品添加到買家的紀錄中
        for (uint256 i = 0; i < quantity; i++) {
            buyerProducts[msg.sender].push(
                BuyerProduct(productId, products[productId].productName)
            );
        }
        emit ProductBuy(
            msg.sender,
            seller,
            productId,
            products[productId].price,
            quantity
        );
    }

    function withdrawBalance() public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }

    function getBalance() public view returns (uint256) {
        return balances[msg.sender];
    }

    function getAllProducts() public view returns (Product[] memory) {
        Product[] memory allProducts = new Product[](productIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= productIds; i++) {
            if (products[i].onSell && products[i].seller != msg.sender) {
                allProducts[count] = products[i];
                count++;
            }
        }

        return allProducts;
    }

    function getSellerProducts() public view returns (Product[] memory) {
        Product[] memory sellerProducts = new Product[](productIds);
        uint256 count = 0;

        for (uint256 i = 1; i <= productIds; i++) {
            if (products[i].seller == msg.sender) {
                sellerProducts[count] = products[i];
                count++;
            }
        }

        return sellerProducts;
    }

    function getBuyerProducts() public view returns (BuyerProduct[] memory) {
        return buyerProducts[msg.sender];
    }
}
