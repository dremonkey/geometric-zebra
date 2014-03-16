'use strict';

/**
 * Stripe Checkout Config Controller
 */

angular.module('stripe.controllers.config', [])
  .controller('StripeConfigCtrl', function ($scope) {
    var config;

    config = {
      // General Config
      name: 'Acme Industries',
      description: 'Personal Rocketpack - $100.00',
      amount: 10000, // amount in cents

      // User Config
      email: 'wile.e.coyote@acme.com',
      
      // Form Config
      panelLabel: 'Pay',
      currency: 'USD',
      type: 'charge',
      action: 'create',

      // Required Parameters
      chID: '', // charge ID
      plan: '', // subscription plan identifier
    };
    
    $scope.config = config;
  });