// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Store {
    address public owner;
    struct Product {
        uint256 productId;
        string productName;
        string productDescription;
        uint256 startTime;
        uint256 endTime;
        address releaser;
        address seller;
        uint releasePrice;
        uint256 price;
        uint256 stock;
        bool onSell;
    }

    struct BuyerProduct {
        address releaser;
        address seller;
        uint256 productId;
        string productName;
        string productDescription;
        uint256 startTime;
        uint256 endTime;
        uint256 releasePrice;
        bool isUsed;
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
        address indexed releaser,
        uint256 indexed productId,
        string indexed productName,
        uint256 releasePrice,
        uint256 stock
    );
    event ProductUpdate(
        address indexed seller,
        uint256 indexed productId,
        string indexed productName,
        uint256 stock
    );
    event ProductToggleSold(address indexed seller, uint256 indexed productId);
    event ProductBuy(
        address indexed buyer,
        address indexed seller,
        uint256 indexed productId,
        uint256 price,
        string productName,
        uint256 quantity
    );
    event WithdrawBalance(address indexed buyer, uint256 value);

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
        string memory productDescription,
        uint startTime,
        uint endTime,
        uint256 price,
        uint256 stock
    ) public {
        productIds++;
        products[productIds] = Product(
            productIds,
            productName,
            productDescription,
            startTime,
            endTime,
            msg.sender,
            msg.sender,
            price,
            price,
            stock,
            true
        );
        emit ProductAdd(msg.sender, productIds, productName, price, stock);
    }

    function updateProduct(
        uint256 productId,
        string memory productName,
        string memory productDescription,
        uint256 stock
    ) public checkIsSeller(products[productId].seller, msg.sender) {
        require(
            block.timestamp < products[productId].startTime,
            "Not allow to update product after start time"
        );
        products[productId].productName = productName;
        products[productId].productDescription = productDescription;
        products[productId].stock = stock;
        emit ProductUpdate(msg.sender, productId, productName, stock);
    }

    function toggleSoldProduct(
        uint256 productId
    ) public checkIsSeller(products[productId].seller, msg.sender) {
        products[productId].onSell = !products[productId].onSell;
        emit ProductToggleSold(msg.sender, productId);
    }

    function removeBuyerProduct(uint256 productId) public {
        uint256 index = 0;
        for (uint256 i = 0; i < buyerProducts[msg.sender].length; i++) {
            if (buyerProducts[msg.sender][i].productId == productId) {
                index = i;
                break;
            }
        }

        if (index != buyerProducts[msg.sender].length - 1) {
            buyerProducts[msg.sender][index] = buyerProducts[msg.sender][
                buyerProducts[msg.sender].length - 1
            ];
        }

        buyerProducts[msg.sender].pop();
    }

    function resellProduct(
        uint256 productId,
        address releaser,
        string memory productName,
        string memory productDescription,
        uint startTime,
        uint endTime,
        uint256 releasePrice,
        uint256 price
    ) public {
        require(
            block.timestamp < endTime,
            "Not allow to resell product after end time"
        );
        productIds++;
        products[productIds] = Product(
            productIds,
            productName,
            productDescription,
            startTime,
            endTime,
            releaser,
            msg.sender,
            releasePrice,
            price,
            1,
            true
        );
        removeBuyerProduct(productId);
        emit ProductAdd(msg.sender, productIds, productName, price, 1);
    }

    function removeResellProduct(
        uint256 productId
    ) public checkIsSeller(products[productId].seller, msg.sender) {
        products[productId].onSell = false;
        products[productId].seller = 0x0000000000000000000000000000000000000000;
        buyerProducts[msg.sender].push(
            BuyerProduct(
                products[productId].releaser,
                msg.sender,
                productId,
                products[productId].productName,
                products[productId].productDescription,
                products[productId].startTime,
                products[productId].endTime,
                products[productId].releasePrice,
                false
            )
        );
    }

    function buyProduct(uint256 productId, uint256 quantity) public payable {
        require(
            products[productId].stock >= quantity,
            "Insufficient quantity of product"
        );
        require(
            msg.value >= products[productId].price * quantity,
            "Insufficient funds"
        );
        address seller = products[productId].seller;
        // 計算賣方的帳戶餘額
        balances[seller] += products[productId].price * quantity;
        products[productId].stock -= quantity;
        // 將商品添加到買家的紀錄中
        for (uint256 i = 0; i < quantity; i++) {
            buyerProducts[msg.sender].push(
                BuyerProduct(
                    products[productId].releaser,
                    seller,
                    productId,
                    products[productId].productName,
                    products[productId].productDescription,
                    products[productId].startTime,
                    products[productId].endTime,
                    products[productId].releasePrice,
                    false
                )
            );
        }
        emit ProductBuy(
            msg.sender,
            seller,
            productId,
            products[productId].price,
            products[productId].productName,
            quantity
        );
    }

    // function verifyTicket(){
    //     // 這裡要實作驗證票券的邏輯
    // }

    function withdrawBalance(uint256 value) public {
        require(balances[msg.sender] > 0, "Insufficient funds");
        balances[msg.sender] = 0;
        payable(msg.sender).transfer(value);
        emit WithdrawBalance(msg.sender, value);
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
