var Animal = (function() {
    var entity = function (id, name, created, species) {
        this.Id = id;
        this.Name = name;
        this.Created  = new Date();
        if(species)
        this.Species = new Species(species.Id, species.Name, species.Created);
        this.locked = false;
    };
    entity.prototype.setLock = function(lock) {
        this.Locked = lock;
    };
    return entity;
})();
var Species = (function () {
    var entity = function (id, name, created) {
      
        this.Id = id;
        this.Name = name;
        this.Created = created;
       
    };
    return entity;
})();



// angular

var animalApp = angular.module("animalApp", ['ngRoute', 'xsockets.angular', 'xsockets.helpers']);


animalApp.config(["$locationProvider", "$routeProvider","xsocketsProvider",
        function ($locationProvider, $routeProvider,xsocketsProvider) {


            xsocketsProvider.setUrl("ws://127.0.0.1:4502/AnimalsRealtime");
           
            $routeProvider.when("/animals", { templateUrl: "/app/partials/animals.html", controller: "AnimalsController" }).
            when("/species", {
                 templateUrl: "/app/partials/species.html", controller: "SpeciesController"    
                })
                .
                otherwise({ redirectTo: "/animals" });
        }
    ]
);





