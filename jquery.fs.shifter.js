/*
 * Shifter Plugin [Formtone Library]
 * @author Ben Plum
 * @version 0.0.5
 *
 * Copyright © 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 */

if (jQuery) (function($) {
		
	// Default Options
	var options = {
	};
	
	// Internal Data
	var data = {};
	
	// Public Methods
	var pub = {
		
		// Close Nav
		close: function(e) {
			if (e.preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
			
			data.$body.removeClass("shifter-open");
			// Close mobile keyboard
			data.$nav.find("input").trigger("blur");
		},
		
		// Destroy Shifter
		destroy: function() {
			// ???
		},
		
		// Open Nav
		open: function() {
			data.$body.addClass("shifter-open");
			data.$page.one("touchstart click", pub.close);
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
			data.$body.addClass("shifter")
					  .on("touchstart click", ".shifter-handle", _handleClick);
		} else {
			console.warn("Shifter Elements Not Found");
		}
	}
	
	// On handle click
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
