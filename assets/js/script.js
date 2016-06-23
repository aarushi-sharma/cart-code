var app = angular.module('cart', []);
app.controller('cartController', function ($scope, $http) {
    init();
// add item to the cart
    $scope.addItem = function (item, quantity) {
        quantity = parseInt(quantity);
        if (quantity != 0) {
            $scope.isAdded = false;
            // update quantity for existing item
            if (localStorage.getItem("storedCart") != null) {
                $scope.cart = JSON.parse(localStorage.getItem("storedCart"));
            }
            for (var i = 0; i < $scope.cart.length && !$scope.isAdded; i++) {
                var tmpItem = $scope.cart[i];
                if (tmpItem.img == item.img) {
                    $scope.isAdded = true;
                    tmpItem.quantity = parseInt(tmpItem.quantity + quantity);
                    updateItems(item, tmpItem.quantity);
                    if (tmpItem.quantity <= 0) {
                        $scope.cart.splice(i, 1);
                    }
                }
            }
            // add new item in cart
            if (!$scope.isAdded) {
                var tmpItem = new cartItem(item.img, item.brand, item.name, item.price, quantity);
                updateItems(item, tmpItem.quantity);
                $scope.cart.push(tmpItem);
            }
            // save all changes
            saveItems();
        }
    };
// total price for each item
    $scope.getTotal = function (item) {
        $scope.totalPrice = item.quantity * item.price;
        return $scope.totalPrice;
    };
//total count of cart items
    $scope.getTotalCount = function () {
        $scope.total = 0;
        angular.forEach($scope.cart, function (value, index) {
            $scope.total += $scope.cart[index].quantity;
        });
        return $scope.total;
    };
// total price for all cart items
    $scope.getTotalPrice = function () {
        $scope.totalPrice = 0;
        angular.forEach($scope.cart, function (value, index) {
            $scope.totalPrice += $scope.getTotal(value);
        });
        return $scope.totalPrice;
    };
//remove item from the cart
    $scope.removeItem = function (item) {
        updateItems(item, 0);
        if (localStorage.getItem("storedCart") != null) {
            $scope.cart = JSON.parse(localStorage.getItem("storedCart"));
        }
        for (var i = 0; i < $scope.cart.length; i++) {
            if ($scope.cart[i].img == item.img)
                $scope.cart.splice(i, 1);
            saveItems();
        }
    };
//get data from JSON or localStorage
    function getData() {
        if (localStorage.getItem("storedItems") != null) {
            //get items from localStorage
            $scope.items = JSON.parse(localStorage.getItem("storedItems"));
        }
        else {
            //get items from JSON
            $http.get("assets/json/cartItems.json").then(
                    function (response) {
                        $scope.items = response.data.items;
                    },
                    function (response) {
                        $scope.items = "Something went wrong";
                    }
            );
        }
    }
//update items for json data
    function updateItems(item, quantity) {
        if (localStorage.getItem("storedItems") != null) {
            $scope.items = JSON.parse(localStorage.getItem("storedItems"));
        }
        for (var j = 0; j < $scope.items.length; j++) {

            if ($scope.items[j].img == item.img) {
                $scope.items[j].quantity = quantity;

            }
            localStorage.setItem("storedItems", JSON.stringify($scope.items));
        }

    }
//constructor for cart items
    function cartItem(img, brand, name, price, quantity) {
        this.img = img;
        this.brand = brand;
        this.name = name;
        this.price = price * 1;
        this.quantity = quantity * 1;
    }
//save all cart items to localStorage
    function saveItems() {
        if (localStorage.getItem("storedCart") != null) {
            localStorage.setItem("storedCart", JSON.stringify($scope.cart));
        }
        else {
            localStorage.setItem("storedCart", JSON.stringify($scope.cart));
        }
    }
//initialise the cart and json data from localStorage (if available)
    function loadCart() {
        $scope.cart = JSON.parse(localStorage.getItem("storedCart"));
        $scope.items = JSON.parse(localStorage.getItem("storedItems"));
    }
//basic initilization
    function init() {
        $scope.items = [];
        $scope.cart = [];
        $scope.isAdded = false;
        $scope.totalPrice = 0;
        getData($scope, $http);
        if (localStorage.getItem("storedCart") != null && localStorage.getItem("storedItems") != null) {
            loadCart();
        }
    }
});
	