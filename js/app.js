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
		this.order = {};
		this.order.cart = Warenkorb.getItems();
		this.order.address = '';
		this.order.id = '';
		
		
		this.placeOrder = function() {
				// TODO GET nehmen um die ID zu empfangen und dem Kunden auszugeben
			$http.get('insert.php',  {order : this.order} ).then(function(data){
					console.log("Placed Order!");
					this.order.id = data; 
					console.log ("ID: " + this.order.id);
			},function() {
				console.log("Error placing order!");
			});
			console.log('Order ' + JSON.stringify(this.order.cart) );
			
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
			$http.get('get_all.php').success(function(data){
				_this.result = angular.fromJson(data);
				console.log('Got all!' . _this.result);
			});
		}
		
		this.upStatus = function(index) {
			//this.result.cart[index].status += 1
			console.log('TO IMPLEMENT STILL');
		};
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
	

 