/* 
 * Shifter v3.1.2 - 2015-04-04 
 * A jQuery plugin for simple slide-out mobile navigation. Part of the Formstone Library. 
 * http://classic.formstone.it/shifter/ 
 * 
 * Copyright 2015 Ben Plum; MIT Licensed 
 */

;(function ($, window) {
	"use strict";

	var namespace                = "shifter",
		initialized              = false,
		hasTouched               = false,
		data                     = {},
		// Classes
		class_handle             = namespace + "-handle",
		class_page               = namespace + "-page",
		class_header             = namespace + "-header",
		class_navigation         = namespace + "-navigation",
		class_isEnabled          = namespace + "-enabled",
		class_isOpen             = namespace + "-open",
		// Events - Listen
		event_clickTouchStart    = "touchstart." + namespace + " click." + namespace;

	/**
	 * @options
	 * @param maxWidth [string] <'980px'> "Width at which to auto-disable plugin"
	 */
	var options = {
		maxWidth: "980px"
	};

	var pub = {

		/**
		 * @method
		 * @name close
		 * @description Closes navigation if open
		 * @example $.shifter("close");
		 */
		close: function() {
			if (initialized) {
				data.$html.removeClass(class_isOpen);
				data.$body.removeClass(class_isOpen);
				data.$shifts.off( classify(namespace) );
				// Close mobile keyboard if open
				data.$nav.find("input").trigger("blur");
			}
		},

		/**
		 * @method
		 * @name enable
		 * @description Enables navigation system
		 * @example $.shifter("enable");
		 */
		enable: function() {
			if (initialized) {
				data.$body.addClass(class_isEnabled);
			}
		},

		/**
		 * @method
		 * @name destroy
		 * @description Removes instance of plugin
		 * @example $.shifter("destroy");
		 */
		destroy: function() {
			if (initialized) {
				data.$html.removeClass(class_isOpen);
				data.$body.removeClass( [class_isEnabled, class_isOpen].join(" ") )
					      .off(event_clickTouchStart);

				// Navtive MQ Support
				if (window.matchMedia !== undefined) {
					data.mediaQuery.removeListener(onRespond);
				}

				data = {};
				initialized = false;
			}
		},

		/**
		 * @method
		 * @name disable
		 * @description Disables navigation system
		 * @example $.shifter("disable");
		 */
		disable: function() {
			if (initialized) {
				pub.close();
				data.$body.removeClass(class_isEnabled);
			}
		},

		/**
		 * @method
		 * @name open
		 * @description Opens navigation if closed
		 * @example $.shifter("open");
		 */
		open: function() {
			if (initialized) {
				data.$html.addClass(class_isOpen);
				data.$body.addClass(class_isOpen);
				data.$shifts.one(event_clickTouchStart, onClickTouchStart);
			}
		}
	};

	/**
	 * @method private
	 * @name init
	 * @description Initializes plugin
	 * @param opts [object] "Initialization options"
	 */
	function init(opts) {
		if (!initialized) {
			data = $.extend({}, options, opts || {});

			data.$html      = $("html");
			data.$body      = $("body");
			data.$shifts    = $( [classify(class_page), classify(class_header)].join(", ") );
			data.$nav       = $( classify(class_navigation) );

			if (data.$shifts.length > 0 && data.$nav.length > 0) {
				initialized = true;

				data.$body.on(event_clickTouchStart, classify(class_handle), onClickTouchStart);

				// Navtive MQ Support
				if (window.matchMedia !== undefined) {
					data.mediaQuery = window.matchMedia("(max-width:" + (data.maxWidth === Infinity ? "100000px" : data.maxWidth) + ")");
					data.mediaQuery.addListener(onRespond);
					onRespond();
				}
			}
		}
	}

	/**
	 * @method private
	 * @name onRespond
	 * @description Handles media query match change
	 */
	function onRespond() {
		if (data.mediaQuery.matches) {
			pub.enable();
		} else {
			pub.disable();
		}
	}

	/**
	 * @method private
	 * @name onClickTouchStart
	 * @description Determines proper click / touch action
	 * @param e [object] "Event data"
	 */
	function onClickTouchStart(e) {
		e.preventDefault();
		e.stopPropagation();

		if (!hasTouched) {
			if (data.$body.hasClass(class_isOpen)) {
				pub.close();
			} else {
				pub.open();
			}
		}

		if (e.type === "touchstart") {
			hasTouched = true;

			setTimeout(resetTouch, 500);
		}
	}

	/**
	 * @method private
	 * @name resetTouch
	 * @description Resets touch state
	 */
	function resetTouch() {
		hasTouched = false;
	}

	/**
	 * @method private
	 * @name classify
	 * @description Create class selector from text
	 * @param text [string] "Text to convert"
	 * @return [string] "New class name"
	 */
	function classify(text) {
		return "." + text;
	}

	$[namespace] = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return init.apply(this, arguments);
		}
		return this;
	};
})(jQuery, window);