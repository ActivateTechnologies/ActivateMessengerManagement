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
var FilterTimerPipe = (function () {
    function FilterTimerPipe() {
    }
    FilterTimerPipe.prototype.transform = function (arr, filters) {
        return arr.filter(function (eachItem) {
            var it = new moment(eachItem.interactionTime);
            var rt = new moment(eachItem.receivedTime);
            var now = new moment();
            var endOfWindow = new moment(eachItem.interactionTime);
            endOfWindow.add(24, 'hours');
            if (endOfWindow.isAfter(now)) {
                return filters[0];
            }
            else if (rt.isBefore(it) || eachItem.receivedTime == null) {
                return filters[1];
            }
            else {
                return filters[2];
            }
        });
    };
    FilterTimerPipe = __decorate([
        core_1.Pipe({
            name: 'filtertimer',
            pure: false
        }), 
        __metadata('design:paramtypes', [])
    ], FilterTimerPipe);
    return FilterTimerPipe;
}());
exports.FilterTimerPipe = FilterTimerPipe;
//# sourceMappingURL=filter-timer.pipe.js.map