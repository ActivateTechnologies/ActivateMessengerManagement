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
var MessageComponent = (function () {
    function MessageComponent() {
        this.messageText = '';
        this.ids = '';
        this.subtitle = '';
        this.events = [];
    }
    MessageComponent.prototype.ngOnInit = function () {
        var that = this;
        $.get('/currentEvents.' + this.companyCode, function (data) {
            that.events = data;
            console.log(that.events);
        });
    };
    MessageComponent.prototype.onChange = function (i) {
        if (i == 0) {
            this.ids = '';
        }
        else {
            var id = this.groups[i - 1]._id;
            this.ids = id;
        }
    };
    MessageComponent.prototype.onChangeEvent = function (i) {
        if (i == 0) {
            this.eid = '';
        }
        else {
            var id = this.events[i - 1]._id;
            this.eid = id;
        }
    };
    MessageComponent.prototype.onSubmit = function (type) {
        console.log(this.ids);
        $.post('/message.' + this.companyCode + '?message=' + this.messageText + '&ids=' + this.ids + '&formType=' + type + '&subtitle' + this.subtitle + '&eid=' + this.eid, function (data) {
        });
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], MessageComponent.prototype, "groups", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MessageComponent.prototype, "companyCode", void 0);
    MessageComponent = __decorate([
        core_1.Component({
            selector: 'my-message',
            templateUrl: 'js/angular/message/message.component.html'
        }), 
        __metadata('design:paramtypes', [])
    ], MessageComponent);
    return MessageComponent;
}());
exports.MessageComponent = MessageComponent;
//# sourceMappingURL=message.component.js.map