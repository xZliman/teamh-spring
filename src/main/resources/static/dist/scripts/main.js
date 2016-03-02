(function (angular) {

    "use strict";

    angular.module("kandoe", ["ngRoute"]);

})(window.angular);

(function (angular) {

    "use strict";

    angular.module("kandoe").constant("HEADERS", { "Content-Type": "application/json" });

})(window.angular);

(function (angular) {

    "use strict";

    routes.$inject = ["$routeProvider"];
    function routes($routeProvider) {

        $routeProvider

            .when("/", {
                templateUrl: "/dist/views/home.html",
                controller: "HomeController",
                controllerAs: "vm"
            })

            .when("/organisaties", {
                templateUrl: "/dist/views/organisaties/index.html",
                controller: "OrganisatieIndexController",
                controllerAs: "vm"
            })

            .otherwise({
                redirectTo: "/"
            });

    }

    angular.module("kandoe").config(routes);

})(window.angular);

(function (angular) {

    "use strict";

    HoofdthemaService.$inject = ["$http"];
    function HoofdthemaService($http) {

        var exports = {};

        exports.all = function () {

            return $http.get("/api/hoofdthemas").then(function (response) {
                return response.data;
            });

        };

        exports.find = function (id) {

            return $http.get("/api/hoofdthemas/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.create = function (hoofdthema) {

            return $http.post("/api/hoofdthemas", hoofdthema).then(function (response) {
                return response.data;
            });

        };

        exports.update = function (hoofdthema) {

            return $http.put("/api/hoofdthemas/" + hoofdthema.id, hoofdthema).then(function (response) {
                return response.data;
            });

        };

        exports.delete = function (id) {

            return $http.delete("/api/hoofdthemas/" + id).then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("HoofdthemaService", HoofdthemaService);

})(window.angular);

(function (angular) {

    "use strict";

    OrganisatieService.$inject = ["$http"];
    function OrganisatieService($http) {

        var exports = {};

        exports.all = function () {

            return $http.get("/api/organisaties").then(function (response) {
                return response.data;
            });

        };

        exports.find = function (id) {

            return $http.get("/api/organisaties/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.create = function (organisatie) {

            return $http.post("/api/organisaties", organisatie).then(function (response) {
                return response.data;
            });

        };

        exports.update = function (organisatie) {

            return $http.put("/api/organisaties/" + organisatie.id, organisatie).then(function (response) {
                return response.data;
            });

        };

        exports.delete = function (id) {

            return $http.delete("/api/organisaties/" + id).then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("OrganisatieService", OrganisatieService);

})(window.angular);

(function (angular) {

    "use strict";

    function HomeController() {

        var vm = this;

    }

    angular.module("kandoe").controller("HomeController", HomeController);

})(window.angular);

(function (angular) {

    "use strict";

    OrganisatieIndexController.$inject = ["$route", "OrganisatieService"];
    function OrganisatieIndexController($route, OrganisatieService) {

        var vm = this;

        vm.organisaties = [];

        OrganisatieService.all().then(function(data) {
            vm.organisaties = data;
        });

        vm.addOrganisatie = function(organisatie) {
            OrganisatieService.create(organisatie).then(function() {
                $route.reload();
            });
        }

    }

    angular.module("kandoe").controller("OrganisatieIndexController", OrganisatieIndexController);

})(window.angular);