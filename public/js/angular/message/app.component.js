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
var group_service_1 = require('./group.service');
var AppComponent = (function () {
    function AppComponent(groupService, elementRef) {
        this.groupService = groupService;
        this.elementRef = elementRef;
        this.companyCode = elementRef.nativeElement.getAttribute('[companyCode]');
    }
    AppComponent.prototype.ngOnInit = function () {
        this.getGroups();
    };
    AppComponent.prototype.getGroups = function () {
        var _this = this;
        this.groupService.getGroups(this.companyCode)
            .subscribe(function (groups) { return _this.groups = groups; });
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'my-groups',
            templateUrl: 'js/angular/message/app.component.html'
        }), 
        __metadata('design:paramtypes', [group_service_1.GroupService, core_1.ElementRef])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map