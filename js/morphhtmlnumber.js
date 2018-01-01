/*
 * Plugin Name: Morph HTML Number
 * Version: 0.3.0
 * Plugin URL: https://github.com/Darklg/JavaScriptUtilities
 * JavaScriptUtilities Vanilla-JS may be freely distributed under the MIT license.
 */

/* ----------------------------------------------------------
  Morph HTML Number
---------------------------------------------------------- */

var morphHTMLNumber = function(options) {
    'use strict';
    var intervalValue,
        interval,
        startValue,
        isMorphingAttribute = 'data-ismorphing';
    if (!options) {
        return false;
    }
    if (options.tagName) {
        options = {
            el: options
        };
    }
    if (!options.el) {
        return false;
    }

    if (options.el.getAttribute(isMorphingAttribute) == '1') {
        return;
    }
    options.el.setAttribute(isMorphingAttribute, 1);

    // Set options
    options = this.setOptions(options);

    // Get values
    intervalValue = options.finalValue / (options.time / options.intervalDelay);
    startValue = 0;

    // Set content to 0
    options.el.innerHTML = 0;

    // Launch Counter incrementation
    interval = setInterval(function set_frame_value() {
        startValue += intervalValue;
        if (options.isFloat) {
            options.el.innerHTML = startValue.toFixed(options.nbDecimals);
        }
        else {
            options.el.innerHTML = Math.ceil(startValue);

        }
    }, options.intervalDelay);

    setTimeout(function set_final_value() {
        // Stop counter
        clearInterval(interval);
        // Set content to final value
        options.el.innerHTML = options.finalValue;
        // Allow relaunch
        options.el.setAttribute(isMorphingAttribute, 0);
    }, options.time);
};

/* ----------------------------------------------------------
  Set Options
---------------------------------------------------------- */

morphHTMLNumber.prototype.setOptions = function(options) {
    'use strict';

    /* Animation time */
    var defaultOptionsTime = 1500,
        defaultOptionsTimeAttribute = 'data-morphtime';
    if (options.el.getAttribute(defaultOptionsTimeAttribute)) {
        defaultOptionsTime = options.el.getAttribute(defaultOptionsTimeAttribute);
    }
    options.time = options.time || defaultOptionsTime;

    /* Interval between frames */
    var defaultOptionsIntervalDelay = 25,
        defaultOptionsIntervalDelayAttribute = 'data-morphintervaldelay';
    if (options.el.getAttribute(defaultOptionsIntervalDelayAttribute)) {
        defaultOptionsIntervalDelay = options.el.getAttribute(defaultOptionsIntervalDelayAttribute);
    }
    options.intervalDelay = options.intervalDelay || defaultOptionsIntervalDelay;

    /* Float number */
    var defaultOptionIsFloat = false,
        defaultOptionIsFloatAttribute = 'data-morphisfloat';
    if (options.el.getAttribute(defaultOptionIsFloatAttribute)) {
        defaultOptionIsFloat = !!options.el.getAttribute(defaultOptionIsFloatAttribute);
    }
    options.isFloat = options.isFloat || defaultOptionIsFloat;

    /* Number of decimals if float */
    var defaultOptionsNbDecimals = 2,
        defaultOptionsNbDecimalsAttribute = 'data-morphnbdecimals';
    if (options.el.getAttribute(defaultOptionsNbDecimalsAttribute)) {
        defaultOptionsNbDecimals = options.el.getAttribute(defaultOptionsNbDecimalsAttribute);
    }
    options.nbDecimals = options.nbDecimals || defaultOptionsNbDecimals;

    // Final value
    var finalValueAttribute = 'data-finalvalue';
    if (!options.finalValue) {
        if (options.el.getAttribute(finalValueAttribute)) {
            options.finalValue = options.el.getAttribute(finalValueAttribute);
        }
        else {
            options.finalValue = options.el.innerHTML;
        }
    }
    if (options.isFloat) {
        options.finalValue = parseFloat(options.finalValue, 10).toFixed(options.nbDecimals);
    }
    else {
        options.finalValue = parseInt(options.finalValue, 10);
    }

    return options;
};
