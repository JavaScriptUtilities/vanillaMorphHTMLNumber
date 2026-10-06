/*
 * Plugin Name: Morph HTML Number
 * Version: 0.6.0
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

    // No number found in a formatted value : leave content untouched
    if (options.keepFormat && !options.format) {
        options.el.setAttribute(isMorphingAttribute, 0);
        return;
    }

    // Get values
    startValue = options.startValue;
    intervalValue = (options.finalValue - options.startValue) / (options.time / options.intervalDelay);

    function format_value(value) {
        var str = options.isFloat ? value.toFixed(options.nbDecimals) : String(Math.ceil(value));
        if (!options.format) {
            return str;
        }
        var f = options.format,
            parts = str.replace('-', '').split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, f.thousandSep);
        return f.prefix + (str.charAt(0) == '-' ? '-' : '') + parts.join(f.decimalSep) + f.suffix;
    }

    function callback_number() {
        // Set content to 0
        options.el.innerHTML = format_value(startValue);

        // Launch Counter incrementation
        interval = setInterval(function set_frame_value() {
            startValue += intervalValue;
            options.el.innerHTML = format_value(startValue);
        }, options.intervalDelay);

        setTimeout(function set_final_value() {
            // Stop counter
            clearInterval(interval);
            // Set content to final value
            options.el.innerHTML = format_value(options.finalValue);
            // Allow relaunch
            options.el.setAttribute(isMorphingAttribute, 0);
        }, options.time);

    }

    if(options.waitUntilVisible){
        var wasVisible;
        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                // Si l'élément est visible et que callback_number n'a pas été appelée avant
                if (entry.isIntersecting && !wasVisible) {
                    callback_number();
                    wasVisible = true;
                    observer.unobserve(options.el);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });
        observer.observe(options.el);
    }
    else {
        callback_number();
    }

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

    /* Reverse value */
    var defaultOptionIsReverse = false,
        defaultOptionIsReverseAttribute = 'data-morphisreverse';
    if (options.el.getAttribute(defaultOptionIsReverseAttribute)) {
        defaultOptionIsReverse = !!options.el.getAttribute(defaultOptionIsReverseAttribute);
    }
    options.isReverse = options.isReverse || defaultOptionIsReverse;

    /* Wait Until visible */
    var defaultOptionWaitUntilVisible = false,
        defaultOptionWaitUntilVisibleAttribute = 'data-morphwaituntilvisible';
    if (options.el.getAttribute(defaultOptionWaitUntilVisibleAttribute)) {
        defaultOptionWaitUntilVisible = !!options.el.getAttribute(defaultOptionWaitUntilVisibleAttribute);
    }
    options.waitUntilVisible = options.waitUntilVisible || defaultOptionWaitUntilVisible;

    /* Keep format : prefix, suffix, thousands & decimal separators */
    var defaultOptionKeepFormat = false,
        defaultOptionKeepFormatAttribute = 'data-morphkeepformat';
    if (options.el.getAttribute(defaultOptionKeepFormatAttribute)) {
        defaultOptionKeepFormat = !!options.el.getAttribute(defaultOptionKeepFormatAttribute);
    }
    options.keepFormat = options.keepFormat || defaultOptionKeepFormat;

    /* Number of decimals if float */
    var defaultOptionsNbDecimals = 2,
        defaultOptionsNbDecimalsAttribute = 'data-morphnbdecimals',
        hasNbDecimals = !!(options.nbDecimals || options.el.getAttribute(defaultOptionsNbDecimalsAttribute));
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
    if (options.keepFormat) {
        options.format = this.parseFormat(options.finalValue.toString());
        if (!options.format) {
            return options;
        }
        options.finalValue = options.format.value;
        if (options.format.nbDecimals) {
            options.isFloat = true;
            options.nbDecimals = hasNbDecimals ? options.nbDecimals : options.format.nbDecimals;
        }
    }
    options.finalValue = options.finalValue.toString().replace(',', '.');
    if (options.isFloat) {
        options.finalValue = parseFloat(options.finalValue, 10);
    }
    else {
        options.finalValue = parseInt(options.finalValue, 10);
    }

    // Final value
    var startValueAttribute = 'data-startValue';
    if (!options.startValue) {
        if (options.el.getAttribute(startValueAttribute)) {
            options.startValue = options.el.getAttribute(startValueAttribute);
        }
        else {
            if (options.isReverse) {
                options.startValue = 100;
            }
            else {
                options.startValue = 0;
            }
        }
    }
    if (options.keepFormat) {
        var startFormat = this.parseFormat(options.startValue.toString());
        options.startValue = startFormat ? startFormat.value : 0;
    }
    options.startValue = options.startValue.toString().replace(',', '.');
    if (options.startValue) {
        if (options.isFloat) {
            options.startValue = parseFloat(options.startValue, 10);
        }
        else {
            options.startValue = parseInt(options.startValue, 10);
        }
    }

    return options;
};

/* ----------------------------------------------------------
  Parse format : first number outside HTML tags
---------------------------------------------------------- */

morphHTMLNumber.prototype.parseFormat = function(str) {
    'use strict';
    /* Spaces always group thousands, "." or "," only before exactly 3 digits, else decimal */
    var numberRegex = /(-?\d+)((?:[ \u00a0\u202f.,]\d{3}(?!\d))*)(?:([.,])(\d+))?/,
        parts = str.split(/(<[^>]*>)/),
        match, i;
    for (i = 0; i < parts.length; i += 2) {
        match = numberRegex.exec(parts[i]);
        if (!match) {
            continue;
        }
        return {
            prefix: parts.slice(0, i).join('') + parts[i].slice(0, match.index),
            suffix: parts[i].slice(match.index + match[0].length) + parts.slice(i + 1).join(''),
            value: parseFloat(match[1] + match[2].replace(/\D/g, '') + '.' + (match[4] || '0')),
            thousandSep: match[2].charAt(0),
            decimalSep: match[3] || '.',
            nbDecimals: match[4] ? match[4].length : 0
        };
    }
    return false;
};
