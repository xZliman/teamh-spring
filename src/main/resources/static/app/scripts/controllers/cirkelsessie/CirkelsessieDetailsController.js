﻿(function (angular) {

    "use strict";

    function CirkelsessieDetailsController($route, $rootScope, $routeParams, CirkelsessieService, KaartService, DeelnameService, SpelkaartService, BerichtService) {

        var vm = this;

        vm.cirkelsessie = {};
        vm.gebruikers = [];
        vm.deelnames = [];
        vm.berichten = [];
        vm.spelkaarten = [];
        vm.commentaren = [];

        CirkelsessieService.find($routeParams.id).then(function (data) {
            vm.cirkelsessie = data;
            CirkelsessieService.getDeelnames(vm.cirkelsessie.id).then(function (deelnamedata) {
                vm.deelnames = deelnamedata;
                angular.forEach(vm.deelnames, function (value, key) {
                    DeelnameService.getGebruiker(value.id).then(function (gebruikerdata) {
                        vm.gebruikers.push(gebruikerdata);
                    });
                });
            });
            CirkelsessieService.getSpelkaarten(vm.cirkelsessie.id).then(function (spelkaartendata) {
                vm.spelkaarten = spelkaartendata;
                angular.forEach(vm.spelkaarten, function (value, key) {
                    KaartService.getComments(value.kaart.id).then(function (commentaardata) {
                        vm.commentaren.push(commentaardata);
                    });
                });
            });
            CirkelsessieService.getBerichten(vm.cirkelsessie.id).then(function (berichtendata) {
                vm.berichten = berichtendata;
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
