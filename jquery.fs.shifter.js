/*
 * Shifter Plugin [Formtone Library]
 * @author Ben Plum
 * @version 1.0.0
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

if (jQuery) (function($) {
		
	// Default Options
	var options = {
		maxWidth: "980px"
	};
	
	// Internal Data
	var initialized = false,
		data = {};
	
	// Public Methods
	var pub = {
		
		// Close Navigation
		close: function() {
			if (initialized) {
				data.$body.removeClass("shifter-open");
				// Close mobile keyboard
				data.$nav.find("input").trigger("blur");
			}
		},
		
		// Enable Shifter
		enable: function() {
			if (initialized) {
				data.$body.addClass("shifter-active");
			}
		},
		
		// Set Defaults
		defaults: function(opts) {
			options = $.extend(options, opts || {});
		},
		
		// Destroy Shifter
		destroy: function() {
			if (initialized) {
				data.$body.removeClass("shifter shifter-active shifter-open")
					      .off("touchstart.shifter click.shifter");
				
				// Navtive MQ Support
				if (window.matchMedia !== undefined) {
					data.mediaQuery.removeListener(_respond);
				}
				
				data = {};
			}
		},
		
		// Disable Shifter
		disable: function() {
			if (initialized) {
				data.$body.removeClass("shifter-active");
			}
		},
		
		// Open Navigation
		open: function() {
			if (initialized) {
				data.$body.addClass("shifter-open");
				data.$page.one("touchstart.shifter click.shifter", _handleClick);
			}
		}
	};
	
	// Private Methods
	
	// Initialize
	function _init(opts) {
		// Local options
		options = $.extend(options, opts || {});
		
		data.$body = $("body");
		data.$page = $(".shifter-page");
		data.$nav  = $(".shifter-navigation");
		
		if (data.$page.length > 0 && data.$nav.length > 0) {
			initialized = true;
			
			data.$body.addClass("shifter")
					  .on("touchstart.shifter click.shifter", ".shifter-handle", _handleClick);
			
			// Navtive MQ Support
			if (window.matchMedia !== undefined) {
				data.mediaQuery = window.matchMedia("(max-width:" + (options.maxWidth == Infinity ? "100000px" : options.maxWidth) + ")");
				data.mediaQuery.addListener(_respond);
				_respond();
			}
		} else {
			console.warn("Shifter Elements Not Found");
		}
	}
	
	// Handle media query change
	function _respond() {
		if (data.mediaQuery.matches) {
			pub.enable();
		} else {
			pub.disable();
		}
	}
	
	// Hanle clicks
	function _handleClick(e) {
		e.preventDefault();
		e.stopPropagation();
		
		if (data.$body.hasClass("shifter-open")) {
			pub.close();
		} else {
			pub.open();
		}
	}
	
	// Define Plugin
	$.shifter = function(method) {
		if (pub[method]) {
			return pub[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return _init.apply(this, arguments);
		}
		return this;
	};
})(jQuery);
