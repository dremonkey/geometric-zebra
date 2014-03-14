'use strict';

angular.module('stripe.services.rest', ['ngResource'])
  
  .factory('$stripe', function ($resource) {

    return {
      charges: function () {
        var Charge, methods;

        methods = {
          list: {method: 'GET'}, // no id
          create: {method: 'POST'}, // no id
          retrieve: {method: 'GET'}, // need id
          update: {method: 'POST'}, // need id

          // need id and action
          refund: {
            method: 'POST',
            params:{action:'refund'}
          },

          // need id and action
          capture: {
            method: 'POST',
            params:{action:'capture'}
          }
        };

        Charge = $resource('/api/stripe/charges/:id/:action', {id:'@id', action: '@action'}, methods);
        return Charge;
      },

      customers: function () {
        var Customer, methods;

        methods = {
          list: {method: 'GET'}, // no id
          create: {method: 'POST'}, // no id
          retrieve: {method: 'GET'}, // needs id
          update: {method: 'POST'}, // needs id
          delete: {methode: 'DELETE'} // needs id
        };

        Customer = $resource('/api/stripe/customers/:id', {id:'@id'}, methods);
        return Customer;
      }
    };
  });