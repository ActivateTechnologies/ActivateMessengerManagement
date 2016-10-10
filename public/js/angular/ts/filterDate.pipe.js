"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var FilterDatePipe = (function () {
    function FilterDatePipe() {
    }
    FilterDatePipe.prototype.transform = function (arr, date) {
        if (date === '') {
            return arr;
        }
        var dates = date.split(" - ");
        console.log("ALRIGHT LADS!!");
        return arr.filter(function (eachItem) {
            var start = moment(dates[0], "DD/MM/YYYY");
            var end = moment(dates[1], "DD/MM/YYYY");
            var userDate = moment(eachItem.signedUpDate).startOf('day');
            if ((userDate.isAfter(start) || userDate.isSame(start)) && (userDate.isBefore(end) || userDate.isSame(end))) {
                return true;
            }
            else {
                return false;
            }
        });
    };
    FilterDatePipe = __decorate([
        core_1.Pipe({
            name: 'filterdate',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], FilterDatePipe);
    return FilterDatePipe;
}());
exports.FilterDatePipe = FilterDatePipe;
//# sourceMappingURL=filterDate.pipe.js.map