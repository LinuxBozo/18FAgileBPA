'use strict';

/**
 * Scroll the user to an ID-based location on the page that matches the provided
 * scroll-to attribute value.
 *
 * @namespace adsApp
 * @module {Directive} scrollTo
 */
module.exports = /*@ngInject*/ function($location, $anchorScroll) {

    return function(scope, element, attrs) {

        element.bind('click', function(event) {
            // Don't let click event or location change continue
            event.stopPropagation();
            scope.$on('$locationChangeStart', function(ev) {
                ev.preventDefault();
            });

            // Scroll to the specified value on the page
            $location.hash(attrs.scrollTo);
            $anchorScroll();
        });
    };
};
