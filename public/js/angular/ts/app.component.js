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
var user_service_1 = require('./user.service');
var AppComponent = (function () {
    function AppComponent(userService, elementRef) {
        this.userService = userService;
        this.elementRef = elementRef;
        this.users = [];
        this.displayedCols = [];
        this.companyCode = elementRef.nativeElement.getAttribute('[companycode]');
    }
    AppComponent.prototype.ngOnInit = function () {
        this.currentHead = -1;
        this.orderField = '';
        this.getUsers();
        this.populateDisplayedCols();
    };
    AppComponent.prototype.getUsers = function () {
        var _this = this;
        this.userService.getUsers(this.companyCode)
            .subscribe(function (users) { return _this.users = users; });
    };
    AppComponent.prototype.headingClicked = function (head) {
        if (this.currentHead === head) {
            this.isReversed = !this.isReversed;
        }
        else {
            this.isReversed = false;
        }
        this.currentHead = head;
        switch (head) {
            case 0:
                this.orderField = 'firstName';
                break;
            case 1:
                this.orderField = 'gender';
                break;
            case 2:
                this.orderField = 'phoneNumber';
                break;
            case 3:
                this.orderField = 'email';
                break;
            case 4:
                this.orderField = 'preferredPosition';
                break;
            case 5:
                this.orderField = 'backupPosition';
                break;
            case 6:
                this.orderField = 'level';
                break;
            case 7:
                this.orderField = 'type';
                break;
            case 8:
                this.orderField = 'signedUpDate';
                break;
            case 9:
                this.orderField = 'interactionTime';
                break;
            case 10:
                this.orderField = '_id';
                break;
        }
    };
    AppComponent.prototype.populateDisplayedCols = function () {
        console.log("In Populate Displayed Cols");
        for (var _i = 0; _i < 10; _i++) {
            this.displayedCols[_i] = false;
        }
        console.log(this.users.length);
        for (var _a = 0, _b = this.users; _a < _b.length; _a++) {
            var user = _b[_a];
            //console.log(user.firstName);
            if (user.phoneNumber != null) {
                this.displayedCols[2] = true;
            }
            if (user.email != null) {
                this.displayedCols[3] = true;
            }
            if (user.preferredPosition != null) {
                this.displayedCols[4];
            }
            if (user.backupPosition != null) {
                this.displayedCols[5];
            }
            if (user.level != null) {
                this.displayedCols[6];
            }
            if (user.type != null) {
                this.displayedCols[7];
            }
        }
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-table',
            templateUrl: 'js/angular/ts/app.component.html'
        }), 
        __metadata('design:paramtypes', [user_service_1.UserService, core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map