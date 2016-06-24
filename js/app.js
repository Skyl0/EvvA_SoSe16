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
	
	angular.module('pizza',['ngRoute'])
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
	.controller('AnzeigeController',function($http){
				
		var _this = this
		_this.id = 21;
		//_this.myorder = order2;
		_this.myorder = {};
		//_this.myarray = {};
		
		_this.getMyOrder = function(){
			
			$http.get('get_by_id.php',{params:{"id": _this.id}})
			
			.success(function(datar){

				_this.myorder = angular.fromJson(datar);
				console.log(_this.myorder);
				return _this.myorder;
			})
		}
	})	
	.controller ('OrderController',function($http,Warenkorb) {
		var _this = this;
		_this.order = {};
		_this.order.cart = Warenkorb.getItems();
		_this.order.address = '';
		_this.order.id = 0;
		
		
		_this.placeOrder = function() {
				// TODO GET nehmen um die ID zu empfangen und dem Kunden auszugeben
			$http.post('insert.php',  {order : _this.order} ).success(function(data){
					_this.order.id = data; 
					console.log ("Placed Order! ID: " + _this.order.id);
			},function() {
				console.log("Error placing order!");
			});
			console.log('Order ' + JSON.stringify(_this.order) );
			
		}
	})
	.controller ('UpdateController',function($http) {
		
		var _this = this;
		
		_this.result = {};
		_this.id = 23;
		/*
		this.updateById = function() {
			
		$http.post('update_by_id.php', _this.updateMsg,{params:{"id": _this.id}})
			.success(function(){
				console.log('Updated!');
			});
		}
			*/
		
		_this.getAll = function() {
			$http.get('get_all.php')
			.success(function(data){
				console.log('get_all.php fired!');
				_this.result = angular.fromJson(data);
				console.log(_this.result);
				
			});
		}
		
		_this.upStatus = function(pizza) {
			//this.result.cart[index].status += 1
			//console.log('TO IMPLEMENT STILL, idclicked = ' + index);
			if (pizza.status < 5) {
				pizza.status += 1;
				console.log(pizza);
				this.writeBack();
			}
		};
		
		_this.downStatus = function(pizza) {
			//this.result.cart[index].status += 1
			//console.log('TO IMPLEMENT STILL, idclicked = ' + index);
			if (pizza.status > 0) { pizza.status -= 1;
				console.log(pizza);
				this.writeBack();
			 }
			
		};
		
		_this.writeBack = function () {
			console.log("-------\nWrite Back˜\n-------");
			var actual;
			
			for (var myorder in _this.result.allorders) {
				
				actual = _this.result.allorders[myorder];
			  	console.log(actual);
			    console.log( " ROW ID -> " + actual.rowid);
				
			    var $request = $http({
			       method: "post",
			       url: "update_by_id.php",
			       data: {
			           id: actual.rowid,
			           order: actual.order
			       }
			   });
			   
				$request.success(function(data){
					console.log ("Updating Order! ID: " + actual.rowid);
				});
				//console.log('Order ' + JSON.stringify(_this.order) );
		  }
		  
			

			//*/
			
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
	

 