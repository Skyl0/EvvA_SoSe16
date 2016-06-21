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
				
		this.adress = '';
		this.id = 13;
		//this.myorder = order2;
		this.myorder = {};
		this.myarray = {};
		
		this.getMyOrder = function(){
			
			$http.get('get_by_id.php',{params:{"id": this.id}}).success(function(datar){
				
				this.myorder = angular.fromJson(datar);
				this.myarray = this.myorder.order;
				console.log(this.myarray);
			//this.myorder = angular.fromJson('{"order":{"cart":[{"name":"Tonno","price":6.5,"status":0},{"name":"Frutti di Mare","price":8.3,"status":0}],"address":"asdasdsad","id":""}}');
				//this.myorder = JSON.parse( data );
				
				//console.log("Got it!" . data.order.address);
			})
		}
	})	
	.controller ('OrderController',function($http,Warenkorb) {
		this.order = {};
		this.order.cart = Warenkorb.getItems();
		this.order.address = '';
		this.order.id = '';
		
		
		this.placeOrder = function() {
				
			$http.post('insert.php', { order: this.order } ).success(function(data){
					console.log("Placed Order!");
					//this.order.id = data;
			});
			console.log('Order ' + JSON.stringify(this.order) );
		}
	})
	.controller ('UpdateController',function($http) {
		this.uporder = order2;
		this.updateMsg = ''; // MUSS ERSETZT WERDEN DURCH EIN OBJEKT , welches durch Formular Aktionen verändert wird und regelmässig zurückgeschrieben wird.
		this.id = 13;
		this.result = {};
		
		this.updateById = function() {
			
		$http.post('update_by_id.php', this.updateMsg,{params:{"id": this.id}}).success(function(){
				console.log('Updated!');
			});
		}
		
		this.getAll = function() {
			$http.get('get_all.php').success(function(data){
				this.result = angular.fromJson(data);
				//console.log('Got all!' . this.result);
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
	

 