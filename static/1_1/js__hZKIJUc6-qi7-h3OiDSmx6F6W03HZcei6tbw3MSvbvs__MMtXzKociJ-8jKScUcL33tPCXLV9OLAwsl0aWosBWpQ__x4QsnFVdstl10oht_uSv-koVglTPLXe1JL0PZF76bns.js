(function ($) {

Drupal.behaviors.commentNotify = {
  attach: function (context) {
    $('#edit-notify', context)
      .bind('change', function() {
        $('#edit-notify-type', context)
          [this.checked ? 'show' : 'hide']()
          .find('input[type=checkbox]:checked').attr('checked', 'checked');
      })
      .trigger('change');
  }
}

})(jQuery);

;/*})'"*/
;/*})'"*/
/**
 * @file
 * Javascript functionality for Facebook Instant Articles Display module.
 */

(function ($) {
  'use strict';

  // Row handlers for the 'Manage display' screen.
  Drupal.fieldUIDisplayOverview = Drupal.fieldUIDisplayOverview || {};

  Drupal.fieldUIDisplayOverview.facebookInstantArticlesDisplay = function (row, data) {

    this.row = row;
    this.name = data.name;
    this.region = data.region;
    this.tableDrag = data.tableDrag;

    // Attach change listener to the 'region' select.
    this.$regionSelect = $('select.ds-field-region', row);
    this.$regionSelect.change(Drupal.fieldUIOverview.onChange);

    // Attach change listener to the 'formatter type' select.
    this.$formatSelect = $('select.field-formatter-type', row);
    this.$formatSelect.change(Drupal.fieldUIOverview.onChange);

    return this;
  };

  Drupal.fieldUIDisplayOverview.facebookInstantArticlesDisplay.prototype = {

    /**
     * Returns the region corresponding to the current form values of the row.
     */
    getRegion: function () {
      return this.$regionSelect.val();
    },

    /**
     * Reacts to a row being changed regions.
     *
     * This function is called when the row is moved to a different region, as a
     * result of either :
     * - a drag-and-drop action
     * - user input in one of the form elements watched by the
     *   Drupal.fieldUIOverview.onChange change listener.
     *
     * @param region
     *   The name of the new region for the row.
     *
     * @return
     *   A hash object indicating which rows should be AJAX-updated as a result
     *   of the change, in the format expected by
     *   Drupal.displayOverview.AJAXRefreshRows().
     */
    regionChange: function (region) {

      // Replace dashes with underscores.
      region = region.replace(/-/g, '_');

      // Set the region of the select list.
      this.$regionSelect.val(region);

      // Prepare rows to be refreshed in the form.
      var refreshRows = {};
      refreshRows[this.name] = this.$regionSelect.get(0);

      // If a row is handled by field_group module, loop through the children.
      if ($(this.row).hasClass('field-group') && $.isFunction(Drupal.fieldUIDisplayOverview.group.prototype.regionChangeFields)) {
        Drupal.fieldUIDisplayOverview.group.prototype.regionChangeFields(region, this, refreshRows);
      }

      return refreshRows;
    }
  };

})(jQuery);

;/*})'"*/
;/*})'"*/
(function ($) {
  Drupal.behaviors.fitvids = {
    attach: function (context, settings) {
      try
      {
        // Check that fitvids exists
        if (typeof $.fn.fitVids !== 'undefined') {
        
          // Check that the settings object exists
          if (typeof settings.fitvids !== 'undefined') {
            
            // Default settings values
            var selectors = ['body'];
            var simplifymarkup = true;
            var custom_domains = null;
            
            // Get settings for this behaviour
            if (typeof settings.fitvids.selectors !== 'undefined') {
              selectors = settings.fitvids.selectors;
            }
            if (typeof settings.fitvids.simplifymarkup !== 'undefined') {
              simplifymarkup = settings.fitvids.simplifymarkup;
            }
            if (settings.fitvids.custom_domains.length > 0) {
              custom_domains = settings.fitvids.custom_domains;
            }
                
            // Remove media wrappers
            if (simplifymarkup) {
              if ($(".media-youtube-outer-wrapper").length) {
                $(".media-youtube-outer-wrapper").removeAttr("style");
                $(".media-youtube-preview-wrapper").removeAttr("style");
                $(".media-youtube-outer-wrapper").removeClass("media-youtube-outer-wrapper");
                $(".media-youtube-preview-wrapper").removeClass("media-youtube-preview-wrapper");
              }
              if ($(".media-vimeo-outer-wrapper").length) {
                $(".media-vimeo-outer-wrapper").removeAttr("style");
                $(".media-vimeo-preview-wrapper").removeAttr("style");
                $(".media-vimeo-outer-wrapper").removeClass("media-vimeo-outer-wrapper");
                $(".media-vimeo-preview-wrapper").removeClass("media-vimeo-preview-wrapper");
              }
            }
            
            // Fitvids!
            for (var x = 0; x < selectors.length; x ++) {
              $(selectors[x]).fitVids({customSelector: custom_domains});
            }
          }
        }
      }
      catch (e) {
        // catch any fitvids errors
        window.console && console.warn('Fitvids stopped with the following exception');
        window.console && console.error(e);
      }
    }
  };
}(jQuery));

;/*})'"*/
;/*})'"*/
/**
 * @file
 */

(function ($) {

  'use strict';

  Drupal.extlink = Drupal.extlink || {};

  Drupal.extlink.attach = function (context, settings) {
    if (!settings.hasOwnProperty('extlink')) {
      return;
    }

    // Strip the host name down, removing ports, subdomains, or www.
    var pattern = /^(([^\/:]+?\.)*)([^\.:]{1,})((\.[a-z0-9]{1,253})*)(:[0-9]{1,5})?$/;
    var host = window.location.host.replace(pattern, '$2$3');
    var subdomain = window.location.host.replace(host, '');

    // Determine what subdomains are considered internal.
    var subdomains;
    if (settings.extlink.extSubdomains) {
      subdomains = '([^/]*\\.)?';
    }
    else if (subdomain === 'www.' || subdomain === '') {
      subdomains = '(www\\.)?';
    }
    else {
      subdomains = subdomain.replace('.', '\\.');
    }

    // Build regular expressions that define an internal link.
    var internal_link = new RegExp('^https?://([^@]*@)?' + subdomains + host, 'i');

    // Extra internal link matching.
    var extInclude = false;
    if (settings.extlink.extInclude) {
      extInclude = new RegExp(settings.extlink.extInclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link matching.
    var extExclude = false;
    if (settings.extlink.extExclude) {
      extExclude = new RegExp(settings.extlink.extExclude.replace(/\\/, '\\'), 'i');
    }

    // Extra external link CSS selector exclusion.
    var extCssExclude = false;
    if (settings.extlink.extCssExclude) {
      extCssExclude = settings.extlink.extCssExclude;
    }

    // Extra external link CSS selector explicit.
    var extCssExplicit = false;
    if (settings.extlink.extCssExplicit) {
      extCssExplicit = settings.extlink.extCssExplicit;
    }

    // Define the jQuery method (either 'append' or 'prepend') of placing the icon, defaults to 'append'.
    var extIconPlacement = settings.extlink.extIconPlacement || 'append';

    // Find all links which are NOT internal and begin with http as opposed
    // to ftp://, javascript:, etc. other kinds of links.
    // When operating on the 'this' variable, the host has been appended to
    // all links by the browser, even local ones.
    // In jQuery 1.1 and higher, we'd use a filter method here, but it is not
    // available in jQuery 1.0 (Drupal 5 default).
    var external_links = [];
    var mailto_links = [];
    $('a:not(.' + settings.extlink.extClass + ', .' + settings.extlink.mailtoClass + '), area:not(.' + settings.extlink.extClass + ', .' + settings.extlink.mailtoClass + ')', context).each(function (el) {
      try {
        var url = '';
        if (typeof this.href == 'string') {
          url = this.href.toLowerCase();
        }
        // Handle SVG links (xlink:href).
        else if (typeof this.href == 'object') {
          url = this.href.baseVal;
        }
        if (url.indexOf('http') === 0
          && ((!url.match(internal_link) && !(extExclude && url.match(extExclude))) || (extInclude && url.match(extInclude)))
          && !(extCssExclude && $(this).is(extCssExclude))
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          external_links.push(this);
        }
        // Do not include area tags with begin with mailto: (this prohibits
        // icons from being added to image-maps).
        else if (this.tagName !== 'AREA'
          && url.indexOf('mailto:') === 0
          && !(extCssExclude && $(this).parents(extCssExclude).length > 0)
          && !(extCssExplicit && $(this).parents(extCssExplicit).length < 1)) {
          mailto_links.push(this);
        }
      }
      // IE7 throws errors often when dealing with irregular links, such as:
      // <a href="node/10"></a> Empty tags.
      // <a href="http://user:pass@example.com">example</a> User:pass syntax.
      catch (error) {
        return false;
      }
    });

    if (settings.extlink.extClass) {
      Drupal.extlink.applyClassAndSpan(external_links, settings.extlink.extClass, extIconPlacement);
    }

    if (settings.extlink.mailtoClass) {
      Drupal.extlink.applyClassAndSpan(mailto_links, settings.extlink.mailtoClass, extIconPlacement);
    }

    if (settings.extlink.extTarget) {
      // Apply the target attribute to all links.
      $(external_links).attr('target', settings.extlink.extTarget);
      // Add rel attributes noopener and noreferrer.
      $(external_links).attr('rel', function (i, val) {
        // If no rel attribute is present, create one with the values noopener and noreferrer.
        if (val == null) {
          return 'noopener noreferrer';
        }
        // Check to see if rel contains noopener or noreferrer. Add what doesn't exist.
        if (val.indexOf('noopener') > -1 || val.indexOf('noreferrer') > -1) {
          if (val.indexOf('noopener') === -1) {
            return val + ' noopener';
          }
          if (val.indexOf('noreferrer') === -1) {
            return val + ' noreferrer';
          }
          // Both noopener and noreferrer exist. Nothing needs to be added.
          else {
            return val;
          }
        }
        // Else, append noopener and noreferrer to val.
        else {
          return val + ' noopener noreferrer';
        }
      });
    }

    Drupal.extlink = Drupal.extlink || {};

    // Set up default click function for the external links popup. This should be
    // overridden by modules wanting to alter the popup.
    Drupal.extlink.popupClickHandler = Drupal.extlink.popupClickHandler || function () {
      if (settings.extlink.extAlert) {
        return confirm(settings.extlink.extAlertText);
      }
    };

    $(external_links).click(function (e) {
      return Drupal.extlink.popupClickHandler(e, this);
    });
  };

  /**
   * Apply a class and a trailing <span> to all links not containing images.
   *
   * @param {object[]} links
   *   An array of DOM elements representing the links.
   * @param {string} class_name
   *   The class to apply to the links.
   * @param {string} icon_placement
   *   'append' or 'prepend' the icon to the link.
   */
  Drupal.extlink.applyClassAndSpan = function (links, class_name, icon_placement) {
    var $links_to_process;
    if (Drupal.settings.extlink.extImgClass) {
      $links_to_process = $(links);
    }
    else {
      var links_with_images = $(links).find('img').parents('a');
      $links_to_process = $(links).not(links_with_images);
    }
    $links_to_process.addClass(class_name);
    var i;
    var length = $links_to_process.length;
    for (i = 0; i < length; i++) {
      var $link = $($links_to_process[i]);
      if ($link.css('display') === 'inline' || $link.css('display') === 'inline-block') {
        if (class_name === Drupal.settings.extlink.mailtoClass) {
          $link[icon_placement]('<span class="' + class_name + '" aria-label="' + Drupal.settings.extlink.mailtoLabel + '"></span>');
        }
        else {
          $link[icon_placement]('<span class="' + class_name + '" aria-label="' + Drupal.settings.extlink.extLabel + '"></span>');
        }
      }
    }
  };

  Drupal.behaviors.extlink = Drupal.behaviors.extlink || {};
  Drupal.behaviors.extlink.attach = function (context, settings) {
    // Backwards compatibility, for the benefit of modules overriding extlink
    // functionality by defining an "extlinkAttach" global function.
    if (typeof extlinkAttach === 'function') {
      extlinkAttach(context);
    }
    else {
      Drupal.extlink.attach(context, settings);
    }
  };

})(jQuery);

;/*})'"*/
;/*})'"*/