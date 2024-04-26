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
    }

    constructor() {
        owner = msg.sender;
    }

    // // 賣家 => 商品編號 => 商品庫存
    // mapping(address => mapping(uint256 => uint256)) public inventory;
    // // 賣家 => 商品編號 => 商品價格
    // mapping(address => mapping(uint256 => uint256)) public prices;
    // 賣家帳戶餘額
    mapping(address => uint256) public balances;

    mapping(uint256 => Product) public products;
    uint256 public productCount = 0;

    // 紀錄監聽重要事件
    event ProductAdd(
        address indexed seller,
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
    event ProductRemove(address indexed seller, uint256 indexed productId);
    event ProductBuy(
        address indexed buyer,
        address indexed seller,
        uint256 indexed productId,
        uint256 price,
        uint256 stock
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    function addProduct(
        string productName,
        uint256 price,
        uint256 stock
    ) public {
        productCount++;
        products[productCount] = Product(
            msg.sender,
            productCount,
            productName,
            price,
            stock
        );
        emit ProductAdd(msg.sender, productCount, productName, price, stock);
    }

    function updateProduct(
        uint256 productId,
        uint256 price,
        uint256 stock
    ) public {
        require(inventory[msg.sender][productId] > 0, "Product not exist");
        inventory[msg.sender][productId] = stock;
        prices[msg.sender][productId] = price;
        emit ProductUpdate(msg.sender, productId, price, stock);
    }

    function removeProduct(uint256 productId) public {
        require(inventory[msg.sender][productId] > 0, "Product not exist");
        inventory[msg.sender][productId] = 0;
        prices[msg.sender][productId] = 0;
        emit ProductRemove(msg.sender, productId);
    }

    function buyProduct(
        address seller,
        uint256 productId,
        uint256 quantity
    ) public payable {
        require(
            inventory[seller][productId] > quantity,
            "Insufficient quantity of product"
        );
        require(
            msg.value >= prices[seller][productId] * quantity,
            "Insufficient funds"
        );
        balances[seller] += prices[seller][productId] * quantity;
        inventory[seller][productId] -= quantity;
        emit ProductBuy(
            msg.sender,
            seller,
            productId,
            prices[seller][productId],
            inventory[seller][productId]
        );
    }

    function withdrawBalance() public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        uint256 amount = balances[msg.sender];
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(amount);
    }
}
