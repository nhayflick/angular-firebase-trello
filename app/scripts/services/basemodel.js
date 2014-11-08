'use strict';

/**
 * @ngdoc service
 * @name angularTrelloApp.BaseModel
 * @description
 * # BaseModel
 * Factory in the angularTrelloApp.
 */

var BaseModel = function ($http, $q) {
  this.$http = $http;
  this.$q = $q;

  this.FIELDS = [];

  // this.loading = false;
  // this.requestsPending = 0;
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

BaseModel.prototype.validate = function (content) {
  var fieldErrors = [];
  for (var field in this.FIELDS) {
    var fieldName = field.name;
    if (field.required && (content[fieldName] === null || content[fieldName] === '')) {
      fieldErrors.push({fieldName: 'fieldName', error: 'Field can\'t be empty'});
    }
  }
  return fieldErrors;
};

BaseModel.prototype.callEndpoint_ = function (httpMethod, endpoint, content) {
  var self = this;
  console.log(this);
  return this.$http({
    method: httpMethod,
    url: endpoint,
    data: content
  }).then(function (response) {
    // success handler
    return response.data;
  }, function (response) {
    // error handler
    return self.$q.reject(response);
  });
};

// app.factory('BaseModel', function ($http, $q) {
//     // Public API here
//     return BaseModel;
//   });
