(function(){
	"use strict;"
	
	var data2 = [
		{name : "Margharita", price : 5.0, status: 0},
		{name : "Tonno",	price : 6.5, status: 0},
		{name : "Frutti di Mare", price : 8.3, status: 0}
	];
	
	/**
	---------------------
	ERKLÄRUNG STATUS
	---------------------
	0 - bestellt
	1 - im Ofen
	2 - Fertig zur Lieferung
	3 - Unterwegs
	4 - Ausgeliefert	
	---------------------
	**/
	
	var order2 = [{"order":{"cart":[{"name":"Tonno","price":6.5,"status":0},{"name":"Frutti di Mare","price":8.3,"status":0}],"address":"asdasdsad","id":""}}];
	
	angular.module('pizza',['ngRoute','ngCookies'])
	.config(function ($routeProvider) {
		$routeProvider.when("/#", {
			templateUrl: "order.html",
		}).when("/anzeige", {
			templateUrl: "anzeige.html",
		}).when("/baecker", {
			templateUrl: "baecker.html",
		}).when("/fahrer", {
			templateUrl: "fahrer.html",
		}).otherwise({
			redirectTo: "/#"
		});
	})
	.controller('PizzaController',function($http,Warenkorb){
		this.pizzen = [];
		this.cart = Warenkorb;
		this.adress = '';
		this.pizzen = data2;
	
	})	
	.controller('AnzeigeController',function($http,$cookies){
				
		var _this = this
		var cookie_id ;
		_this.id = 0;
		cookie_id = $cookies.get('order_id');
		
		if (cookie_id) {_this.id = cookie_id;}
		//_this.myorder = order2;
		_this.myorder = {};
		//_this.myarray = {};
		
		_this.cookieUpdate = function() {
			
			this.getMyOrder();
			
		}
		_this.getMyOrder = function(){
			
			$http.get('get_by_id.php',{params:{"id": _this.id}})
			
			.success(function(datar){

				_this.myorder = angular.fromJson(datar);
				console.log(_this.myorder);
				return _this.myorder;
			})
		}
	})	
	.controller ('OrderController',function($http,$cookies,Warenkorb) {
		var _this = this;
		_this.order = {};
		_this.order.cart = Warenkorb.getItems();
		_this.order.address = '';
	//	_this.order.id = 0;
		
		_this.placeOrder = function() {
				// TODO GET nehmen um die ID zu empfangen und dem Kunden auszugeben
			$http.post('insert.php',  {order : _this.order} ).success(function(data){
					var myid = data; 
					//console.log ("Placed Order! ID: " + myid);
					alert("Ihre Order Id ist " + myid);
					$cookies.put('order_id', myid);
			},function() {
				console.log("Error placing order!");
			});
			console.log('Order ' + JSON.stringify(_this.order) );
			
			
		}
	})
	.controller ('UpdateController',function($http) {
		
		var _this = this;
		
		_this.result = {};
		//_this.id ;
		
		_this.getAll = function() {
			$http.get('get_all.php')
			.success(function(data){
				console.log('get_all.php fired!');
				_this.result = angular.fromJson(data);
				console.log(_this.result);
				
			});
		}
		
		_this.isOrderReady  = function(cart) {
			//console.log("Is my order ready?");
			//console.log(cart);
			for (var i in cart) {
			//	console.log("I = " + i);
				if (cart[i].status < 2) { return false; }
			}
			return true;
		};
		
		_this.isNotInDelivery  = function (cart) {
		//	console.log(cart);
			for (var i in cart) {
		//		console.log("I = " + i);
				if (cart[i].status > 2) { return false; }
			}
			return true;
		};
		
		_this.upCart = function(cart,index) {
			for (var i in cart) {
				cart[i].status += 1;
			}
			this.writeBackId(index);
		};
		
		_this.downCart = function(cart,index) {
			for (var i in cart) {
				cart[i].status -= 1;
			}
			this.writeBackId(index);
		};
		
		_this.upStatus = function(pizza,index) {
			//this.result.cart[index].status += 1
			console.log(' idclicked = ' + index);
			if (pizza.status < 2) {
				pizza.status += 1;
				console.log(pizza);
				this.writeBackId(index);
			}
		};
		
		_this.downStatus = function(pizza,index) {
			//this.result.cart[index].status += 1
			console.log(' idclicked = ' + index);
			if (pizza.status > 0) { pizza.status -= 1;
				console.log(pizza);
				this.writeBackId(index);
			 }
			
		};
		
		_this.writeBackId = function (index) {
			console.log("-------\nWrite Back ID\n-------");
			var actual;
				
				actual = _this.result.allorders[index];
			  	console.log(actual);
			   //console.log( "WriteBackId - ROW ID -> " + actual.rowid);
				
			    var $request = $http({
			       method: "post",
			       url: "update_by_id.php",
			       data: {
			           id: actual.rowid,
			           order: actual.order
			       }
			   });
			   
				$request.success(function(data){
					console.log ("WriteBackID - Updating Order! ID: " + actual.rowid);
				});
				//console.log('Order ' + JSON.stringify(_this.order) );
		  }
		  
		  _this.archiveItem = function(index) {
		  	
  			console.log("-------\nArchive\n-------");

  			   //console.log( "WriteBackId - ROW ID -> " + actual.rowid);
				
  			    var $request = $http({
  			       method: "post",
  			       url: "archive_by_id.php",
  			       data: {
  			           id: index
  			       }
  			   });
			   
  				$request.success(function(data){
  					console.log ("Archive ID - Updating Order! ID: " + index);
  				});
  				//console.log('Order ' + JSON.stringify(_this.order) );
		  }
		

	})
	.factory ('Warenkorb', function(){
		var items = [];
		return {
			getItems: function() {
				return items;
			},
			addToBasket: function(article) {
				items.push(article);
			},
			removeArticle: function(index) {
				console.log("Index clicked: " + index);
				items.splice(index, 1);
			},
			sum: function() {
				return items.reduce(function (total, article) {
					return total + article.price;
				}, 0);
			}
		};
	})
	.directive('showPizzas', function() {
		return {
			restrict: 'E',
			templateUrl: 'mypizzas.html'
		};
	})
	.directive('orderForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'orderform.html'
		};
	});
	
})();
	

 