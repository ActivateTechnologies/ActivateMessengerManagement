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
var OrderByPipe = (function () {
    function OrderByPipe() {
    }
    OrderByPipe.prototype.transform = function (array, key, desc) {
        array.sort(function (a, b) {
            if (a[key] < b[key]) {
                return -1;
            }
            else if (a[key] > b[key]) {
                return 1;
            }
            else {
                if (key === 'firstName') {
                    if (a['lastName'] < b['lastName']) {
                        return -1;
                    }
                    else if (a['lastName'] > b['lastName']) {
                        return 1;
                    }
                }
                return 0;
            }
        });
        if (desc) {
            return array.reverse();
        }
        return array;
    };
    OrderByPipe = __decorate([
        core_1.Pipe({ name: 'orderBy' }), 
        __metadata('design:paramtypes', [])
    ], OrderByPipe);
    return OrderByPipe;
}());
exports.OrderByPipe = OrderByPipe;
//# sourceMappingURL=order-by.pipe.js.map