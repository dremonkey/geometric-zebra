'use strict';

angular.module('stripe.services.rest', ['ngResource'])
  
  .factory('$stripe', function ($resource) {

    return {
      charges: function () {
        var Charge, actions;

        actions = {
          list: {method: 'GET'}, // no id
          create: {method: 'POST'}, // no id
          retrieve: {method: 'GET'}, // need id
          update: {method: 'POST'}, // need id

          // need id and method
          refund: {
            method: 'POST',
            params:{action:'refund'}
          },

          // need id and method
          capture: {
            method: 'POST',
            params:{action:'capture'}
          }
        };

        Charge = $resource('/api/stripe/charges/:id/:action', {id:'@id', action: '@action'}, actions);
        return Charge;
      },

      customers: function () {
        var Customer, actions;

        actions = {
          list: {method: 'GET'}, // no id
          create: {method: 'POST'}, // no id
          retrieve: {method: 'GET'}, // needs id
          update: {method: 'POST'}, // needs id
          delete: {methode: 'DELETE'} // needs id
        };

        Customer = $resource('/api/stripe/customers/:id', {id:'@id'}, actions);
        return Customer;
      },

      subscriptions: function () {
        var Sub, actions;

        actions = {
          list: {method: 'GET'}, // needs cid
          create: {method: 'POST'}, // needs cid
          retrieve: {method: 'GET'}, // needs cid and sid
          update: {method: 'POST'}, // needs cid and sid
          cancel: {methode: 'DELETE'} // needs cid and sid
        };

        Sub = $resource('/api/stripe/customers/:cid/subscriptions/:sid', {cid:'@cid', sid:'@sid'}, actions);
        return Sub;
      }
    };
  });