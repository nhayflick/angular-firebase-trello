'use strict';

/**
 * @ngdoc service
 * @name angularTrelloApp.board
 * @description
 * # board
 * Factory in the angularTrelloApp.
 */

app.factory('Board', function ($http, $q) {
  var Board = {};

  Board.$http = $http;
  Board.$q = $q;
  Board.ENDPOINT = '/board';
  Board.FIELDS = [{
      fieldName: 'title',
      required: true
    }, {
      fieldName: 'description',
      required: false
    }];

  Board.insert = function (content) {
    var fieldErrors = this.validate(content);
    if (fieldErrors.length) {
      return this.$q.reject(fieldErrors);
    }
    this.callEndpoint_('post', this.ENDPOINT, content);
  };

  Board.delete = function (id) {
    return this.callEndpoint_('delete', this.ENDPOINT + '/' + id);
  };

  Board.update = function (content) {
    var fieldErrors = this.validate(content);
    if (fieldErrors.length) {
      return this.$q.reject(fieldErrors);
    }
    this.callEndpoint_('put', this.ENDPOINT + '/' + content.id, content);
  };

  Board.validate = function (content) {
    var fieldErrors = [];
    for (var field in this.FIELDS) {
      var fieldName = field.name;
      if (field.required && (content[fieldName] === null || content[fieldName] === '')) {
        fieldErrors.push({fieldName: 'fieldName', error: 'Field can\'t be empty'});
      }
    }
    return fieldErrors;
  };

  Board.callEndpoint_ = function (httpMethod, endpoint, content) {
    var self = this;
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


	return Board;
});