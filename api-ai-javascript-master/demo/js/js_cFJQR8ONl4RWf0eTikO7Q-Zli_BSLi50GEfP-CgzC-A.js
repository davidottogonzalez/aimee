/**
 * @file views_load_more.js
 *
 * Handles the AJAX pager for the view_load_more plugin.
 */
(function ($) {

  /**
   * Provide a series of commands that the server can request the client perform.
   */
  Drupal.ajax.prototype.commands.viewsLoadMoreAppend = function (ajax, response, status) {
    // Get information from the response. If it is not there, default to
    // our presets.
    var wrapper = response.selector ? $(response.selector) : $(ajax.wrapper);
    var method = response.method || ajax.method;
    var effect = ajax.getEffect(response);

    // We don't know what response.data contains: it might be a string of text
    // without HTML, so don't rely on jQuery correctly iterpreting
    // $(response.data) as new HTML rather than a CSS selector. Also, if
    // response.data contains top-level text nodes, they get lost with either
    // $(response.data) or $('<div></div>').replaceWith(response.data).
    var new_content_wrapped = $('<div></div>').html(response.data);
    var new_content = new_content_wrapped.contents();

    // For legacy reasons, the effects processing code assumes that new_content
    // consists of a single top-level element. Also, it has not been
    // sufficiently tested whether attachBehaviors() can be successfully called
    // with a context object that includes top-level text nodes. However, to
    // give developers full control of the HTML appearing in the page, and to
    // enable Ajax content to be inserted in places where DIV elements are not
    // allowed (e.g., within TABLE, TR, and SPAN parents), we check if the new
    // content satisfies the requirement of a single top-level element, and
    // only use the container DIV created above when it doesn't. For more
    // information, please see http://drupal.org/node/736066.
    if (new_content.length != 1 || new_content.get(0).nodeType != 1) {
      new_content = new_content_wrapped;
    }
    // If removing content from the wrapper, detach behaviors first.
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.detachBehaviors(wrapper, settings);
    if ($.waypoints != undefined) {
      $.waypoints('refresh');
    }

    // Set up our default query options. This is for advance users that might
    // change there views layout classes. This allows them to write there own
    // jquery selector to replace the content with.
    var content_query = response.options.content || '.view-content';

    // If we're using any effects. Hide the new content before adding it to the DOM.
    if (effect.showEffect != 'show') {
      new_content.find(content_query).children().hide();
    }

    // Add the new content to the page.
    wrapper.find('.pager a').remove();
    wrapper.find('.pager').parent('.item-list').html(new_content.find('.pager'));
    wrapper.find(content_query)[method](new_content.find(content_query).children());
    if (effect.showEffect != 'show') {
      wrapper.find(content_query).children(':not(:visible)')[effect.showEffect](effect.showSpeed);
    }

    // Attach all JavaScript behaviors to the new content
    // Remove the Jquery once Class, TODO: There needs to be a better
    // way of doing this, look at .removeOnce() :-/
    var classes = wrapper.attr('class');
    var onceClass = classes.match(/jquery-once-[0-9]*-[a-z]*/);
    wrapper.removeClass(onceClass[0]);
    var settings = response.settings || ajax.settings || Drupal.settings;
    Drupal.attachBehaviors(wrapper, settings);
  }

  /**
   * Attaches the AJAX behavior to Views Load More waypoint support.
   */
  Drupal.behaviors.ViewsLoadMore = {
    attach: function (context, settings) {
      if (settings && settings.viewsLoadMore && settings.views.ajaxViews) {
        opts = {
          offset: '100%'
        };
        $.each(settings.viewsLoadMore, function(i, setting) {
          var view = '.view-id-' + setting.view_name + '.view-display-id-' + setting.view_display_id + ' .pager-next a';
          $(view).waypoint(function(event, direction) {
            $(view).waypoint('remove');
            $(view).click();
          }, opts);
        });
      }
    },
    detach: function (context, settings, trigger) {
      if (settings && Drupal.settings.viewsLoadMore && settings.views.ajaxViews) {
        $.each(settings.viewsLoadMore, function(i, setting) {
          var view = '.view-id-' + setting.view_name + '.view-display-id-' + setting.view_display_id + ' .pager-next a';
          $(view, context).waypoint('destroy');
        });
      }
    }
     };
})(jQuery);
;
(function($) {

/**
 * Create a DART object to handle tagging functionality
 */
Drupal.DART = {};

/**
 * Overridable settings.
 */
Drupal.DART.settings = {
  "writeTags": true
};

/**
 * Using document.write, add a DART tag to the page
 */
Drupal.DART.tag = function(tag) {
  tag = typeof(tag) == 'string' ? eval('(' + tag + ')') : tag;

  var tagname = tag.settings.options.method == 'adj' ? 'script' : 'iframe';
  var options = tag.settings.options.method == 'adj' ? 'type="text/javascript"' : 'frameborder="0" scrolling="no" width="' + tag.sz.split("x")[0] + '" height="' + tag.sz.split("x")[1] + '"';

  // Allow other modules to include js that can manipulate the tag object.
  var processed_tag = ($ !== undefined) ? $(document).triggerHandler('dart_tag_process', [tag]) : undefined;
  tag = processed_tag !== undefined ? processed_tag : tag;

  ad = '<' + tagname + ' ' + options + ' src="';
  ad += dart_url + "/";
  ad += tag.network_id !== '' ? tag.network_id + "/" : "";
  ad += tag.settings.options.method + "/";
  ad += tag.prefix + '.' + tag.site + "/" + tag.zone + ";";
  ad += this.keyVals(tag.key_vals);

  // Allow other modules to include js that can manipulate the concatenated tag string.
  rendered_ad = ($ !== undefined) ? $(document).triggerHandler('dart_tag_render', [ad]) : undefined;
  ad = rendered_ad !== undefined ? rendered_ad : ad; ad += '"></' + tagname + '>';

  if (Drupal.DART.settings.writeTags) {
    document.write(ad);
  }

  // console.log('-----------------'+tag.pos+'------------------');
  // console.log(tag);

  return ad;
};

/**
 * Format a key|val pair into a dart tag key|val pair.
 */
Drupal.DART.keyVal = function(key, val, useEval) {
  if (key != "<none>") {
    kvp  = key + "=";
    kvp += useEval ? eval(val) : val;
    kvp += key == "ord" ? "?" : ";";
  }
  else {
    kvp = useEval ? eval(val) : val;
  }

  return(kvp);
};

/**
 * Loop through an object and create kay|val pairs.
 *
 * @param vals
 *   an object in this form:
 *   {
 *     key1 : {{val:'foo', eval:true}, {val:'foo2', eval:false}}
 *     key2 : {{val:'bar', eval:false}},
 *     key3 : {{val:'foobar', eval:true}}
 *   }
 */
Drupal.DART.keyVals = function(vals) {
  var ad = '';
  for(var key in vals) {
    value = vals[key];
    for(var val in value) {
      v = value[val];
      ad += this.keyVal(key, v['val'], v['eval']);
    }
  }
  return ad;
};


/**
 * If there are tags in the loadLastTags, then load them where they belong.
 */
Drupal.DART.display_ads = function () {
  ord = Math.round(Math.random()*1000000000000);
    if (typeof(Drupal.DART.settings.loadLastTags) == 'object') {
    $('.dart-tag.dart-processed').each(function () {
      $(this).removeClass('dart-processed');
      $(this).html('');
    });
    var init = false;
    for (var tag in Drupal.DART.settings.loadLastTags) {
      // variables for background ads may be defined in late loaded scripts. Load bg ad if needed.
      if (Drupal.DART.settings.loadLastTags.hasOwnProperty(tag) && tag != null) {
        (function(tag) {
          var name = tag;
          var scriptTag = Drupal.DART.tag(Drupal.DART.settings.loadLastTags[name]);
          if (typeof(postscribe) == 'function') {
            postscribe($('.dart-name-' + name), scriptTag, function () {
              Drupal.DART.loadBgAd(Drupal.settings.DART.bgAdVars);
              $('.dart-name-' + name).addClass('dart-processed');
            });
          }
          else if (typeof(_this.writeCapture) == 'function') {
            $('.dart-name-' + name).writeCapture().append(scriptTag, function () {
                Drupal.DART.loadBgAd(Drupal.settings.DART.bgAdVars);
            }).addClass('dart-processed');
          }
        }(tag));
      }
    }
  }
}

/**
 * Load the background ad as served by DART.
 */
Drupal.DART.loadBgAd = function(bgAdVars) {
  //ensure ads are loaded only once on the page
  if (!Drupal.DART.settings.bgAdLoaded && typeof bgAdVars != 'undefined') {
    var bgAdCSS = {};
    if (window[bgAdVars.bgImg] != undefined) {
      bgAdCSS['background-image'] = 'url(' + window[bgAdVars.bgImg] + ')';
    }
    if (window[bgAdVars.bgColor] != undefined) {
      bgAdCSS['background-color'] = window[bgAdVars.bgColor];
    }
    if (window[bgAdVars.bgRepeat] != undefined) {
      bgAdCSS['background-repeat'] = window[bgAdVars.bgRepeat];
    }
    $(bgAdVars.selector).css(bgAdCSS);

    if (window[bgAdVars.clickThru] != undefined) {
      $(bgAdVars.selector).addClass('background-ad');
      $(bgAdVars.selector).click(function (e) {
      if(e.target != this) return;
        window.open(window[bgAdVars.clickThru]);
      });
    }

    //don't try to load again
    if (window[bgAdVars.bgImg] != undefined) {
      Drupal.DART.settings.bgAdLoaded = true;
    }
  }
};



/**
 * Display Ads.
 */
Drupal.behaviors.DART = {
  attach: function(context) {
    Drupal.DART.display_ads();
    Drupal.DART.loadBgAd(Drupal.settings.DART.bgAdVars);
  }
};

})(jQuery);

;
