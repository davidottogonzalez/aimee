/*
 * Chartbeat Scripts
 */
(function ($) {
  var chartbeat_domain = Drupal.settings.chartbeat_domain;
  var chartbeat_type = Drupal.settings.chartbeat_type;

  window._sf_async_config = {};
  /** CONFIGURATION START **/
  _sf_async_config.uid = 61038;
  _sf_async_config.domain = chartbeat_domain;
  _sf_async_config.useCanonical = true;

  if (chartbeat_type !== null) {
    _sf_async_config.type = chartbeat_type;
  } else if (typeof s == 'object') {
    if (typeof s.prop3 !== 'undefined') {
      _sf_async_config.type = s.prop3;
    }
  } else if (AdobeTracking !== 'undefined') {
    if (typeof AdobeTracking.contentType !== 'undefined') {
      _sf_async_config.type = AdobeTracking.contentType;
    }
  }

  if (typeof s == 'object') {
    if (typeof s.prop10 !== 'undefined') {
      _sf_async_config.sections = s.prop10;
    }
  } else if (AdobeTracking !== 'undefined') {
    if (typeof AdobeTracking.showSite !== 'undefined') {
      _sf_async_config.sections = AdobeTracking.showSite;
    }
  }

  _sf_async_config.authors = _sf_async_config.type;

  /** CONFIGURATION END **/
  (function() {
    function loadChartbeat() {
      window._sf_endpt = (new Date()).getTime();
      var e = document.createElement('script');
      e.setAttribute('language', 'javascript');
      e.setAttribute('type', 'text/javascript');
      e.setAttribute('src', '//static.chartbeat.com/js/chartbeat.js');
      document.body.appendChild(e);
    }
    var oldonload = window.onload;
    window.onload = (typeof window.onload != 'function') ?
      loadChartbeat : function() {
      oldonload();
      loadChartbeat();
    };
  })();
})(jQuery);
;
/* 
 * Umbel Scripts
 */
(function ($) {
  Drupal.behaviors.usanetwork_umbel = {
    attach: function (context, settings) {
      $('body').once(function () {

        umbel_env = Drupal.settings.umbel_env;
        if (umbel_env == '0') {
          window._umbel_test_mode = true;
        }

        umbelCode = Drupal.settings.umbel_code;
        umbelSettings = Drupal.settings.umbel_settings;

        window._umbel = window._umbel || [];
        (function () {
          var u = document.createElement('script');
          u.type = 'text/javascript';
          u.async = true;
          u.src = document.location.protocol + '//tags.api.umbel.com/' + umbelCode + '/w.js?d=' + new Date().getMonth() + '-' + new Date().getDate();
          var s = document.getElementsByTagName('script')[0];
          s.parentNode.insertBefore(u, s);
        })();

        settigngsParameter1 = umbelSettings.usa_umbel_param_1;
        settigngsParameter2 = umbelSettings.usa_umbel_param_2;
        settigngsParameter3 = umbelSettings.usa_umbel_param_3;

        if (typeof settigngsParameter1 != 'undefined') {
          umbelParameter1 = settigngsParameter1;
        } else if (typeof s == 'object') {
          if (typeof s.prop10 != 'undefined') {
            umbelParameter1 = s.prop10;
          }
        } else {
          if (typeof AdobeTracking.showSite !== 'undefined') {
            umbelParameter1 = AdobeTracking.showSite;
          } else {
            umbelParameter1 = "";
          }
        }

        if (typeof settigngsParameter2 != 'undefined') {
          umbelParameter2 = settigngsParameter2;
        } else if (typeof s == 'object') {
          if (typeof s.prop4 != 'undefined') {
            umbelParameter2 = s.prop4;
          }
        } else {
          if (typeof AdobeTracking.showSiteFeature !== 'undefined') {
            umbelParameter2 = AdobeTracking.showSiteFeature;
          } else {
            umbelParameter2 = "";
          }
        }

        if (typeof settigngsParameter3 != 'undefined') {
          umbelParameter3 = settigngsParameter3;
        } else if (typeof s == 'object') {
          if (typeof s.pageName != 'undefined') {
            umbelParameter3 = s.pageName;
          }
        } else {
          if (typeof AdobeTracking.pageName !== 'undefined') {
            umbelParameter3 = AdobeTracking.pageName;
          } else {
            umbelParameter3 = "";
          }
        }

        _umbel.push({
          "type": "send",
          "name": "action.tag",
          "value": [umbelParameter1, umbelParameter2, umbelParameter3]
        });
      });
    }
  }
})(jQuery);
;
