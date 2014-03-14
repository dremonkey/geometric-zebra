'use strict';

/**
 * Stripe Module
 */

angular.module('stripe', [
  'ngAnimate',
  'particle.common.utils',
  'stripe.controllers',
  'stripe.directives',
  'stripe.services'
]);

angular.module('stripe.controllers', [
  'stripe.controllers.checkout'
]);

angular.module('stripe.directives', [
  'stripe.directives.checkout'
]);

angular.module('stripe.services', [
  'stripe.services.rest'
]);