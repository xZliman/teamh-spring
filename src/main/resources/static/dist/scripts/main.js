(function (angular) {

    "use strict";

    angular.module("kandoe", ["ngRoute", "ngStorage"])

        .config(["$httpProvider", "localStorageServiceProvider", function ($httpProvider, localStorageServiceProvider) {

            localStorageServiceProvider.setPrefix("kandoe");
            $httpProvider.interceptors.push("AuthInterceptor");

        }])

        .run(["$location", "$rootScope", "$timeout", "GebruikerService", "JwtService", "localStorageService", function ($location, $rootScope, $timeout, GebruikerService, JwtService, localStorageService) {

            $rootScope.$on('$viewContentLoaded', function () {
                $timeout(function () {
                    componentHandler.upgradeAllRegistered();
                }, 0);
            });

            $rootScope.logout = function () {

                localStorageService.remove("auth");

                $rootScope.id = null;
                $rootScope.naam = null;
                $rootScope.rollen = null;
                $rootScope.loggedIn = false;
                $rootScope.aantalDeelnames = null;
                $rootScope.aantalHoofdthemas = null;
                $rootScope.aantalOrganisaties = null;
                $rootScope.aantalSubthemas = null;

                $location.path("/");

            };

            var data = localStorageService.get("auth");

            if (data) {
                GebruikerService.find(JwtService.decodeToken(data.token).sub).then(function (gebruiker) {

                    $rootScope.id = gebruiker.id;
                    $rootScope.naam = gebruiker.gebruikersnaam;
                    $rootScope.rollen = gebruiker.rollen;
                    $rootScope.loggedIn = true;
                    $rootScope.aantalDeelnames = gebruiker.deelnames.length;
                    $rootScope.aantalHoofdthemas = gebruiker.hoofdthemas.length;
                    $rootScope.aantalOrganisaties = gebruiker.organisaties.length;
                    $rootScope.aantalSubthemas = gebruiker.subthemas.length;


                });

            }

        }]);


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

            .when("/auth/login", {
                templateUrl: "/dist/views/auth/login.html",
                controller: "LoginController",
                controllerAs: "vm"
            })

            .when("/auth/register", {
                templateUrl: "/dist/views/auth/register.html",
                controller: "RegisterController",
                controllerAs: "vm"
            })

            .when("/auth/profile", {
                templateUrl: "/dist/views/auth/profile.html",
                controller: "ProfileController",
                controllerAs: "vm"
            })

            .when("/organisaties", {
                templateUrl: "/dist/views/organisaties/index.html",
                controller: "OrganisatieIndexController",
                controllerAs: "vm"
            })

            .when("/cirkelsessies", {
                templateUrl: "/dist/views/cirkelsessies/index.html",
                controller: "CirkelsessieIndexController",
                controllerAs: "vm"
            })

            .when ("/cirkelsessies/details/:id", {
                templateUrl: "/dist/views/cirkelsessies/details.html",
                controller: "CirkelsessieDetailsController",
                controllerAs: "vm"
            })

            .when ("/deelnames", {
                templateUrl: "/dist/views/deelnames/index.html",
                controller: "DeelnameIndexController",
                controllerAs: "vm"
            })

            .when ("/hoofdthemas", {
                templateUrl: "/dist/views/hoofdthemas/index.html",
                controller: "HoofdthemaIndexController",
                controllerAs: "vm"
            })

            .when ("/subthemas", {
                templateUrl: "/dist/views/subthemas/index.html",
                controller: "SubthemaIndexController",
                controllerAs: "vm"
            })

            .when ("/subthemas/details/:id", {
                templateUrl: "/dist/views/subthemas/details.html",
                controller: "SubthemaDetailsController",
                controllerAs: "vm"
            })

            .when ("/kaarten/details/:id", {
                templateUrl: "/dist/views/kaarten/details.html",
                controller: "KaartDetailsController",
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

    AuthInterceptor.$inject = ["localStorageService"];
    function AuthInterceptor(localStorageService) {

        var exports = {};

        exports.request = function (config) {

            config.headers = config.headers || {};

            if (!config.headers.Authorization) {

                var data = localStorageService.get("auth");

                if (data) {
                    config.headers.Authorization = "Bearer " + data.token;
                }
            }

            return config;

        };

        return exports;

    }

    angular.module("kandoe").factory("AuthInterceptor", AuthInterceptor);

})(window.angular);

(function (angular) {

    "use strict";

    AuthService.$inject = ["$http"];
    function AuthService($http) {

        var exports = {};

        exports.login = function (credentials) {

            return $http.post("/auth/login", credentials).then(function (response) {
                return response.data;
            });

        };

        exports.register = function (credentials) {

            return $http.post("/auth/register", credentials).then(function (response) {
                return response.data;
            });

        };

        return exports;


    }

    angular.module("kandoe").factory("AuthService", AuthService);

})(window.angular);

(function (angular) {

    "use strict";

    BerichtService.$inject = ["$http"];
    function BerichtService($http) {

        var exports = {};

        exports.getGebruiker = function (id) {

            return $http.get("/api/berichten/" + id + "/gebruiker").then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("BerichtService", BerichtService);

})(window.angular);

(function (angular) {

    "use strict";

    CirkelsessieService.$inject = ["$http"];
    function CirkelsessieService($http) {

        var exports = {};

        exports.all = function () {

            return $http.get("/api/cirkelsessies").then(function (response) {
                return response.data;
            });

        };

        exports.find = function (id) {

            return $http.get("/api/cirkelsessies/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.create = function (cirkelsessie) {

            return $http.post("/api/cirkelsessies", cirkelsessie).then(function (response) {
                return response.data;
            });

        };

        exports.update = function (cirkelsessie) {

            return $http.put("/api/cirkelsessies/" + cirkelsessie.id, cirkelsessie).then(function (response) {
                return response.data;
            });

        };

        exports.delete = function (id) {

            return $http.delete("/api/cirkelsessies/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.getSpelkaarten = function (id) {

            return $http.get("/api/cirkelsessies/" + id + "/spelkaarten").then(function (response) {
                return response.data;
            });

        };

        exports.addSpelkaart = function (id) {

            return $http.post("/api/cirkelsessies/" + id + "/spelkaarten").then(function (response) {
                return response.data;
            });

        };

        exports.getDeelnames = function (id) {

            return $http.get("/api/cirkelsessies/" + id + "/deelnames").then(function (response) {
                return response.data;
            });

        };

        exports.addDeelname = function (id) {

            return $http.post("/api/cirkelsessies/" + id + "/deelnames").then(function (response) {
                return response.data;
            });

        };

        exports.getBerichten = function (id) {

            return $http.get("/api/cirkelsessies/" + id + "/berichten").then(function (response) {
                return response.data;
            });

        };

        exports.getGebruiker = function (id) {

            return $http.get("/api/cirkelsessies/" + id + "/gebruiker").then(function (response) {
                return response.data;
            });

        };

        exports.addBericht = function (id, bericht) {

            return $http.post("/api/cirkelsessies/" + id + "/berichten", bericht).then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("CirkelsessieService", CirkelsessieService);

})(window.angular);

(function (angular) {

    "use strict";

    DeelnameService.$inject = ["$http"];
    function DeelnameService($http) {

        var exports = {};

        exports.allOfGebruiker = function (id) {

            return $http.get("/api/gebruikers/" + id + "/deelnames").then(function (response) {
                return response.data;
            });

        };

        exports.update = function (deelname) {

            return $http.put("/api/deelnames/" + deelname.id, deelname).then(function (response) {
                return response.data;
            });

        };

        exports.delete = function (id) {

            return $http.delete("/api/deelnames/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.getGebruiker = function (id) {

            return $http.get("/api/deelnames/" + id + "/gebruiker").then(function (response) {
                return response.data;
            });
        };

        exports.getCirkelsessie = function (id) {

            return $http.get("/api/deelnames/" + id + "/cirkelsessie").then(function (response) {
                return response.data;
            });
        };


        return exports;

    }

    angular.module("kandoe").factory("DeelnameService", DeelnameService);

})(window.angular);

(function (angular) {

    "use strict";

    GebruikerService.$inject = ["$http"];
    function GebruikerService($http) {

        var exports = {};

        exports.all = function () {

            return $http.get("/api/gebruikers").then(function (response) {
                return response.data;
            });

        };

        exports.create = function (gebruiker) {

            return $http.post("/api/gebruikers", gebruiker).then(function (response) {
                return response.data;
            });

        };

        exports.find = function (id) {

            return $http.get("/api/gebruikers/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.update = function (id, gebruiker) {

            return $http.put("/api/gebruikers/" + id, gebruiker).then(function (response) {
                return response.data;
            });

        };

        exports.delete = function (id) {

            return $http.delete("/api/gebruikers/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.deelnames = function (id) {

            return $http.get("/api/gebruikers/" + id + "deelnames").then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("GebruikerService", GebruikerService);

})(window.angular);

(function (angular) {

    "use strict";

    HoofdthemaService.$inject = ["$http"];
    function HoofdthemaService($http) {

        var exports = {};

        exports.getOrganisatie = function (id) {

            return $http.get("/api/hoofdthemas/" + id + "/organisatie").then(function (response) {
                return response.data;
            });

        };

        exports.allOfGebruiker = function (id) {

            return $http.get("/api/gebruikers/" + id + "/hoofdthemas").then(function (response) {
                return response.data;
            });

        };

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

    function JwtService() {

        this.urlBase64Decode = function (str) {

            var output = str.replace(/-/g, '+').replace(/_/g, '/');

            switch (output.length % 4) {
                case 0:
                    break;
                case 2:
                    output += '==';
                    break;
                case 3:
                    output += '=';
                    break;
                default:
                    throw 'Illegal base64url string!';
            }

            return decodeURIComponent(escape(window.atob(output)));
        };

        this.decodeToken = function (token) {

            var parts = token.split('.');

            if (parts.length !== 3) {
                throw new Error('JWT must have 3 parts');
            }

            var decoded = this.urlBase64Decode(parts[1]);

            if (!decoded) {
                throw new Error('Cannot decode the token');
            }

            return JSON.parse(decoded);
        };

        this.getTokenExpirationDate = function (token) {

            var decoded = this.decodeToken(token);
            var d = new Date(0);

            if (typeof decoded.exp === "undefined") {
                return null;
            }

            d.setUTCSeconds(decoded.exp);

            return d;
        };

        this.isTokenExpired = function (token, offsetSeconds) {

            var d = this.getTokenExpirationDate(token);
            offsetSeconds = offsetSeconds || 0;

            if (d === null) {
                return false;
            }

            return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
        };

    }

    angular.module("kandoe").service("JwtService", JwtService);

}(window.angular));

(function (angular) {

    "use strict";

    KaartService.$inject = ["$http"];
    function KaartService($http) {

        var exports = {};

        exports.find = function (kaartId) {

            return $http.get("/api/kaarten/" + kaartId).then(function (response) {
                return response.data;
            });

        };

        exports.createKaart = function (cirkelsessieId, kaart) {

            return $http.post("/api/cirkelsessies/" + cirkelsessieId + "/spelkaarten", kaart).then(function (response) {
                return response.data;
            });

        };

        exports.createKaartForSubthema = function (subthemaId, kaart) {

            return $http.post("/api/subthemas/" + subthemaId + "/kaart", kaart).then(function (response) {
                return response.data;
            });

        };

        exports.verschuifKaart = function (spelkaartId) {

            return $http.post("/api/spelkaarten/" + spelkaartId + "/verschuif").then(function (response) {
                return response.data;
            });

        };

        exports.getKaarten = function (subthemaId) {

            return $http.get("/api/subthemas/" + subthemaId + "/kaarten").then(function (response) {
                return response.data;
            });

        };

        exports.getComments = function (kaartId) {

            return $http.get("/api/kaarten/" + kaartId + "/comments").then(function (response) {
                return response.data;
            });

        };

        exports.getGebruiker = function (id) {

            return $http.get("/api/kaarten/" + id + "/gebruiker").then(function (response) {
                return response.data;
            });

        };

        exports.createComment = function (kaartId, comment) {

            return $http.post("/api/kaarten/" + kaartId + "/comments", comment).then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("KaartService", KaartService);

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

        exports.allOfGebruiker = function (id) {

            return $http.get("/api/gebruikers/" + id + "/organisaties").then(function (response) {
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

    SpelkaartService.$inject = ["$http"];
    function SpelkaartService($http) {

        var exports = {};

        exports.getKaart = function (id) {

            return $http.get("/api/spelkaarten/" + id + "/kaart").then(function (response) {
                return response.data;
            });

        };

        return exports;

    }

    angular.module("kandoe").factory("SpelkaartService", SpelkaartService);

})(window.angular);

(function (angular) {

    "use strict";

    SubthemaService.$inject = ["$http"];
    function SubthemaService($http) {

        var exports = {};


        exports.getHoofdthema = function (id) {

            return $http.get("/api/subthemas/" + id + "/hoofdthema").then(function (response) {
                return response.data;
            });

        };


        exports.getOrganisatie = function (id) {

            return $http.get("/api/subthemas/" + id + "/organisatie").then(function (response) {
                return response.data;
            });

        };

        exports.allOfGebruiker = function (id) {

            return $http.get("/api/gebruikers/" + id + "/subthemas").then(function (response) {
                return response.data;
            });

        };

        exports.all = function () {

            return $http.get("/api/subthemas").then(function (response) {
                return response.data;
            });

        };

        exports.find = function (id) {

            return $http.get("/api/subthemas/" + id).then(function (response) {
                return response.data;
            });

        };

        exports.create = function (subthema) {

            return $http.post("/api/subthemas", subthema).then(function (response) {
                return response.data;
            });
        };

        exports.update = function (subthema) {

            return $http.put("/api/subthemas/" + subthema.id, subthema).then(function (response) {
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

    angular.module("kandoe").factory("SubthemaService", SubthemaService);

})(window.angular);

(function (angular) {

    "use strict";

    LoginController.$inject = ["$location", "$rootScope", "AuthService", "GebruikerService", "JwtService", "localStorageService"];
    function LoginController($location, $rootScope, AuthService, GebruikerService, JwtService, localStorageService) {

        var vm = this;

        vm.login = function (credentials) {

            AuthService.login(credentials).then(function (data) {

                localStorageService.set("auth", {
                    token: data.token
                });

                GebruikerService.find(JwtService.decodeToken(data.token).sub).then(function (gebruiker) {

                    $rootScope.id = gebruiker.id;
                    $rootScope.naam = gebruiker.gebruikersnaam;
                    $rootScope.rollen = gebruiker.rollen;
                    $rootScope.loggedIn = true;

                    $location.path("/");

                });

            });

        };

    }

    angular.module("kandoe").controller("LoginController", LoginController);

})(window.angular);

(function (angular) {

    "use strict";

    ProfileController.$inject = ["$location", "$rootScope", "GebruikerService"];
    function ProfileController($location, $rootScope, GebruikerService) {

        var vm = this;

        vm.updateProfile = function (credentials) {

            if (credentials.wachtwoord == null) {
                credentials.wachtwoord = "";
            }

            GebruikerService.update($rootScope.id, credentials).then(function () {

                GebruikerService.find($rootScope.id).then(function (data) {

                    $rootScope.id = data.id;
                    $rootScope.naam = data.gebruikersnaam;
                    $rootScope.rollen = data.rollen;

                    $location.path("/");

                });

            });

        };


    }

    angular.module("kandoe").controller("ProfileController", ProfileController);

})(window.angular);

(function (angular) {

    "use strict";

    RegisterController.$inject = ["$location", "AuthService"];
    function RegisterController($location, AuthService) {

        var vm = this;

        vm.register = function (credentials) {

            AuthService.register(credentials).then(function () {

                $location.path("/auth/login");

            });

        };

    }

    angular.module("kandoe").controller("RegisterController", RegisterController);

})(window.angular);

(function (angular) {

    "use strict";

    DeelnameIndexController.$inject = ["$rootScope", "DeelnameService"];
    function DeelnameIndexController($rootScope, DeelnameService) {

        var vm = this;

        vm.deelnames = [];
        vm.cirkelsessies = [];

        DeelnameService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.deelnames = data;
            angular.forEach(vm.deelnames, function (value, key) {
                DeelnameService.getCirkelsessie(value.id).then(function (cirkelsessiedata) {
                    vm.cirkelsessies.push(cirkelsessiedata);
                });
            });
        });

    }

    angular.module("kandoe").controller("DeelnameIndexController", DeelnameIndexController);

})(window.angular);

(function (angular) {

    "use strict";

    CirkelsessieDetailsController.$inject = ["$route", "$rootScope", "$routeParams", "CirkelsessieService", "KaartService", "DeelnameService", "SpelkaartService", "BerichtService"];
    function CirkelsessieDetailsController($route, $rootScope, $routeParams, CirkelsessieService, KaartService, DeelnameService, SpelkaartService, BerichtService) {

        var vm = this;

        vm.cirkelsessie = {};
        vm.gebruikers = [];
        vm.kaarten = [];
        vm.chatgebruikers = [];
        vm.gebruiker = {};

        CirkelsessieService.find($routeParams.id).then(function (data) {
            vm.cirkelsessie = data;
            CirkelsessieService.getGebruiker(vm.cirkelsessie.id).then(function (organisatordata) {
                vm.gebruiker = organisatordata;
            });

            angular.forEach(vm.cirkelsessie.deelnames, function (value, key) {
                DeelnameService.getGebruiker(value.id).then(function (gebruikerdata) {
                    vm.gebruikers.push(gebruikerdata);
                });
            });

            angular.forEach(vm.cirkelsessie.spelkaarten, function (value, key) {
                SpelkaartService.getKaart(value.id).then(function (kaartdata) {
                    vm.kaarten.push(kaartdata);
                });
            });

            angular.forEach(vm.cirkelsessie.berichten, function (value, key) {
                BerichtService.getGebruiker(value.id).then(function (chatgebruikerdata) {
                    vm.chatgebruikers.push(chatgebruikerdata);
                });
            });
        });

        vm.isActive = function (date) {
            return new Date() > new Date(date);
        };

        vm.isDeelnemer = function () {
            for (var i = 0; i < vm.gebruikers.length; i++) {
                if ($rootScope.id == vm.gebruikers[i].id) {
                    return true;
                }
            }

            return false;
        };

        vm.addBericht = function (id, bericht) {
            bericht.gebruiker = $rootScope.id;
            CirkelsessieService.addBericht(id, bericht).then(function () {
                $route.reload();
            });
        };

        vm.addDeelname = function (id) {
            CirkelsessieService.addDeelname(id).then(function () {
                $route.reload();
            });
        };

        vm.createKaart = function (cirkelsessieId, kaart) {
            kaart.gebruiker = $rootScope.id;
            KaartService.createKaart(cirkelsessieId, kaart).then(function () {
                $route.reload();
            });
        };

        vm.verschuifKaart = function (spelkaartId) {
            KaartService.verschuifKaart(spelkaartId).then(function () {
                $route.reload();
            });
        };

        vm.getTimes = function (n) {

            var numbers = [];

            for (var i = n; i > 0; i--) {
                numbers.push(i);
            }

            return numbers;
        };

        vm.setCircleColor = function (number) {

            if (number % 2 == 0) {
                return "#4985b9"
            }

            return "#ffffff"
        };

        vm.showTooltip = function (event, mouseovertext) {
            var tooltip = document.getElementById('tooltip');
            tooltip.setAttribute("x", event.clientX - 50);
            tooltip.setAttribute("y", event.clientY - 50);
            tooltip.firstChild.data = mouseovertext;
            tooltip.setAttribute("visibility", "visible");
        };

        vm.hideTooltip = function () {
            document.getElementById('tooltip').setAttribute("visibility", "hidden");
        };

    }

    angular.module("kandoe").controller("CirkelsessieDetailsController", CirkelsessieDetailsController);

})(window.angular);

(function (angular) {

    "use strict";

    CirkelsessieIndexController.$inject = ["$rootScope", "$route", "CirkelsessieService", "SubthemaService"];
    function CirkelsessieIndexController($rootScope, $route, CirkelsessieService, SubthemaService) {

        var vm = this;

        vm.nowDate = new Date();
        vm.cirkelsessies = [];
        vm.subthemas = [];
        vm.subthema = {};
        vm.gebruikers = [];

        SubthemaService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.subthemas = data;
        });

        CirkelsessieService.all().then(function (data) {
            vm.cirkelsessies = data;

            angular.forEach(vm.cirkelsessies, function (value, key) {
                CirkelsessieService.getGebruiker(value.id).then(function (gebruikerdata) {
                    vm.gebruikers.push(gebruikerdata);
                });
            });
        });

        vm.isActive = function (date) {
            return new Date() > new Date(date);
        };

        vm.getSubthema = function (subthemaId) {

            SubthemaService.find(subthemaId).then(function (data) {
                vm.subthema = data;
            });

        };

        vm.addCirkelsessie = function (cirkelsessie) {
            cirkelsessie.gebruiker = $rootScope.id;
            CirkelsessieService.create(cirkelsessie).then(function () {
                $route.reload();
            });
        };

    }

    angular.module("kandoe").controller("CirkelsessieIndexController", CirkelsessieIndexController);

})(window.angular);

(function (angular) {

    "use strict";

    OrganisatieIndexController.$inject = ["$route", "$rootScope", "OrganisatieService"];
    function OrganisatieIndexController($route, $rootScope, OrganisatieService) {

        var vm = this;

        vm.organisaties = [];

        OrganisatieService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.organisaties = data;
        });

        vm.addOrganisatie = function (organisatie) {
            organisatie.gebruiker = $rootScope.id;
            OrganisatieService.create(organisatie).then(function () {
                $route.reload();
            });
        }

    }

    angular.module("kandoe").controller("OrganisatieIndexController", OrganisatieIndexController);

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

    HoofdthemaIndexController.$inject = ["$rootScope", "$route", "HoofdthemaService", "OrganisatieService"];
    function HoofdthemaIndexController($rootScope, $route, HoofdthemaService, OrganisatieService) {

        var vm = this;

        vm.hoofdthemas = [];

        vm.organisaties = [];

        vm.gekoppeldeOrganisaties = [];

        HoofdthemaService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.hoofdthemas = data;
            angular.forEach(vm.hoofdthemas, function (value, key) {
                HoofdthemaService.getOrganisatie(value.id).then(function (organisatiedata) {
                    vm.gekoppeldeOrganisaties.push(organisatiedata);
                });
            });
        });


        OrganisatieService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.organisaties = data;
        });

        vm.addHoofdthema = function (hoofdthema) {
            hoofdthema.gebruiker = $rootScope.id;
            HoofdthemaService.create(hoofdthema).then(function () {
                $route.reload();
            });
        }

    }

    angular.module("kandoe").controller("HoofdthemaIndexController", HoofdthemaIndexController);

})(window.angular);

(function (angular) {

    "use strict";


    KaartDetailsController.$inject = ["$route", "$routeParams", "KaartService", "$rootScope"];
    function KaartDetailsController($route, $routeParams, KaartService, $rootScope) {

        var vm = this;

        vm.kaart = {};
        vm.comments = [];
        vm.gebruiker = {};

        KaartService.find($routeParams.id).then(function (data) {
            vm.kaart = data;

            KaartService.getComments($routeParams.id).then(function (commentsdata) {
                vm.comments = commentsdata;
            });

            KaartService.getGebruiker(vm.kaart.id).then(function (gebruikerdata) {
                vm.gebruiker = gebruikerdata;
            });
        });


        vm.createComment = function (kaartId, comment) {
            comment.gebruiker = $rootScope.id;
            KaartService.createComment(kaartId, comment).then(function () {
                $route.reload;
            });
        };


        //vm.createComment = function (kaartId, kaart) {
        //    KaartService.createKaartComment(kaartId, kaart).then(function () {
        //        $route.reload();
        //    });
        //};
    }


    angular.module("kandoe").controller("KaartDetailsController", KaartDetailsController);

})(window.angular);

(function (angular) {

    "use strict";


    SubthemaDetailsController.$inject = ["$route", "$rootScope", "$routeParams", "SubthemaService", "HoofdthemaService", "OrganisatieService", "KaartService"];
    function SubthemaDetailsController($route, $rootScope, $routeParams, SubthemaService, HoofdthemaService, OrganisatieService, KaartService) {

        var vm = this;

        vm.subthema = {};
        vm.hoofdthema = {};
        vm.organisatie = {};

        SubthemaService.find($routeParams.id).then(function (data) {
            vm.subthema = data;
            SubthemaService.getHoofdthema(vm.subthema.id).then(function (subthemadata) {
                vm.hoofdthema = subthemadata;
            });
            SubthemaService.getOrganisatie(vm.subthema.id).then(function (organisatiedata) {
                vm.organisatie = organisatiedata;
            });
        });

        vm.createKaart = function (subthemaId, kaart) {
            kaart.gebruiker = $rootScope.id;
            KaartService.createKaartForSubthema(subthemaId, kaart).then(function () {
                $route.reload();
            });
        };

    }


    angular.module("kandoe").controller("SubthemaDetailsController", SubthemaDetailsController);

})(window.angular);

(function (angular) {

    "use strict";

    SubthemaIndexController.$inject = ["$route", "$rootScope", "HoofdthemaService", "SubthemaService", "OrganisatieService"];
    function SubthemaIndexController($route, $rootScope, HoofdthemaService, SubthemaService, OrganisatieService) {

        var vm = this;

        vm.subthemas = [];

        vm.hoofdthemas = [];

        vm.gekoppeldeHoofdthemas = [];

        vm.gekoppeldeOrganisaties = [];


        SubthemaService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.subthemas = data;
            angular.forEach(vm.subthemas, function (value, key) {
                SubthemaService.getHoofdthema(value.id).then(function (hoofdthemadata) {
                    vm.gekoppeldeHoofdthemas.push(hoofdthemadata);
                });
                SubthemaService.getOrganisatie(value.id).then(function (organisatiedata) {
                    vm.gekoppeldeOrganisaties.push(organisatiedata);
                });
            });
        });

        HoofdthemaService.allOfGebruiker($rootScope.id).then(function (data) {
            vm.hoofdthemas = data;
        });


        vm.addSubthema = function (subthema) {
            subthema.gebruiker = $rootScope.id;
            SubthemaService.create(subthema).then(function () {
                $route.reload();
            });
        }
    }

    angular.module("kandoe").controller("SubthemaIndexController", SubthemaIndexController);

})(window.angular);
