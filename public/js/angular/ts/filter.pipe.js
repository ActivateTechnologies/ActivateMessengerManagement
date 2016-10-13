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
var FilterPipe = (function () {
    function FilterPipe() {
    }
    FilterPipe.prototype.transform = function (arr, fields, filters) {
        if (filters[0] === '' && filters[1] === '' && filters[2] === '' && filters[3] === '' && filters[4] === '') {
            return arr;
        }
        return arr.filter(function (eachItem) {
            var returnUser = true;
            for (var i = 0; i < filters.length; i++) {
                if (filters[i] !== '') {
                    if (eachItem[fields[i]]) {
                        returnUser = returnUser && (eachItem[fields[i]].toLowerCase() === filters[i].toLowerCase());
                    }
                    else {
                        return false;
                    }
                }
            }
            return returnUser;
        });
    };
    FilterPipe = __decorate([
        core_1.Pipe({
            name: 'filter',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], FilterPipe);
    return FilterPipe;
}());
exports.FilterPipe = FilterPipe;
//# sourceMappingURL=filter.pipe.js.map