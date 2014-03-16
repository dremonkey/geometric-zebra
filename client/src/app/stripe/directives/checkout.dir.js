'use strict';

/**
 * Directive to generate a stripe checkout form
 */
angular.module('stripe.directives.checkout', ['stripe.services.rest'])

  .directive('stripeCheckoutButton', function ($window, utils) {
    var def;
    
    def = {
      controller: function ($scope, $stripe, $q, _) {
        var checkout, deferred, req, submit;

        deferred = $q.defer();

        checkout = $window.StripeCheckout.configure({
          key: 'pk_test_StvANvmxQSl7eb88LnRjg5Kd', // replace with live key in production
          token: function (token, args) {
            deferred.resolve(token, args);
          }
        });

        submit = function (config) {
          var defaults, merged, params, action;

          params = _.clone(config); //  clone config so we don't modify the model
          action = params.action;

          // For details on what each of these parameters do
          // see https://stripe.com/docs/checkout#integration-custom > Configuration Options
          defaults = {
            name: 'Company Name',
            image: null,
            description: '',
            amount: 0, // amount in cents
            currency: 'USD', // three letter ISO code
            panelLabel: 'Pay',
            billingAddress: false,
            shippingAddress: false,
            email: '',
            opened: null,
            closed: null
          };

          // If creating a new charge, we will need to get a token
          if ('create' === action) {

            merged = utils.params(params, defaults);
            checkout.open(merged); // trigger the checkout form and get the token

            // deferred will be resolved by the callback in the 'checkout' handler
            deferred.promise.then(function (token, args) {
              req(params, token, args); // Send request to our server
            });
          }
          else {
            req(params); // Send request to our server
          }
        };

        // Function responsible for sending the stripe action (i.e. create charge, create subscription, etc) 
        // that we want to perform to our server
        req = function (params, token, args) {
          
          /* jshint unused:false */

          var action = params.action;
          
          if (token) {
            params.card = token.id;
            params.email = token.email;
          }

          switch (params.type) {

            // create a new subscription
            case 'subscribe':
              
              params.cid = params.cusID || undefined; // customer ID
              params.sid = params.subID || undefined; // subscription ID

              // This is subscribing a new customer to an existing subscription plan
              if ('create' === action) {
                $stripe.customers().create(params).$promise.then(
                  function (res) {
                    console.log(res);
                  },
                  function (err) {
                    console.log(err);
                  }
                );
              }

              break;

            // send charge request to the server
            default:

              params.id = params.chID || undefined; // charge ID
              
              // passing the action param when it is not needed causes a bug so 
              // we are deleting it for the requests that don't need it.
              if (['list', 'create', 'retrieve', 'update'].indexOf(action) !== -1) {
                delete params.action;
              }

              $stripe.charges()[action](params).$promise.then(
                // success
                function (res) {
                  console.log(res);
                },
                // error
                function (err) {
                  console.log(err);
                });
              break;
          }
        };

        // Public Methods / Variables
        this.submit = submit;
      },
      link: function (scope, element, attrs, ctrl) {

        // Scope Assignment
        scope.submit = ctrl.submit;
      }
    };

    return def;
  });