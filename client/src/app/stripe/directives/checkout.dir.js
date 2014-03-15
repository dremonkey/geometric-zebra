'use strict';

/**
 * Directive to generate a stripe checkout form
 */
angular.module('stripe.directives.checkout', ['stripe.services.rest'])

  .directive('stripeCheckoutButton', function ($window, utils) {
    var def;
    
    def = {
      controller: function ($scope, $stripe, $q) {
        var checkout, deferred, submit;

        deferred = $q.defer();

        checkout = $window.StripeCheckout.configure({
          key: 'pk_test_StvANvmxQSl7eb88LnRjg5Kd', // replace with live key in production
          token: function (token, args) {
            deferred.resolve(token, args);
          }
        });

        submit = function (params) {
          var defaults, merged;

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

          merged = utils.params(params, defaults);

          // get the stripe token
          checkout.open(merged);

          // deferred will be resolved by the callback in the 'checkout' handler
          deferred.promise.then(function (token) {
            
            params.card = token.id;
            params.email = token.email;

            switch (params.type) {
              // create a new subscription
              case 'subscription':
                $stripe.customers().create(params).$promise.then(
                  function (res) {
                    console.log(res);
                  },
                  function (err) {
                    console.log(err);
                  }
                );
                break;

              // send charge request to the server
              default:
                $stripe.charges().create(params).$promise.then(
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
          });
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