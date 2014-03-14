'use strict';

/**
 * Directive to generate a stripe checkout form
 */
angular.module('stripe.directives.checkout', ['stripe.services.rest'])

  .directive('stripeCheckoutButton', function ($window, utils) {
    var def;
    
    def = {
      controller: function ($http, $scope, $stripe) {
        var handler, params, prepare, submit;

        // console.log($stripeCharge.list());
        // console.log($stripeCharge.refund({id:'ch_103f572LBxto4zcW1cdKmcx1'}));

        handler = $window.StripeCheckout.configure({
          key: 'pk_test_StvANvmxQSl7eb88LnRjg5Kd', // replace with live key in production
          token: function (token, args) {
            console.log(token, args);

            params.card = token.id;
            params.email = token.email;

            // send charge request to the server
            // $stripe.charge().create(params).$promise.then(
            //   // success
            //   function (res) {
            //     console.log(res);
            //   },
            //   // error
            //   function (err) {
            //     console.log(err);
            //   });

            // create a new customer
            $stripe.customers().create(params).$promise.then(
              function (res) {
                console.log(res);
              },
              function (err) {
                console.log(err);
              }
            );
          }
        });

        prepare = function (config) {
          params = config;
        };

        submit = function () {
          handler.open(params);
        };

        // Scope assignments
        $scope.stripe = {};

        // Public Methods / Variables
        this.prepare = prepare;
        this.submit = submit;
      },
      link: function (scope, element, attrs, ctrl) {
        var defaults, merged;

        // For details on what each of these parameters do
        // see https://stripe.com/docs/checkout#integration-custom > Configuration Options
        defaults = {
          name: 'Company Name',
          image: '',
          description: '',
          amount: 1, // amount in cents
          currency: 'USD', // three letter ISO code
          panelLabel: 'Pay',
          billingAddress: false,
          shippingAddress: false,
          email: '',
          opened: null,
          closed: null
        };

        merged = utils.params(attrs, defaults);
        merged.amount = parseInt(merged.amount);

        // Setup the Stripe Checkout Handler
        ctrl.prepare(merged);
        
        // Scope Assignment
        scope.submit = ctrl.submit;
      }
    };

    return def;
  });

  // .directive('stripeCheckout', function (_) {
    
  //   var defaults = {
  //     amounts: '$20, $50, $100, Other'
  //   };

  //   var directiveDefinitionObject = {
  //     templateUrl: 'stripe/templates/checkout.tpl.html',
  //     controller: 'StripeCheckoutCtrl',
  //     link: function (scope, element, attrs) {
  //       var opts = _.merge(defaults, attrs);
  //       var amounts = opts.amounts.split(',');
  //       for (var i = amounts.length - 1; i >= 0; i--) {
  //         amounts[i] = amounts[i].trim();
  //       }

  //       scope.amounts = amounts;

  //       scope.isActive = function (amount) {
  //         return scope.selectedAmount === amount;
  //       };
  //     }
  //   };

  //   return directiveDefinitionObject;
  // })

  // .directive('stripeValidate', function ($window) {

  //   var directiveDefinitionObject = {

  //     // element must have the ng-model attribute
  //     require: 'ngModel',

  //     // ctrl is the controller of ngModel
  //     link: function (scope, element, attrs, ctrl) {
        
  //       // add a parser that will process each time the value is 
  //       // parsed into the model when the user updates it.
  //       ctrl.$parsers.unshift(function (val) {
  //         var re, valid = false;
  //         switch (element[0].name) {
  //         case 'cardnumber':
  //           valid = $window.Stripe.validateCardNumber(val);
  //           break;
  //         case 'cardexpiry':
  //           if (val) {
  //             var expiry = val.split('/');
  //             valid = $window.Stripe.validateExpiry(expiry[0],expiry[1]);
  //           }
  //           break;
  //         case 'cvc':
  //           valid = $window.Stripe.validateCVC(val);
  //           break;
  //         case 'cardholder':
  //           re = /[a-zA-z\s-]+/;
  //           valid = re.test(val);
  //           break;
  //         case 'amount':
  //           re = /^\$?(\d*(\d\.?|\.\d{1,2}))$/;
  //           valid = re.test(val);
  //           break;
  //         }
        
  //         ctrl.$setValidity('stripeValidate', valid);

  //         // if valid return val to the model, otherwise undefined
  //         return valid ? val : undefined;
  //       });

  //       // TODO - is there an easier way to do this?
  //       scope.$watch('selectedAmount', function (newVal, oldVal) {
          
  //         if (newVal !== oldVal) {
  //           // Test to make sure the amount is a $ value
  //           var re = /^\$?(\d*(\d\.?|\.\d{1,2}))$/;
  //           if (re.test(scope.selectedAmount)) {
  //             scope.card.amount = scope.selectedAmount;
  //           }
  //         }
  //       });
  //     }
  //   };

  //   return directiveDefinitionObject;
  // })

  // /**
  //  * Directive to used to handle the form submission
  //  */
  // .directive('stripeSubmit', function ($parse) {
  //   var directiveDefinitionObject = {
  //     require: 'form',
  //     link: function (scope, element, attrs, ctrl) {

  //       var fn = $parse(attrs.stripeSubmit);

  //       element.bind('submit', function (evt) {
          
  //         // set form submit attempted flag
  //         scope.stripe.attempted = true;
  //         scope.stripe.disableSubmit = true;

  //         // if form is not valid prevent submission by returning false but renable 'submit'
  //         if (!ctrl.$valid) {
  //           scope.stripe.status = 'validation-error';
            
  //           // force digest to display any form errors
  //           if (!scope.$$phase) scope.$apply();
            
  //           // re-enable the submit button
  //           scope.stripe.disableSubmit = false;
  //           return false;
  //         }

  //         // call the submit function
  //         scope.$apply(function () {
  //           fn(scope, {$event: evt});
  //         });
  //       });
  //     }
  //   };

  //   return directiveDefinitionObject;
  // });