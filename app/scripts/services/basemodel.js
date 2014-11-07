'use strict';

/**
 * @ngdoc service
 * @name angularFirebaseTrelloApp.BaseModel
 * @description
 * # BaseModel
 * Factory in the angularFirebaseTrelloApp.
 */

var BaseModel = function ($http, $q) {
  this.$http = $http;
  this.$q = $q;

  this.FIELDS = [];

  this.loading = false;
  this.requestsPending = 0;
};

BaseModel.prototype.insert = function (content) {
  var fieldErrors = this.validate(content);
  if (fieldErrors.length) {
    return this.$q.reject(fieldErrors);
  }
  this.callEndpoint_('post', this.ENDPOINT, content);
};

BaseModel.prototype.delete = function (id) {
  return this.callEndpoint_('delete', this.ENDPOINT + '/' + id);
};

BaseModel.prototype.update = function (content) {
  var fieldErrors = this.validate(content);
  if (fieldErrors.length) {
    return this.$q.reject(fieldErrors);
  }
  this.callEndpoint_('put', this.ENDPOINT + '/' + content.id, content);
};

angular.module('angularFirebaseTrelloApp')
  .factory('BaseModel', function () {
    // Service logic
    // ...

    var meaningOfLife = 42;

    // Public API here
    return {
      someMethod: function () {
        return meaningOfLife;
      }
    };
  });
