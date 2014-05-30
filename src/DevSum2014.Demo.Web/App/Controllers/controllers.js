// This controller uses HTTP only (AJAX) 
animalApp.controller("MyAnimalsController", ['$scope', '$routeParams', '$http',
    function ($scope, $routeParams, $http) {
        $scope.Id = 0;
        $scope.animal = new Animal();
        $scope.animals = [];
        $scope.species = [];
        var getAnimals = function () {
            return $http.get("/api/animals");
        };
        var getSpecies = function () {
            return $http.get("/api/species");
        };

        function addOrReplaceAnimal(entity) {
            var match = $scope.animals.filter(function (animal) {
                return animal.Id === entity.Id;
            });
            var index = $scope.animals.indexOf(match[0]);
            if (index > -1) {
                $scope.animals[index] = new Animal(entity.Id, entity.Name, new Date(), entity.Species);
            } else {
                $scope.animals.unshift(new Animal(entity.Id, entity.Name, entity.Created, entity.Species));
            }
        }
        getAnimals().success(function (result) {
            result.forEach(function (a) {
                $scope.animals.push(new Animal(a.Id, a.Name, a.Created, a.Species));
            });
        });
        getSpecies().success(function (result) {
            result.forEach(function (s) {
                $scope.species.push(new Species(s.Id, s.Name, s.Created));
            });
        });
        $scope.edit = function (animal) {
            $scope.animal = animal;
        };
        $scope.cancelEdit = function () {
            $scope.animal = new Animal();
        };
        $scope.saveOrUpdate = function () {
            $http.post("/api/animals", $scope.animal).success(function (a) {
                addOrReplaceAnimal((new Animal(a.Id, a.Name, a.Created, a.Species)));
            });
        }
    }
]);
// This controller combines HTTP AJAX and RealtimeCommication using XSockets.NET 
animalApp.controller("AnimalsController", ['$scope', '$routeParams', '$http', 'xsockets', 'visibility',
    function ($scope, $routeParams, $http, xsockets) {
        $scope.Id = 0;
        $scope.animal = new Animal();
        $scope.animals = [];
        $scope.species = [];
        var getAnimals = function () {
            return $http.get("/api/animals");
        };
        var getSpecies = function () {
            return $http.get("/api/species");
        };

        function addOrReplaceAnimal(entity) {
            var match = $scope.animals.filter(function (animal) {
                return animal.Id === entity.Id;
            });
            var index = $scope.animals.indexOf(match[0]);
            if (index > -1) {
                $scope.animals[index] = new Animal(entity.Id, entity.Name, new Date(), entity.Species);
            } else {
                $scope.animals.unshift(new Animal(entity.Id, entity.Name, entity.Created, entity.Species));
            }
        }
        getAnimals().success(function (result) {
            result.forEach(function (a) {
                $scope.animals.push(new Animal(a.Id, a.Name, a.Created, a.Species));
            });
        });
        getSpecies().success(function (result) {
            result.forEach(function (s) {
                $scope.species.push(new Species(s.Id, s.Name, s.Created));
            });
        });
        $scope.toggleMute = function () {
            xsockets.publish("mute");
        };
        $scope.edit = function (animal) {
            $scope.animal = animal;
            xsockets.publish("notifylock", {
                AnimalId: animal.Id,
                Locked: true
            });
        };
        $scope.cancelEdit = function () {
            xsockets.publish("notifylock", {
                AnimalId: $scope.animal.Id,
                Locked: false
            });
            $scope.animal = new Animal();
        };
        $scope.saveOrUpdate = function () {
            $http.post("/api/animals", $scope.animal).success(function (a) {
                addOrReplaceAnimal(new Animal(a.Id, a.Name, a.Created, a.Species));
                xsockets.publish("notifylock", {
                    AnimalId: a.Id,
                    Locked: false
                });
            });
        }
        xsockets.subscribe("notifylock").delegate(function (edit) {
            var match = $scope.animals.filter(function (a) {
                return a.Id === edit.AnimalId;
            });
            match.forEach(function (a) {
                a.setLock(edit.Locked);
            });
        });
        xsockets.subscribe("updatedanimal").delegate(addOrReplaceAnimal);
        $scope.$on('visibilityChanged', function (event, isHidden) {
            xsockets.publish("notifylock", {
                AnimalId: $scope.animal.Id,
                Locked: !isHidden
            });
        });
    }
]);
animalApp.controller("SpeciesController", [
    '$scope', '$http',
    function ($scope, $http) {
        $scope.species = new Species();
        $scope.arrSpecies = [];
        var getSpecies = function () {
            return $http.get("/api/species");
        };
        getSpecies().success(function (result) {
            result.forEach(function (s) {
                $scope.arrSpecies.push(new Species(s.Id, s.Name, s.Created));
            });
        });
        $scope.saveOrUpdate = function () {
            $http.post("/api/species", $scope.species).success(function (s) {
                $scope.arrSpecies.unshift(new Species(s.Id, s.Name, s.Created));
            });
        };
    }
]);