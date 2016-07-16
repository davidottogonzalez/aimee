var $ = jQuery;
var window_size_desktop_max_width = 2500;
var window_size_desktop_large = 1901;
var window_size_desktop = 1281;
var window_size_tablet_portrait = 769;
var window_size_tablet = 1025;
var window_size_mobile = 481;
var window_size_mobile_641 = 641;
//var show_carousel_margin = (window.innerWidth < window_size_tablet_portrait)? 40: 50;
var desktop_show_open_width = 1450;
var desktop_show_open_width_large = 2164;
var show_title_offset_desktop = 200;
var show_title_offset_tablet = 160;
//var show_title_offset = (window.innerWidth < window_size_tablet)? 160: 200;
var right_rail_min_height = 490;
// New breakpoint vars for window.matchMedia
// window.matchMedia("(min-width: " + 640 + "px)").matches = window.innerWidth > window_size_mobile_640
// window.matchMedia("(max-width: " + 640 + "px)").matches = window.innerWidth <= window_size_mobile_640
var window_size_desktop_max_width_2500 = 2500,
    window_size_desktop_large_1900 = 1900,
    window_size_desktop_1280 = 1280,
    window_size_tablet_1024 = 1024,
    window_size_tablet_portrait_768 = 768,
    show_carousel_margin = (window.matchMedia("(max-width: " + window_size_tablet_portrait_768 + "px)").matches) ? 40 : 50,
    window_size_mobile_640 = 640,
    window_size_mobile_480 = 480,
    show_title_offset = (window.matchMedia("(max-width: " + window_size_tablet_1024 + "px)").matches) ? 160 : 200;

var isIphone = navigator.userAgent.match(/iPhone/i) != null;

// change priority for events
$.fn.bindFirst = function (name, fn) {
  // bind as you normally would
  // don't want to miss out on any jQuery magic
  this.on(name, fn);

  // Thanks to a comment by @Martin, adding support for
  // namespaced events too.
  this.each(function () {
    var handlers = $._data(this, 'events')[name.split('.')[0]];
    // take out the handler we just inserted from the end
    var handler = handlers.pop();
    // move it at the beginning
    handlers.splice(0, 0, handler);
  });
};


// waitForFinalEvent
var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout(timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

//Example
//jQuery(window).scroll(function() {
//  waitForFinalEvent(function(){
//    positionFooter();
//  },100,"positioned footer");
//
//});

// end

// get param url
// example $.urlParam(name, url);
// name = string
// url = default window.location.href
$.urlParam = function (name, url) {
  var url = url || window.location.href,
      results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(url);
  if (results == null) {
    return null;
  }
  else {
    return results[1] || 0;
  }
};

function customParseURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return {
    source: url,
    protocol: a.protocol.replace(':', ''),
    host: a.hostname,
    port: a.port,
    query: a.search,
    params: (function () {
      var ret = {},
          seg = a.search.replace(/^\?/, '').split('&'),
          len = seg.length, i = 0, s;
      for (; i < len; i++) {
        if (!seg[i]) {
          continue;
        }
        s = seg[i].split('=');
        ret[s[0]] = s[1];
      }
      return ret;
    })(),
    file: (a.pathname.match(/\/([^\/?#]+)$/i) || [, ''])[1],
    hash: a.hash.replace('#', ''),
    path: a.pathname.replace(/^([^\/])/, '/$1'),
    relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [, ''])[1],
    segments: a.pathname.replace(/^\//, '').split('/')
  };
}


function getInternetExplorerVersion() {
  var rv = -1;
  if (navigator.appName == 'Microsoft Internet Explorer') {
    var ua = navigator.userAgent;
    var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat(RegExp.$1);
  }
  else if (navigator.appName == 'Netscape') {
    var ua = navigator.userAgent;
    var re = new RegExp("Trident/.*rv:([0-9]{1,}[\.0-9]{0,})");
    if (re.exec(ua) != null)
      rv = parseFloat(RegExp.$1);
  }
  return rv;
}

function scrollToAnchorName(targetName) {
  var $active = $('a[name="' + targetName + '"]');
  var navbarHeight = $('.region-header').height();
  $('html, body').animate({
    scrollTop: $active.position().top - navbarHeight - 20
  }, 1000);
}

$(window).bind('resize', function () {

  //show_carousel_margin = (window.innerWidth < window_size_tablet_portrait)? 40: 50;
  show_carousel_margin = (window.matchMedia("(max-width: " + window_size_tablet_portrait_768 + "px)").matches) ? 40 : 50;

});

$(document).ready(function () {

  $('.node-type-usanetwork-static-page .node-usanetwork-static-page a[href^="#"]').click(function (e) {
    e.preventDefault();
    var target = $(this).attr('href').substring(1);
    var targetName = target.substring(0);
    scrollToAnchorName(targetName);
  });

  $('.character-info-block .tabs li').click(function () {
    if (!$(this).hasClass('active')) {
      $('.character-info-block .tabs li').removeClass('active');
      $('.character-info-block .description-item').removeClass('active');
      $(this).addClass('active');
      var activeTab = $(this).attr('data-tab');
      $('.description-item[data-tab="' + activeTab + '"]').addClass('active');
    }
  });

  $(document).on('click', 'a[href$="enhanced"]', function(e){
    e.preventDefault();
    var parced_src = customParseURL(unescape($(this).attr('href')));
    if (parced_src.params.mobile_url && (usa_deviceInfo.smartphone || usa_deviceInfo.mobileDevice)) {
      setTimeout(function () {
        window.location = parced_src.params.mobile_url;
      }, 500);
    } else {
      setTimeout(function () {
        window.location = parced_src.path;
      }, 500);
    }
  });

});

// detect browser
function browserDetect() {

  var browserName = '';

  //Check if browser is IE or not
  if (navigator.userAgent.search("MSIE") >= 0) {
    browserName = 'msie';
  }
  //Check if browser is Chrome or not
  else if (navigator.userAgent.search("Chrome") >= 0) {
    browserName = 'chrome';
  }
  //Check if browser is Firefox or not
  else if (navigator.userAgent.search("Firefox") >= 0) {
    browserName = 'firefox';
  }
  //Check if browser is Safari or not
  else if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
    browserName = 'safari';
  }
  //Check if browser is Opera or not
  else if (navigator.userAgent.search("Opera") >= 0) {
    browserName = 'opera';
  }

  return browserName;
}

// Add Spin JS
// itemId - string, spinner block id
// bodyClass - string, body class
// color - set spinner color, default color #000000
function addSpinJs(itemId, bodyClass, color) {

  var currentColor = '#000000';

  if ($('body').hasClass(bodyClass)) {
    currentColor = color;
  }

  var opts = {
    lines: 13, // The number of lines to draw
    length: 0, // The length of each line
    width: 4, // The line thickness
    radius: 12, // The radius of the inner circle
    //width: 27, // The line thickness
    //radius: 54, // The radius of the inner circle
    corners: 1, // Corner roundness (0..1)
    rotate: 0, // The rotation offset
    direction: 1, // 1: clockwise, -1: counterclockwise
    color: currentColor, // #rgb or #rrggbb or array of colors
    speed: 1.3, // Rounds per second
    trail: 100, // Afterglow percentage
    shadow: false, // Whether to render a shadow
    hwaccel: false, // Whether to use hardware acceleration
    className: 'spinner', // The CSS class to assign to the spinner
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    top: '50%', // Top position relative to parent
    left: '50%' // Left position relative to parent
  };

  var target = document.getElementById(itemId);
  var spinner = new Spinner(opts).spin(target);
}
;
(function ($) {
  Drupal.behaviors.global_carousels = {
    carouselInit: function () {
      /*$('.carousel-vertical').hover(function () {
       var myScroll = new IScroll('.carousel-vertical', {
       mouseWheel: true
       });

       document.addEventListener('touchmove', function (e) {
       e.preventDefault();
       }, false);
       });*/

      /**
       * VERTICAL CAROUSELS INITIALIZATION
       */
      $('.carousel-vert').each(function () {
        var $container = $(this),
            $carousel = $container.find('ul').eq(0),
            carousel_id = $container.eq(0).attr('data-carousel-id');

        // Schedule page open-description-button click
        $('.carousel-vert .open-description').bind('click', function (e) {
          e.preventDefault();
          if ($(this).closest('li').hasClass('active')) {
            $('.carousel-vert li').removeClass('active');
          } else {
            $('.carousel-vert li').removeClass('active');
            $(this).closest('li').addClass('active');
          }
        });

        // Carousels initialization
        if (!$carousel.hasClass('stop')) {
          $container
              .on('jcarousel:createend', function () {
                $carousel.find('a').click(function (e) {
                  e.preventDefault();
                });

                $container.swipe({
                  excludedElements: "button, input, select, textarea, .noSwipe",
                  swipeUp: function () {
                    if (!$carousel.hasClass('stop')) {
                      if ($('.carousel-vert .open-description').closest('li').hasClass('active')) {
                        $('.carousel-vert li').removeClass('active');
                      }
                      $container.jcarousel('scroll', '+=2');
                    }
                  },
                  swipeDown: function () {
                    if (!$carousel.hasClass('stop')) {
                      if ($('.carousel-vert .open-description').closest('li').hasClass('active')) {
                        $('.carousel-vert li').removeClass('active');
                      }
                      $container.jcarousel('scroll', '-=2');
                    }
                  }
                });
              })
              .on('jcarousel:scroll', function (event, carousel) {
                $.each(carousel._items, function (i, v) {
                  if ($(v).hasClass('active')) {
                    Drupal.behaviors.global_carousels.showClose($(v));
                  }
                });
              })
              .jcarousel({
                vertical: true,
                animation: {
                  duration: 500,
                  easing: 'linear'
                },
                rtl: false
              });
        }

        Drupal.behaviors.global_carousels.carouselControlsInit('vert', carousel_id, $container, $carousel);
      });

      /**
       * LEFT CAROUSELS INITIALIZATION
       */
      $('.carousel-left').each(function () {
        var $container = $(this),
            $carousel = $container.find('ul').eq(0),
            carousel_id = $container.eq(0).attr('data-carousel-id');
        if ((!$carousel.hasClass('stop')) && (!$container.hasClass('destroy'))) {
          $container
              .on('jcarousel:createend', function () {
                $carousel.find('a').click(function (e) {
                  e.preventDefault();
                });
                $container.swipe({
                  excludedElements: "button, input, select, textarea, .noSwipe",
                  allowPageScroll: "vertical",
                  threshold: 50,
                  swipeRight: function () {
                    if (!$carousel.hasClass('stop')) {
                      var visible_item = $container.jcarousel('visible').index($container.find('li.first'));
                      if (visible_item >= 0 && !$container.hasClass('start')) {
                        Drupal.behaviors.global_carousels.swipeShowDescription($container);
                      }
                      var swipeElements = '-=' + Drupal.behaviors.global_carousels.swipeItems($carousel);
                      $container.jcarousel('scroll', swipeElements);
                    }
                  },
                  swipeLeft: function () {
                    var count = Drupal.behaviors.global_carousels.swipeItems($carousel);

                    if (!$carousel.hasClass('stop')) {
                      if ($container.hasClass('start')) {
                        if ($(window).width() <= 768) {
                          $container.jcarousel('scroll', '+=' + count);
                        } else {
                          if (Drupal.behaviors.global_carousels.checkFirstSlideOverflow($container)) {
                            Drupal.behaviors.global_carousels.swipeHideDescription($container);
                          } else {
                            Drupal.behaviors.global_carousels.swipeHideDescription($container);
                            $container.jcarousel('scroll', '+=' + count);
                          }
                        }
                      } else {
                        $container.jcarousel('scroll', '+=' + count);
                      }
                    }
                  },
                  tap: function (event, target) {

                    if ($(target).hasClass('slides')) {
                      return false;
                    }

                    var click_on_opened = $(target).closest('li.active').length > 0;
                    var tapHandler = function() {
                      if ($(target).attr('href')) {
                        if (!$(target).hasClass('show-open')) {
                          window.location = $(target).attr('href');
                        } else {
                          if ($container.hasClass('start')) {
                            Drupal.behaviors.global_carousels.swipeHideDescription($container);
                            setTimeout(function () {
                              Drupal.behaviors.global_carousels.showOpen($(target));
                            }, 600);
                          }
                          else {
                            Drupal.behaviors.global_carousels.showOpen($(target));
                          }
                        }
                      } else {
                        var link = $(target).closest('a');

                        if ($(target).find('a.show-open').length > 0) {
                          if ($container.hasClass('start')) {
                            Drupal.behaviors.global_carousels.swipeHideDescription($container);

                            setTimeout(function () {
                              Drupal.behaviors.global_carousels.showOpen($(target).find('a.show-open'));
                            }, 600);
                          }
                          else {
                            Drupal.behaviors.global_carousels.showOpen($(target).find('a.show-open'));
                          }
                        }

                        if (link.length == 0) {
                          return false;
                        }

                        if (!link.hasClass('show-open')) {
                          window.location = link.attr('href');
                        } else {
                          if ($container.hasClass('start')) {
                            Drupal.behaviors.global_carousels.swipeHideDescription($container);

                            setTimeout(function () {
                              Drupal.behaviors.global_carousels.showOpen($(target));
                            }, 600);
                          } else {
                            Drupal.behaviors.global_carousels.showOpen($(target));
                          }
                        }
                      }
                    };

                    if ((event instanceof MouseEvent) && event.button != 0) {
                      return false;
                    }

                    if (($carousel.find('li.active').length > 0) && ($carousel.hasClass('stop'))) {
                      $carousel.unbind('show:close');
                      $carousel.on('show:close', function() {
                        if ($(target).closest('a.show-open').hasClass('active')) {
                          $(target).closest('a.show-open').removeClass('active');
                          return false;
                        }
                        if (!$(target).closest('li.active').length > 0) {
                          $carousel.find('a.show-open.active').removeClass('active');
                          tapHandler();
                        }
                      });
                      Drupal.behaviors.global_carousels.showClose($carousel.find('li.active'));
                    } else {
                      tapHandler();
                    }
                  }
                });
              })
              .on('jcarousel:scroll', function (event, carousel) {
                $.each(carousel._items, function (i, v) {
                  if ($(v).hasClass('active')) {
                    Drupal.behaviors.global_carousels.showClose($(v));
                  }
                });
                $container.on('jcarousel:fullyvisiblein', 'li.first', function (event, carousel) {
                  if (!$carousel.hasClass('stop')) {
                    Drupal.behaviors.global_carousels.swipeShowDescription($container);
                  }
                });
              })
              .on('jcarousel:scrollend', function (event, carousel) {
                setTimeout(function(){
                  Drupal.behaviors.lazy_load_custom.galleryLazyLoadScroll(carousel._items);
                }, 500);
              })
              .on('jcarousel:reloadend', function (event, carousel) {
                $carousel.find('a').click(function (e) {
                  e.preventDefault();
                });
              })
              .jcarousel({
                animation: {
                  duration: 500,
                  easing: 'linear'
                },
                rtl: false
              });
        }

        Drupal.behaviors.global_carousels.carouselControlsInit('left', carousel_id, $container, $carousel);
      });

      /**
       * RIGHT CAROUSELS INITIALIZATION
       */
      $('.carousel-right').each(function () {
        var $container = $(this),
            $carousel = $container.find('ul').eq(0),
            carousel_id = $container.eq(0).attr('data-carousel-id');

        $container
            .on('jcarousel:createend', function () {
              $carousel.find('a').click(function (e) {
                e.preventDefault();
              });

              $carousel.css('left', '0px');
              $container.swipe({
                excludedElements: "button, input, select, textarea, .noSwipe",
                swipeLeft: function () {
                  var visible_item = $container.jcarousel('visible').index($container.find('li.first'))
                  if (visible_item >= 0 && !$container.hasClass('start')) {
                    Drupal.behaviors.global_carousels.swipeShowDescription($container);
                  }
                  var swipeElements = '-=' + Drupal.behaviors.global_carousels.swipeItems($carousel);
                  $container.jcarousel('scroll', swipeElements);
                },
                swipeRight: function () {
                  if ($container.hasClass('start')) {
                    Drupal.behaviors.global_carousels.swipeHideDescription($container);
                    var count = (Drupal.behaviors.global_carousels.swipeItems($carousel) <= 1) ? 1 : Drupal.behaviors.global_carousels.swipeItems($carousel) - 1;
                    $container.jcarousel('scroll', '+=' + count);
                  } else {
                    $container.jcarousel('scroll', '+=' + Drupal.behaviors.global_carousels.swipeItems($carousel));
                  }
                },
                tap: function (event, target) {
                  if ((event instanceof MouseEvent) && event.button != 0) {
                    return false;
                  }
                  if ($(target).attr('href')) {
                    window.location = $(target).attr('href');
                  } else {
                    var link = $(target).closest('a');
                    if (link.length == 0) {
                      return false;
                    }
                    window.location = link.attr('href');
                  }
                }
              });
            })
            .on('jcarousel:scroll', function (event, carousel) {
              $.each(carousel._items, function (i, v) {
                if ($(v).hasClass('active')) {
                  Drupal.behaviors.global_carousels.showClose($(v));
                }
              });
              $container.on('jcarousel:fullyvisiblein', 'li.first', function (event, carousel) {
                Drupal.behaviors.global_carousels.swipeShowDescription($container);
              })
            })
            .on('jcarousel:reloadend', function (event, carousel) {
              $carousel.find('a').click(function (e) {
                e.preventDefault();
              });

              $carousel.css('left', '0px');
            })
            .jcarousel({
              animation: {
                duration: 500,
                easing: 'linear'
              },
              rtl: true
            });

        Drupal.behaviors.global_carousels.carouselControlsInit('right', carousel_id, $container, $carousel);
      });

      // TODO: Unite right, left, vert initialization loops into one
      $('.carousel').each(function () {
        var $container = $(this),
            $carousel = $container.find('ul').eq(0),
            carousel_id = $container.eq(0).attr('data-carousel-id');
      });

    },
    carouselControlsInit: function (direction, carousel_id, $container, $carousel) {
      var carousel = '.carousel-' + direction + '[data-carousel-id="' + carousel_id + '"] ',
          prev_control = '.jcarousel-control-prev',
          next_control = '.jcarousel-control-next',
          first = carousel, second = carousel;

      if ((carousel_id) && (!$(carousel).hasClass('destroy'))) {
        /*if ((direction === 'left') || (direction === 'vert')) {
         first += prev_control;
         second += next_control;
         } else {
         first += next_control;
         second += prev_control;
         }*/
        first += prev_control;
        second += next_control;

        $(first + ', ' + second)
            .on('jcarouselcontrol:active', function () {
              $(this).removeClass('inactive');
            })
            .on('jcarouselcontrol:inactive', function () {
              $(this).addClass('inactive');
            });

        $(first).jcarouselControl({
          target: '-=' + Drupal.behaviors.global_carousels.swipeItems($carousel)
        });

        $(second)
            .on('click', function () {
              if ($(this).hasClass('inactive') && $(this).hasClass('jcarousel-control-prev')) {
                Drupal.behaviors.global_carousels.swipeShowDescription($container);
              }
            })
            .jcarouselControl({
              target: '+=' + Drupal.behaviors.global_carousels.swipeItems($carousel)
            });
      }
    },
    swipeItems: function (carousel) {
      var width = window.innerWidth,
          item_width = carousel.find('> li').eq(0).width() + parseInt(carousel.find('> li').eq(0).css('margin-right'));

      return Math.floor(width / item_width);
    },
    swipeHideDescription: function (element) {
      element.removeClass('start');
      element.prev().removeClass('start');
    },
    swipeShowDescription: function (element) {
      element.addClass('start');
      element.prev().addClass('start');
    },
    showOpen: function (target) {
      var current_item = target.closest('li');
      var current_item_show_open_link = current_item.find('a.show-open');
      var current_item_node = current_item.find('.node').eq(0);
      var carousel = target.closest('ul');
      var current_left = parseInt(carousel.css('left'));
      var width = desktop_show_open_width;
      var item_width = current_item.width();

      if (window.matchMedia("(min-width: " + window_size_desktop_large + "px)").matches) {

        var browserName = browserDetect(),
            widthDiff = window.innerWidth - $(window).innerWidth();

        if (browserName === 'safari' && window.innerWidth - widthDiff >= window_size_desktop_large) {
          width = desktop_show_open_width_large;
        } else if (browserName !== 'safari') {
          if (window.innerWidth >= window_size_desktop_large) {
            width = desktop_show_open_width_large;
          }
        }
      }

      if (window.matchMedia("(max-width: " + window_size_desktop_1280 + "px)").matches) {
        width = window.innerWidth - 2 * show_carousel_margin + item_width;
      }
      if (window.matchMedia("(max-width: " + window_size_mobile_480 + "px)").matches) {
        var scrollWidth = window.innerWidth - document.body.clientWidth;
        width = width + scrollWidth;
      }
      var width_block = width - item_width;
      var left = (window.innerWidth - width_block) / 2 - item_width - current_item.offset()['left'] + current_left;

      if(!current_item_node.hasClass('advert-enable')) {
        Drupal.behaviors.mpsSponsorShip.execSponsoredBlock(current_item_node);
      }

      carousel.velocity({ left: left }, 500, 'linear');
      current_item.velocity({ width: width }, {
        duration: 500,
        easing: 'easeInCubic',
        progress: function(elements, complete, remaining, start, tweenValue) {
          if (complete * 100 >= 60 && !current_item.hasClass('active')) {
            current_item.addClass('active');
          }
        }
      });

      current_item_show_open_link.addClass('active');
      current_item_node.addClass('open');
      current_item.find('.show-open').css('max-width', item_width);
      setTimeout(function () {
        current_item.find('.social-icons').show();
      }, 500);
      current_item.attr('data-left', current_left);
      current_item.attr('data-width', item_width);
      carousel.addClass('stop');

      Drupal.behaviors.omniture_tracking.showCardClick(current_item_node);

    },
    showClose: function (item) {
      var carousel = item.closest('ul');
      var current_item_node = item.find('.node').eq(0);
      var left = parseInt(item.attr('data-left'));
      var item_width = parseInt(item.attr('data-width'));
      current_item_node.removeClass('open');
      carousel.animate({left: left}, 500, 'easeOutQuint');
      item.velocity({ width: item_width }, {
        duration: 500,
        easing: 'easeOutQuint',
        progress: function(elements, complete, remaining, start, tweenValue) {
          if (complete * 100 >= 10 && item.hasClass('active')) {
            item.removeClass('active');
          }
          if (complete * 100 == 100) {
            item.removeAttr('style');
            item.find('.show-open').removeAttr('style');
            carousel.trigger('show:close');
          }
        }
      });
      item.find('.social-icons').hide();
      item.removeAttr('data-left');
      item.removeAttr('data-width');
      carousel.removeClass('stop');

      //if(window.innerWidth >= window_size_tablet_portrait ) {
      //  if (current_item_node.data('mpspath')) {
      //    Drupal.behaviors.mpsSponsorShip.removeExecSponsoredBlock(current_item_node);
      //  } else {
      //    Drupal.behaviors.mpsAdvert.homeShowsQueueRemoveAd(current_item_node);
      //  }
      //}

      //item.find('.show-open').unbind('click');
    },

    checkFirstSlideOverflow: function($carousel) {
      var first_slide_width = $carousel.find('ul.slides .first').width(),
          desc_width = $carousel.parent().find('.carousel-description-item').width(),
          window_width = $(window).width();

      return (first_slide_width + desc_width > window_width);
    },

    attach: function (context, settings) {


      $(window).bind('resize', function () {
        Drupal.behaviors.global_carousels.carouselInit();
      });

      //$(window).load(function () {
        Drupal.behaviors.global_carousels.carouselInit();

        $(".carousel.start .jcarousel-control-next").unbind('click');
        $(".carousel.start .jcarousel-control-next").click(function (e) {
          var $carousel = $(this).closest('.carousel'),
              overflow = Drupal.behaviors.global_carousels.checkFirstSlideOverflow($carousel),
              count;

          if ($carousel.length > 1) $carousel = $($carousel.get(0));

          e.preventDefault();

          count = (Drupal.behaviors.global_carousels.swipeItems($($carousel).find('ul')) <= 1)
            ? 1 : Drupal.behaviors.global_carousels.swipeItems($($carousel).find('ul')) - 1;

          if (overflow && $carousel.hasClass('start')) {
            Drupal.behaviors.global_carousels.swipeHideDescription($(this).parent());
          } else {
            Drupal.behaviors.global_carousels.swipeHideDescription($(this).parent());
            $carousel.jcarousel('scroll', '+=' + count);
          }
        });

        $(".carousel .jcarousel-control-prev").click(function (e) {
          if ($(this).hasClass('inactive') && !$(this).closest('.carousel').hasClass('start')){
            var carousel = $(this).closest('.carousel');

            Drupal.behaviors.global_carousels.swipeShowDescription(carousel);
          }
        });

      //});

    }
  };

}(jQuery));

;
/*
 * jQuery FlexSlider v2.2.0
 * Copyright 2012 WooThemes
 * Contributing Author: Tyler Smith
 */(function(e){e.flexslider=function(t,n){var r=e(t);r.vars=e.extend({},e.flexslider.defaults,n);var i=r.vars.namespace,s=window.navigator&&window.navigator.msPointerEnabled&&window.MSGesture,o=("ontouchstart"in window||s||window.DocumentTouch&&document instanceof DocumentTouch)&&r.vars.touch,u="click touchend MSPointerUp",a="",f,l=r.vars.direction==="vertical",c=r.vars.reverse,h=r.vars.itemWidth>0,p=r.vars.animation==="fade",d=r.vars.asNavFor!=="",v={},m=!0;e.data(t,"flexslider",r);v={init:function(){r.animating=!1;r.currentSlide=parseInt(r.vars.startAt?r.vars.startAt:0);isNaN(r.currentSlide)&&(r.currentSlide=0);r.animatingTo=r.currentSlide;r.atEnd=r.currentSlide===0||r.currentSlide===r.last;r.containerSelector=r.vars.selector.substr(0,r.vars.selector.search(" "));r.slides=e(r.vars.selector,r);r.container=e(r.containerSelector,r);r.count=r.slides.length;r.syncExists=e(r.vars.sync).length>0;r.vars.animation==="slide"&&(r.vars.animation="swing");r.prop=l?"top":"marginLeft";r.args={};r.manualPause=!1;r.stopped=!1;r.started=!1;r.startTimeout=null;r.transitions=!r.vars.video&&!p&&r.vars.useCSS&&function(){var e=document.createElement("div"),t=["perspectiveProperty","WebkitPerspective","MozPerspective","OPerspective","msPerspective"];for(var n in t)if(e.style[t[n]]!==undefined){r.pfx=t[n].replace("Perspective","").toLowerCase();r.prop="-"+r.pfx+"-transform";return!0}return!1}();r.vars.controlsContainer!==""&&(r.controlsContainer=e(r.vars.controlsContainer).length>0&&e(r.vars.controlsContainer));r.vars.manualControls!==""&&(r.manualControls=e(r.vars.manualControls).length>0&&e(r.vars.manualControls));if(r.vars.randomize){r.slides.sort(function(){return Math.round(Math.random())-.5});r.container.empty().append(r.slides)}r.doMath();r.setup("init");r.vars.controlNav&&v.controlNav.setup();r.vars.directionNav&&v.directionNav.setup();r.vars.keyboard&&(e(r.containerSelector).length===1||r.vars.multipleKeyboard)&&e(document).bind("keyup",function(e){var t=e.keyCode;if(!r.animating&&(t===39||t===37)){var n=t===39?r.getTarget("next"):t===37?r.getTarget("prev"):!1;r.flexAnimate(n,r.vars.pauseOnAction)}});r.vars.mousewheel&&r.bind("mousewheel",function(e,t,n,i){e.preventDefault();var s=t<0?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(s,r.vars.pauseOnAction)});r.vars.pausePlay&&v.pausePlay.setup();r.vars.slideshow&&r.vars.pauseInvisible&&v.pauseInvisible.init();if(r.vars.slideshow){r.vars.pauseOnHover&&r.hover(function(){!r.manualPlay&&!r.manualPause&&r.pause()},function(){!r.manualPause&&!r.manualPlay&&!r.stopped&&r.play()});if(!r.vars.pauseInvisible||!v.pauseInvisible.isHidden())r.vars.initDelay>0?r.startTimeout=setTimeout(r.play,r.vars.initDelay):r.play()}d&&v.asNav.setup();o&&r.vars.touch&&v.touch();(!p||p&&r.vars.smoothHeight)&&e(window).bind("resize orientationchange focus",v.resize);r.find("img").attr("draggable","false");setTimeout(function(){r.vars.start(r)},200)},asNav:{setup:function(){r.asNav=!0;r.animatingTo=Math.floor(r.currentSlide/r.move);r.currentItem=r.currentSlide;r.slides.removeClass(i+"active-slide").eq(r.currentItem).addClass(i+"active-slide");if(!s)r.slides.click(function(t){t.preventDefault();var n=e(this),s=n.index(),o=n.offset().left-e(r).scrollLeft();if(o<=0&&n.hasClass(i+"active-slide"))r.flexAnimate(r.getTarget("prev"),!0);else if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass(i+"active-slide")){r.direction=r.currentItem<s?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction,!1,!0,!0)}});else{t._slider=r;r.slides.each(function(){var t=this;t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",function(e){e.preventDefault();e.currentTarget._gesture&&e.currentTarget._gesture.addPointer(e.pointerId)},!1);t.addEventListener("MSGestureTap",function(t){t.preventDefault();var n=e(this),i=n.index();if(!e(r.vars.asNavFor).data("flexslider").animating&&!n.hasClass("active")){r.direction=r.currentItem<i?"next":"prev";r.flexAnimate(i,r.vars.pauseOnAction,!1,!0,!0)}})})}}},controlNav:{setup:function(){r.manualControls?v.controlNav.setupManual():v.controlNav.setupPaging()},setupPaging:function(){var t=r.vars.controlNav==="thumbnails"?"control-thumbs":"control-paging",n=1,s,o;r.controlNavScaffold=e('<ol class="'+i+"control-nav "+i+t+'"></ol>');if(r.pagingCount>1)for(var f=0;f<r.pagingCount;f++){o=r.slides.eq(f);s=r.vars.controlNav==="thumbnails"?'<img src="'+o.attr("data-thumb")+'"/>':"<a>"+n+"</a>";if("thumbnails"===r.vars.controlNav&&!0===r.vars.thumbCaptions){var l=o.attr("data-thumbcaption");""!=l&&undefined!=l&&(s+='<span class="'+i+'caption">'+l+"</span>")}r.controlNavScaffold.append("<li>"+s+"</li>");n++}r.controlsContainer?e(r.controlsContainer).append(r.controlNavScaffold):r.append(r.controlNavScaffold);v.controlNav.set();v.controlNav.active();r.controlNavScaffold.delegate("a, img",u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){r.direction=s>r.currentSlide?"next":"prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},setupManual:function(){r.controlNav=r.manualControls;v.controlNav.active();r.controlNav.bind(u,function(t){t.preventDefault();if(a===""||a===t.type){var n=e(this),s=r.controlNav.index(n);if(!n.hasClass(i+"active")){s>r.currentSlide?r.direction="next":r.direction="prev";r.flexAnimate(s,r.vars.pauseOnAction)}}a===""&&(a=t.type);v.setToClearWatchedEvent()})},set:function(){var t=r.vars.controlNav==="thumbnails"?"img":"a";r.controlNav=e("."+i+"control-nav li "+t,r.controlsContainer?r.controlsContainer:r)},active:function(){r.controlNav.removeClass(i+"active").eq(r.animatingTo).addClass(i+"active")},update:function(t,n){r.pagingCount>1&&t==="add"?r.controlNavScaffold.append(e("<li><a>"+r.count+"</a></li>")):r.pagingCount===1?r.controlNavScaffold.find("li").remove():r.controlNav.eq(n).closest("li").remove();v.controlNav.set();r.pagingCount>1&&r.pagingCount!==r.controlNav.length?r.update(n,t):v.controlNav.active()}},directionNav:{setup:function(){var t=e('<ul class="'+i+'direction-nav"><li><a class="'+i+'prev" href="#">'+r.vars.prevText+'</a></li><li><a class="'+i+'next" href="#">'+r.vars.nextText+"</a></li></ul>");if(r.controlsContainer){e(r.controlsContainer).append(t);r.directionNav=e("."+i+"direction-nav li a",r.controlsContainer)}else{r.append(t);r.directionNav=e("."+i+"direction-nav li a",r)}v.directionNav.update();r.directionNav.bind(u,function(t){t.preventDefault();var n;if(a===""||a===t.type){n=e(this).hasClass(i+"next")?r.getTarget("next"):r.getTarget("prev");r.flexAnimate(n,r.vars.pauseOnAction)}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(){var e=i+"disabled";r.pagingCount===1?r.directionNav.addClass(e).attr("tabindex","-1"):r.vars.animationLoop?r.directionNav.removeClass(e).removeAttr("tabindex"):r.animatingTo===0?r.directionNav.removeClass(e).filter("."+i+"prev").addClass(e).attr("tabindex","-1"):r.animatingTo===r.last?r.directionNav.removeClass(e).filter("."+i+"next").addClass(e).attr("tabindex","-1"):r.directionNav.removeClass(e).removeAttr("tabindex")}},pausePlay:{setup:function(){var t=e('<div class="'+i+'pauseplay"><a></a></div>');if(r.controlsContainer){r.controlsContainer.append(t);r.pausePlay=e("."+i+"pauseplay a",r.controlsContainer)}else{r.append(t);r.pausePlay=e("."+i+"pauseplay a",r)}v.pausePlay.update(r.vars.slideshow?i+"pause":i+"play");r.pausePlay.bind(u,function(t){t.preventDefault();if(a===""||a===t.type)if(e(this).hasClass(i+"pause")){r.manualPause=!0;r.manualPlay=!1;r.pause()}else{r.manualPause=!1;r.manualPlay=!0;r.play()}a===""&&(a=t.type);v.setToClearWatchedEvent()})},update:function(e){e==="play"?r.pausePlay.removeClass(i+"pause").addClass(i+"play").html(r.vars.playText):r.pausePlay.removeClass(i+"play").addClass(i+"pause").html(r.vars.pauseText)}},touch:function(){var e,n,i,o,u,a,f=!1,d=0,v=0,m=0;if(!s){t.addEventListener("touchstart",g,!1);function g(s){if(r.animating)s.preventDefault();else if(window.navigator.msPointerEnabled||s.touches.length===1){r.pause();o=l?r.h:r.w;a=Number(new Date);d=s.touches[0].pageX;v=s.touches[0].pageY;i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o;e=l?v:d;n=l?d:v;t.addEventListener("touchmove",y,!1);t.addEventListener("touchend",b,!1)}}function y(t){d=t.touches[0].pageX;v=t.touches[0].pageY;u=l?e-v:e-d;f=l?Math.abs(u)<Math.abs(d-n):Math.abs(u)<Math.abs(v-n);var s=500;if(!f||Number(new Date)-a>s){t.preventDefault();if(!p&&r.transitions){r.vars.animationLoop||(u/=r.currentSlide===0&&u<0||r.currentSlide===r.last&&u>0?Math.abs(u)/o+2:1);r.setProps(i+u,"setTouch")}}}function b(s){t.removeEventListener("touchmove",y,!1);if(r.animatingTo===r.currentSlide&&!f&&u!==null){var l=c?-u:u,h=l>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(h)&&(Number(new Date)-a<550&&Math.abs(l)>50||Math.abs(l)>o/2)?r.flexAnimate(h,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}t.removeEventListener("touchend",b,!1);e=null;n=null;u=null;i=null}}else{t.style.msTouchAction="none";t._gesture=new MSGesture;t._gesture.target=t;t.addEventListener("MSPointerDown",w,!1);t._slider=r;t.addEventListener("MSGestureChange",E,!1);t.addEventListener("MSGestureEnd",S,!1);function w(e){e.stopPropagation();if(r.animating)e.preventDefault();else{r.pause();t._gesture.addPointer(e.pointerId);m=0;o=l?r.h:r.w;a=Number(new Date);i=h&&c&&r.animatingTo===r.last?0:h&&c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:h&&r.currentSlide===r.last?r.limit:h?(r.itemW+r.vars.itemMargin)*r.move*r.currentSlide:c?(r.last-r.currentSlide+r.cloneOffset)*o:(r.currentSlide+r.cloneOffset)*o}}function E(e){e.stopPropagation();var n=e.target._slider;if(!n)return;var r=-e.translationX,s=-e.translationY;m+=l?s:r;u=m;f=l?Math.abs(m)<Math.abs(-r):Math.abs(m)<Math.abs(-s);if(e.detail===e.MSGESTURE_FLAG_INERTIA){setImmediate(function(){t._gesture.stop()});return}if(!f||Number(new Date)-a>500){e.preventDefault();if(!p&&n.transitions){n.vars.animationLoop||(u=m/(n.currentSlide===0&&m<0||n.currentSlide===n.last&&m>0?Math.abs(m)/o+2:1));n.setProps(i+u,"setTouch")}}}function S(t){t.stopPropagation();var r=t.target._slider;if(!r)return;if(r.animatingTo===r.currentSlide&&!f&&u!==null){var s=c?-u:u,l=s>0?r.getTarget("next"):r.getTarget("prev");r.canAdvance(l)&&(Number(new Date)-a<550&&Math.abs(s)>50||Math.abs(s)>o/2)?r.flexAnimate(l,r.vars.pauseOnAction):p||r.flexAnimate(r.currentSlide,r.vars.pauseOnAction,!0)}e=null;n=null;u=null;i=null;m=0}}},resize:function(){if(!r.animating&&r.is(":visible")){h||r.doMath();if(p)v.smoothHeight();else if(h){r.slides.width(r.computedW);r.update(r.pagingCount);r.setProps()}else if(l){r.viewport.height(r.h);r.setProps(r.h,"setTotal")}else{r.vars.smoothHeight&&v.smoothHeight();r.newSlides.width(r.computedW);r.setProps(r.computedW,"setTotal")}}},smoothHeight:function(e){if(!l||p){var t=p?r:r.viewport;e?t.animate({height:r.slides.eq(r.animatingTo).height()},e):t.height(r.slides.eq(r.animatingTo).height())}},sync:function(t){var n=e(r.vars.sync).data("flexslider"),i=r.animatingTo;switch(t){case"animate":n.flexAnimate(i,r.vars.pauseOnAction,!1,!0);break;case"play":!n.playing&&!n.asNav&&n.play();break;case"pause":n.pause()}},pauseInvisible:{visProp:null,init:function(){var e=["webkit","moz","ms","o"];if("hidden"in document)return"hidden";for(var t=0;t<e.length;t++)e[t]+"Hidden"in document&&(v.pauseInvisible.visProp=e[t]+"Hidden");if(v.pauseInvisible.visProp){var n=v.pauseInvisible.visProp.replace(/[H|h]idden/,"")+"visibilitychange";document.addEventListener(n,function(){v.pauseInvisible.isHidden()?r.startTimeout?clearTimeout(r.startTimeout):r.pause():r.started?r.play():r.vars.initDelay>0?setTimeout(r.play,r.vars.initDelay):r.play()})}},isHidden:function(){return document[v.pauseInvisible.visProp]||!1}},setToClearWatchedEvent:function(){clearTimeout(f);f=setTimeout(function(){a=""},3e3)}};r.flexAnimate=function(t,n,s,u,a){!r.vars.animationLoop&&t!==r.currentSlide&&(r.direction=t>r.currentSlide?"next":"prev");d&&r.pagingCount===1&&(r.direction=r.currentItem<t?"next":"prev");if(!r.animating&&(r.canAdvance(t,a)||s)&&r.is(":visible")){if(d&&u){var f=e(r.vars.asNavFor).data("flexslider");r.atEnd=t===0||t===r.count-1;f.flexAnimate(t,!0,!1,!0,a);r.direction=r.currentItem<t?"next":"prev";f.direction=r.direction;if(Math.ceil((t+1)/r.visible)-1===r.currentSlide||t===0){r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");return!1}r.currentItem=t;r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");t=Math.floor(t/r.visible)}r.animating=!0;r.animatingTo=t;n&&r.pause();r.vars.before(r);r.syncExists&&!a&&v.sync("animate");r.vars.controlNav&&v.controlNav.active();h||r.slides.removeClass(i+"active-slide").eq(t).addClass(i+"active-slide");r.atEnd=t===0||t===r.last;r.vars.directionNav&&v.directionNav.update();if(t===r.last){r.vars.end(r);r.vars.animationLoop||r.pause()}if(!p){var m=l?r.slides.filter(":first").height():r.computedW,g,y,b;if(h){g=r.vars.itemMargin;b=(r.itemW+g)*r.move*r.animatingTo;y=b>r.limit&&r.visible!==1?r.limit:b}else r.currentSlide===0&&t===r.count-1&&r.vars.animationLoop&&r.direction!=="next"?y=c?(r.count+r.cloneOffset)*m:0:r.currentSlide===r.last&&t===0&&r.vars.animationLoop&&r.direction!=="prev"?y=c?0:(r.count+1)*m:y=c?(r.count-1-t+r.cloneOffset)*m:(t+r.cloneOffset)*m;r.setProps(y,"",r.vars.animationSpeed);if(r.transitions){if(!r.vars.animationLoop||!r.atEnd){r.animating=!1;r.currentSlide=r.animatingTo}r.container.unbind("webkitTransitionEnd transitionend");r.container.bind("webkitTransitionEnd transitionend",function(){r.wrapup(m)})}else r.container.animate(r.args,r.vars.animationSpeed,r.vars.easing,function(){r.wrapup(m)})}else if(!o){r.slides.eq(r.currentSlide).css({zIndex:1}).animate({opacity:0},r.vars.animationSpeed,r.vars.easing);r.slides.eq(t).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing,r.wrapup)}else{r.slides.eq(r.currentSlide).css({opacity:0,zIndex:1});r.slides.eq(t).css({opacity:1,zIndex:2});r.wrapup(m)}r.vars.smoothHeight&&v.smoothHeight(r.vars.animationSpeed)}};r.wrapup=function(e){!p&&!h&&(r.currentSlide===0&&r.animatingTo===r.last&&r.vars.animationLoop?r.setProps(e,"jumpEnd"):r.currentSlide===r.last&&r.animatingTo===0&&r.vars.animationLoop&&r.setProps(e,"jumpStart"));r.animating=!1;r.currentSlide=r.animatingTo;r.vars.after(r)};r.animateSlides=function(){!r.animating&&m&&r.flexAnimate(r.getTarget("next"))};r.pause=function(){clearInterval(r.animatedSlides);r.animatedSlides=null;r.playing=!1;r.vars.pausePlay&&v.pausePlay.update("play");r.syncExists&&v.sync("pause")};r.play=function(){r.playing&&clearInterval(r.animatedSlides);r.animatedSlides=r.animatedSlides||setInterval(r.animateSlides,r.vars.slideshowSpeed);r.started=r.playing=!0;r.vars.pausePlay&&v.pausePlay.update("pause");r.syncExists&&v.sync("play")};r.stop=function(){r.pause();r.stopped=!0};r.canAdvance=function(e,t){var n=d?r.pagingCount-1:r.last;return t?!0:d&&r.currentItem===r.count-1&&e===0&&r.direction==="prev"?!0:d&&r.currentItem===0&&e===r.pagingCount-1&&r.direction!=="next"?!1:e===r.currentSlide&&!d?!1:r.vars.animationLoop?!0:r.atEnd&&r.currentSlide===0&&e===n&&r.direction!=="next"?!1:r.atEnd&&r.currentSlide===n&&e===0&&r.direction==="next"?!1:!0};r.getTarget=function(e){r.direction=e;return e==="next"?r.currentSlide===r.last?0:r.currentSlide+1:r.currentSlide===0?r.last:r.currentSlide-1};r.setProps=function(e,t,n){var i=function(){var n=e?e:(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo,i=function(){if(h)return t==="setTouch"?e:c&&r.animatingTo===r.last?0:c?r.limit-(r.itemW+r.vars.itemMargin)*r.move*r.animatingTo:r.animatingTo===r.last?r.limit:n;switch(t){case"setTotal":return c?(r.count-1-r.currentSlide+r.cloneOffset)*e:(r.currentSlide+r.cloneOffset)*e;case"setTouch":return c?e:e;case"jumpEnd":return c?e:r.count*e;case"jumpStart":return c?r.count*e:e;default:return e}}();return i*-1+"px"}();if(r.transitions){i=l?"translate3d(0,"+i+",0)":"translate3d("+i+",0,0)";n=n!==undefined?n/1e3+"s":"0s";r.container.css("-"+r.pfx+"-transition-duration",n)}r.args[r.prop]=i;(r.transitions||n===undefined)&&r.container.css(r.args)};r.setup=function(t){if(!p){var n,s;if(t==="init"){r.viewport=e('<div class="'+i+'viewport"></div>').css({overflow:"hidden",position:"relative"}).appendTo(r).append(r.container);r.cloneCount=0;r.cloneOffset=0;if(c){s=e.makeArray(r.slides).reverse();r.slides=e(s);r.container.empty().append(r.slides)}}if(r.vars.animationLoop&&!h){r.cloneCount=2;r.cloneOffset=1;t!=="init"&&r.container.find(".clone").remove();r.container.append(r.slides.first().clone().addClass("clone").attr("aria-hidden","true")).prepend(r.slides.last().clone().addClass("clone").attr("aria-hidden","true"))}r.newSlides=e(r.vars.selector,r);n=c?r.count-1-r.currentSlide+r.cloneOffset:r.currentSlide+r.cloneOffset;if(l&&!h){r.container.height((r.count+r.cloneCount)*200+"%").css("position","absolute").width("100%");setTimeout(function(){r.newSlides.css({display:"block"});r.doMath();r.viewport.height(r.h);r.setProps(n*r.h,"init")},t==="init"?100:0)}else{r.container.width((r.count+r.cloneCount)*200+"%");r.setProps(n*r.computedW,"init");setTimeout(function(){r.doMath();r.newSlides.css({width:r.computedW,"float":"left",display:"block"});r.vars.smoothHeight&&v.smoothHeight()},t==="init"?100:0)}}else{r.slides.css({width:"100%","float":"left",marginRight:"-100%",position:"relative"});t==="init"&&(o?r.slides.css({opacity:0,display:"block",webkitTransition:"opacity "+r.vars.animationSpeed/1e3+"s ease",zIndex:1}).eq(r.currentSlide).css({opacity:1,zIndex:2}):r.slides.css({opacity:0,display:"block",zIndex:1}).eq(r.currentSlide).css({zIndex:2}).animate({opacity:1},r.vars.animationSpeed,r.vars.easing));r.vars.smoothHeight&&v.smoothHeight()}h||r.slides.removeClass(i+"active-slide").eq(r.currentSlide).addClass(i+"active-slide")};r.doMath=function(){var e=r.slides.first(),t=r.vars.itemMargin,n=r.vars.minItems,i=r.vars.maxItems;r.w=r.viewport===undefined?r.width():r.viewport.width();r.h=e.height();r.boxPadding=e.outerWidth()-e.width();if(h){r.itemT=r.vars.itemWidth+t;r.minW=n?n*r.itemT:r.w;r.maxW=i?i*r.itemT-t:r.w;r.itemW=r.minW>r.w?(r.w-t*(n-1))/n:r.maxW<r.w?(r.w-t*(i-1))/i:r.vars.itemWidth>r.w?r.w:r.vars.itemWidth;r.visible=Math.floor(r.w/r.itemW);r.move=r.vars.move>0&&r.vars.move<r.visible?r.vars.move:r.visible;r.pagingCount=Math.ceil((r.count-r.visible)/r.move+1);r.last=r.pagingCount-1;r.limit=r.pagingCount===1?0:r.vars.itemWidth>r.w?r.itemW*(r.count-1)+t*(r.count-1):(r.itemW+t)*r.count-r.w-t}else{r.itemW=r.w;r.pagingCount=r.count;r.last=r.count-1}r.computedW=r.itemW-r.boxPadding};r.update=function(e,t){r.doMath();if(!h){e<r.currentSlide?r.currentSlide+=1:e<=r.currentSlide&&e!==0&&(r.currentSlide-=1);r.animatingTo=r.currentSlide}if(r.vars.controlNav&&!r.manualControls)if(t==="add"&&!h||r.pagingCount>r.controlNav.length)v.controlNav.update("add");else if(t==="remove"&&!h||r.pagingCount<r.controlNav.length){if(h&&r.currentSlide>r.last){r.currentSlide-=1;r.animatingTo-=1}v.controlNav.update("remove",r.last)}r.vars.directionNav&&v.directionNav.update()};r.addSlide=function(t,n){var i=e(t);r.count+=1;r.last=r.count-1;l&&c?n!==undefined?r.slides.eq(r.count-n).after(i):r.container.prepend(i):n!==undefined?r.slides.eq(n).before(i):r.container.append(i);r.update(n,"add");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.added(r)};r.removeSlide=function(t){var n=isNaN(t)?r.slides.index(e(t)):t;r.count-=1;r.last=r.count-1;isNaN(t)?e(t,r.slides).remove():l&&c?r.slides.eq(r.last).remove():r.slides.eq(t).remove();r.doMath();r.update(n,"remove");r.slides=e(r.vars.selector+":not(.clone)",r);r.setup();r.vars.removed(r)};v.init()};e(window).blur(function(e){focused=!1}).focus(function(e){focused=!0});e.flexslider.defaults={namespace:"flex-",selector:".slides > li",animation:"fade",easing:"swing",direction:"horizontal",reverse:!1,animationLoop:!0,smoothHeight:!1,startAt:0,slideshow:!0,slideshowSpeed:7e3,animationSpeed:600,initDelay:0,randomize:!1,thumbCaptions:!1,pauseOnAction:!0,pauseOnHover:!1,pauseInvisible:!0,useCSS:!0,touch:!0,video:!1,controlNav:!0,directionNav:!0,prevText:"Previous",nextText:"Next",keyboard:!0,multipleKeyboard:!1,mousewheel:!1,pausePlay:!1,pauseText:"Pause",playText:"Play",controlsContainer:"",manualControls:"",sync:"",asNavFor:"",itemWidth:0,itemMargin:0,minItems:1,maxItems:0,move:0,allowOneSlide:!0,start:function(){},before:function(){},after:function(){},end:function(){},added:function(){},removed:function(){}};e.fn.flexslider=function(t){t===undefined&&(t={});if(typeof t=="object")return this.each(function(){var n=e(this),r=t.selector?t.selector:".slides > li",i=n.find(r);if(i.length===1&&t.allowOneSlide===!0||i.length===0){i.fadeIn(400);t.start&&t.start(n)}else n.data("flexslider")===undefined&&new e.flexslider(this,t)});var n=e(this).data("flexslider");switch(t){case"play":n.play();break;case"pause":n.pause();break;case"stop":n.stop();break;case"next":n.flexAnimate(n.getTarget("next"),!0);break;case"prev":case"previous":n.flexAnimate(n.getTarget("prev"),!0);break;default:typeof t=="number"&&n.flexAnimate(t,!0)}}})(jQuery);
;
/*! jRespond.js v 0.10 | Author: Jeremy Fields [jeremy.fields@viget.com], 2013 | License: MIT */
(function(b,a,c){b.jRespond=function(h){var i=[];var n=[];var g=h;var t="";var m="";var d;var e=0;var o=100;var f=500;var r=f;var k=function(){var v=0;if(typeof(window.innerWidth)!="number"){if(!(document.documentElement.clientWidth===0)){v=document.documentElement.clientWidth}else{v=document.body.clientWidth}}else{v=window.innerWidth}return v};var j=function(w){if(w.length===c){u(w)}else{for(var v=0;v<w.length;v++){u(w[v])}}};var u=function(x){var w=x.breakpoint;var v=x.enter||c;i.push(x);n.push(false);if(q(w)){if(v!==c){v.call(null,{entering:t,exiting:m})}n[(i.length-1)]=true}};var s=function(){var A=[];var v=[];for(var C=0;C<i.length;C++){var D=i[C]["breakpoint"];var x=i[C]["enter"]||c;var w=i[C]["exit"]||c;if(D==="*"){if(x!==c){A.push(x)}if(w!==c){v.push(w)}}else{if(q(D)){if(x!==c&&!n[C]){A.push(x)}n[C]=true}else{if(w!==c&&n[C]){v.push(w)}n[C]=false}}}var y={entering:t,exiting:m};for(var B=0;B<v.length;B++){v[B].call(null,y)}for(var z=0;z<A.length;z++){A[z].call(null,y)}};var p=function(w){var x=false;for(var v=0;v<g.length;v++){if(w>=g[v]["enter"]&&w<=g[v]["exit"]){x=true;break}}if(x&&t!==g[v]["label"]){m=t;t=g[v]["label"];s()}else{if(!x&&t!==""){t="";s()}}};var q=function(v){if(typeof v==="object"){if(v.join().indexOf(t)>=0){return true}}else{if(v==="*"){return true}else{if(typeof v==="string"){if(t===v){return true}}}}};var l=function(){var v=k();if(v!==e){r=o;p(v)}else{r=f}e=v;setTimeout(l,r)};l();return{addFunc:function(v){j(v)},getBreakpoint:function(){return t}}}}(this,this.document));
;
/**
  *
  * jPanelMenu 1.3.0 (http://jpanelmenu.com)
  * By Anthony Colangelo (http://acolangelo.com)
  *
* */

(function($){
  $.jPanelMenu = function(options) {
    if ( typeof(options) == "undefined" || options == null ) { options = {}; };

    var jP = {
      options: $.extend({
        menu: '#menu',
        trigger: '.menu-trigger',
        excludedPanelContent: 'style, script',

        direction: 'left',
        openPosition: '250px',
        animated: true,
        closeOnContentClick: true,

        keyboardShortcuts: [
          {
            code: 27,
            open: false,
            close: true
          },
          {
            code: 37,
            open: false,
            close: true
          },
          {
            code: 39,
            open: true,
            close: true
          },
          {
            code: 77,
            open: true,
            close: true
          }
        ],

        duration: 150,
        openDuration: options.duration || 150,
        closeDuration: options.duration || 150,

        easing: 'ease-in-out',
        openEasing: options.easing || 'ease-in-out',
        closeEasing: options.easing || 'ease-in-out',

        before: function(){ },
        beforeOpen: function(){ },
        beforeClose: function(){ },

        after: function(){ },
        afterOpen: function(){ },
        afterClose: function(){ },

        beforeOn: function(){ },
        afterOn: function(){ },

        beforeOff: function(){ },
        afterOff: function(){ }
      },options),

      settings: {
        transitionsSupported: 'WebkitTransition' in document.body.style ||
                    'MozTransition' in document.body.style ||
                    'msTransition' in document.body.style ||
                    'OTransition' in document.body.style ||
                    'Transition' in document.body.style
        ,
        shiftFixedChildren: false,
        panelPosition: 'relative',
        positionUnits: 'px'
      },

      menu: '#jPanelMenu-menu',

      panel: '.jPanelMenu-panel',

      fixedChildren: [],

      timeouts: {},

      clearTimeouts: function() {
        clearTimeout(jP.timeouts.open);
        clearTimeout(jP.timeouts.afterOpen);
        clearTimeout(jP.timeouts.afterClose);
      },

      setPositionUnits: function() {
        var foundUnit = false,
          allowedUnits = ['%','px','em']
        ;

        for ( unitID in allowedUnits ) {
          var unit = allowedUnits[unitID];
          if ( jP.options.openPosition.toString().substr(-unit.length) == unit )
          {
            foundUnit = true;
            jP.settings.positionUnits = unit;
          }
        }

        if ( !foundUnit ) { jP.options.openPosition = parseInt(jP.options.openPosition) + jP.settings.positionUnits }
      },

      checkFixedChildren: function() {
        jP.disableTransitions();

        var defaultPanelStyle = { position: $(jP.panel).css('position') };

        defaultPanelStyle[jP.options.direction] = ($(jP.panel).css(jP.options.direction) == 'auto')?0:$(jP.panel).css(jP.options.direction);

        $(jP.panel).find('> *').each(function(){
          if ( $(this).css('position') == 'fixed' && $(this).css(jP.options.direction) == 'auto' ) { jP.fixedChildren.push(this); }
        });

        if ( jP.fixedChildren.length > 0 )
        {
          var newPanelStyle = { position: 'relative' };
          newPanelStyle[jP.options.direction] = '1px';
          jP.setPanelStyle(newPanelStyle);

          if ( parseInt($(jP.fixedChildren[0]).offset().left) == 0 ) { jP.settings.shiftFixedChildren = true; }
        }

        jP.setPanelStyle(defaultPanelStyle);
      },

      setjPanelMenuStyles: function() {
        var bgColor = '#fff';
        var htmlBG = $('html').css('background-color');
        var bodyBG = $('body').css('background-color');

        if ( bodyBG != 'transparent' && bodyBG != "rgba(0, 0, 0, 0)") { bgColor = bodyBG; }
        else if ( htmlBG != 'transparent' && htmlBG != "rgba(0, 0, 0, 0)") { bgColor = htmlBG; }
        else { bgColor = '#fff'; }

        if ( $('#jPanelMenu-style-master').length == 0 )
        {
          $('body').append('<style id="jPanelMenu-style-master">body{width:100%}.jPanelMenu,body{overflow-x:hidden}#jPanelMenu-menu{display:block;position:fixed;top:0;'+jP.options.direction+':0;height:100%;z-index:-1;overflow-x:hidden;overflow-y:scroll;-webkit-overflow-scrolling:touch}.jPanelMenu-panel{position:static;'+jP.options.direction+':0;top:0;z-index:2;width:100%;min-height:100%;background:' + bgColor + '}</style>');
        }
      },

      setMenuState: function(open) {
        var position = (open)?'open':'closed';
        $('body').attr('data-menu-position', position);
      },

      getMenuState: function() {
        return $('body').attr('data-menu-position');
      },

      menuIsOpen: function() {
        if ( jP.getMenuState() == 'open' ) return true;
        else return false;
      },

      setMenuStyle: function(styles) {
        $(jP.menu).css(styles);
      },

      setPanelStyle: function(styles) {
        $(jP.panel).css(styles);
      },

      showMenu: function() {
        jP.setMenuStyle({
          display: 'block'
        });
        jP.setMenuStyle({
          'z-index': '1'
        });
      },

      hideMenu: function() {
        jP.setMenuStyle({
          'z-index': '-1'
        });
        jP.setMenuStyle({
          display: 'none'
        });
      },

      enableTransitions: function(duration, easing) {
        var formattedDuration = duration/1000;
        var formattedEasing = jP.getCSSEasingFunction(easing);
        jP.disableTransitions();
        $('body').append('<style id="jPanelMenu-style-transitions">.jPanelMenu-panel{-webkit-transition: all ' + formattedDuration + 's ' + formattedEasing + '; -moz-transition: all ' + formattedDuration + 's ' + formattedEasing + '; -o-transition: all ' + formattedDuration + 's ' + formattedEasing + '; transition: all ' + formattedDuration + 's ' + formattedEasing + ';}</style>');
      },

      disableTransitions: function() {
        $('#jPanelMenu-style-transitions').remove();
      },

      enableFixedTransitions: function(selector, id, duration, easing) {
        var formattedDuration = duration/1000;
        var formattedEasing = jP.getCSSEasingFunction(easing);
        jP.disableFixedTransitions(id);
        $('body').append('<style id="jPanelMenu-style-fixed-' + id + '">' + selector + '{-webkit-transition: all ' + formattedDuration + 's ' + formattedEasing + '; -moz-transition: all ' + formattedDuration + 's ' + formattedEasing + '; -o-transition: all ' + formattedDuration + 's ' + formattedEasing + '; transition: all ' + formattedDuration + 's ' + formattedEasing + ';}</style>');
      },

      disableFixedTransitions: function(id) {
        $('#jPanelMenu-style-fixed-' + id).remove();
      },

      getCSSEasingFunction: function(name) {
        switch ( name )
        {
          case 'linear':
            return name;
            break;

          case 'ease':
            return name;
            break;

          case 'ease-in':
            return name;
            break;

          case 'ease-out':
            return name;
            break;

          case 'ease-in-out':
            return name;
            break;

          default:
            return 'ease-in-out';
            break;
        }
      },

      getJSEasingFunction: function(name) {
        switch ( name )
        {
          case 'linear':
            return name;
            break;

          default:
            return 'swing';
            break;
        }
      },

      openMenu: function(animated) {
        if ( typeof(animated) == "undefined" || animated == null ) { animated = jP.options.animated };

        jP.clearTimeouts();

        jP.options.before();
        jP.options.beforeOpen();

        jP.setMenuState(true);

        jP.setPanelStyle({ position: 'relative' });

        jP.showMenu();

        var animationChecks = {
          none: (!animated)?true:false,
          transitions: (animated && jP.settings.transitionsSupported)?true:false
        };

        if ( animationChecks.transitions || animationChecks.none ) {
          if ( animationChecks.none ) jP.disableTransitions();
          if ( animationChecks.transitions ) jP.enableTransitions(jP.options.openDuration, jP.options.openEasing);

          var newPanelStyle = {};
          newPanelStyle[jP.options.direction] = jP.options.openPosition;
          jP.setPanelStyle(newPanelStyle);

          if ( jP.settings.shiftFixedChildren )
          {
            $(jP.fixedChildren).each(function(){
              var id = $(this).prop("tagName").toLowerCase() + ' ' + $(this).attr('class'),
                selector = id.replace(' ','.'),
                id = id.replace(' ','-')
              ;

              if ( animationChecks.none ) jP.disableFixedTransitions(id);
              if ( animationChecks.transitions ) jP.enableFixedTransitions(selector, id, jP.options.openDuration, jP.options.openEasing);

              var newChildrenStyle = {};
              newChildrenStyle[jP.options.direction] = jP.options.openPosition;
              $(this).css(newChildrenStyle);
            });
          }

          jP.timeouts.afterOpen = setTimeout(function(){
            jP.disableTransitions();
            if ( jP.settings.shiftFixedChildren )
            {
              $(jP.fixedChildren).each(function(){
                var id = $(this).prop("tagName").toLowerCase() + ' ' + $(this).attr('class'),
                  id = id.replace(' ','-')
                ;

                jP.disableFixedTransitions(id);
              });
            }

            jP.options.after();
            jP.options.afterOpen();
            jP.initiateContentClickListeners();
          }, jP.options.openDuration);
        }
        else {
          var formattedEasing = jP.getJSEasingFunction(jP.options.openEasing);

          var animationOptions = {};
          animationOptions[jP.options.direction] = jP.options.openPosition;
          $(jP.panel).stop().animate(animationOptions, jP.options.openDuration, formattedEasing, function(){
            jP.options.after();
            jP.options.afterOpen();
            jP.initiateContentClickListeners();
          });

          if ( jP.settings.shiftFixedChildren )
          {
            $(jP.fixedChildren).each(function(){
              var childrenAnimationOptions = {};
              childrenAnimationOptions[jP.options.direction] = jP.options.openPosition;
              $(this).stop().animate(childrenAnimationOptions, jP.options.openDuration, formattedEasing);
            });
          }
        }
      },

      closeMenu: function(animated) {
        if ( typeof(animated) == "undefined" || animated == null ) { animated = jP.options.animated };

        jP.clearTimeouts();

        jP.options.before();
        jP.options.beforeClose();

        jP.setMenuState(false);

        var animationChecks = {
          none: (!animated)?true:false,
          transitions: (animated && jP.settings.transitionsSupported)?true:false
        };

        if ( animationChecks.transitions || animationChecks.none ) {
          if ( animationChecks.none ) jP.disableTransitions();
          if ( animationChecks.transitions ) jP.enableTransitions(jP.options.closeDuration, jP.options.closeEasing);

          var newPanelStyle = {};
          newPanelStyle[jP.options.direction] = 0 + jP.settings.positionUnits;
          jP.setPanelStyle(newPanelStyle);

          if ( jP.settings.shiftFixedChildren )
          {
            $(jP.fixedChildren).each(function(){
              var id = $(this).prop("tagName").toLowerCase() + ' ' + $(this).attr('class'),
                selector = id.replace(' ','.'),
                id = id.replace(' ','-')
              ;

              if ( animationChecks.none ) jP.disableFixedTransitions(id);
              if ( animationChecks.transitions ) jP.enableFixedTransitions(selector, id, jP.options.closeDuration, jP.options.closeEasing);

              var newChildrenStyle = {};
              newChildrenStyle[jP.options.direction] = 0 + jP.settings.positionUnits;
              $(this).css(newChildrenStyle);
            });
          }

          jP.timeouts.afterClose = setTimeout(function(){
            jP.setPanelStyle({ position: jP.settings.panelPosition });

            jP.disableTransitions();
            if ( jP.settings.shiftFixedChildren )
            {
              $(jP.fixedChildren).each(function(){
                var id = $(this).prop("tagName").toLowerCase() + ' ' + $(this).attr('class'),
                  id = id.replace(' ','-')
                ;

                jP.disableFixedTransitions(id);
              });
            }

            jP.hideMenu();
            jP.options.after();
            jP.options.afterClose();
            jP.destroyContentClickListeners();
          }, jP.options.closeDuration);
        }
        else {
          var formattedEasing = jP.getJSEasingFunction(jP.options.closeEasing);

          var animationOptions = {};
          animationOptions[jP.options.direction] = 0 + jP.settings.positionUnits;
          $(jP.panel).stop().animate(animationOptions, jP.options.closeDuration, formattedEasing, function(){
            jP.setPanelStyle({ position: jP.settings.panelPosition });

            jP.hideMenu();
            jP.options.after();
            jP.options.afterClose();
            jP.destroyContentClickListeners();
          });

          if ( jP.settings.shiftFixedChildren )
          {
            $(jP.fixedChildren).each(function(){
              var childrenAnimationOptions = {};
              childrenAnimationOptions[jP.options.direction] = 0 + jP.settings.positionUnits;
              $(this).stop().animate(childrenAnimationOptions, jP.options.closeDuration, formattedEasing);
            });
          }
        }
      },

      triggerMenu: function(animated) {
        if ( jP.menuIsOpen() ) jP.closeMenu(animated);
        else jP.openMenu(animated);
      },

      initiateClickListeners: function() {
        $(document).on('click',jP.options.trigger,function(){ jP.triggerMenu(jP.options.animated); return false; });
      },

      destroyClickListeners: function() {
        $(document).off('click',jP.options.trigger,null);
      },

      initiateContentClickListeners: function() {
        if ( !jP.options.closeOnContentClick ) return false;

        $(document).on('click',jP.panel,function(e){
          if ( jP.menuIsOpen() ) jP.closeMenu(jP.options.animated);
        });

        $(document).on('touchend',jP.panel,function(e){
          if ( jP.menuIsOpen() ) jP.closeMenu(jP.options.animated);
        });
      },

      destroyContentClickListeners: function() {
        if ( !jP.options.closeOnContentClick ) return false;

        $(document).off('click',jP.panel,null);
        $(document).off('touchend',jP.panel,null);
      },

      initiateKeyboardListeners: function() {
        var preventKeyListeners = ['input', 'textarea'];
        $(document).on('keydown',function(e){
          var target = $(e.target),
          prevent = false;
          $.each(preventKeyListeners, function(){
            if (target.is(this.toString())) { prevent = true; }
          });
          if ( prevent ) { return true; }

          for ( mapping in jP.options.keyboardShortcuts ) {
            if ( e.which == jP.options.keyboardShortcuts[mapping].code )
            {
              var key = jP.options.keyboardShortcuts[mapping];

              if ( key.open && key.close ) { jP.triggerMenu(jP.options.animated); }
              else if ( (key.open && !key.close) && !jP.menuIsOpen() ) { jP.openMenu(jP.options.animated); }
              else if ( (!key.open && key.close) && jP.menuIsOpen() ) { jP.closeMenu(jP.options.animated); }

              return false;
            }
          }
        });
      },

      destroyKeyboardListeners: function() {
        $(document).off('keydown',null);
      },

      setupMarkup: function() {
        $('html').addClass('jPanelMenu');
        $('body > *').not(jP.menu + ', ' + jP.options.excludedPanelContent).wrapAll('<div class="' + jP.panel.replace('.','') + '"/>');
        $(jP.options.menu).clone().attr('id', jP.menu.replace('#','')).insertAfter('body > ' + jP.panel);
      },

      resetMarkup: function() {
        $('html').removeClass('jPanelMenu');
        $('body > ' + jP.panel + ' > *').unwrap();
        $(jP.menu).remove();
      },

      init: function() {
        jP.options.beforeOn();

        jP.initiateClickListeners();
        if ( Object.prototype.toString.call(jP.options.keyboardShortcuts) === '[object Array]' ) { jP.initiateKeyboardListeners(); }

        jP.setjPanelMenuStyles();
        jP.setMenuState(false);
        jP.setupMarkup();

        jP.setMenuStyle({ width: jP.options.openPosition });

        jP.checkFixedChildren();
        jP.setPositionUnits();

        jP.closeMenu(false);

        jP.options.afterOn();
      },

      destroy: function() {
        jP.options.beforeOff();

        jP.closeMenu();
        jP.destroyClickListeners();
        if ( Object.prototype.toString.call(jP.options.keyboardShortcuts) === '[object Array]' ) { jP.destroyKeyboardListeners(); }

        jP.resetMarkup();
        var childrenStyles = {};
        childrenStyles[jP.options.direction] = 'auto';
        $(jP.fixedChildren).each(function(){ $(this).css(childrenStyles); });
        jP.fixedChildren = [];

        jP.options.afterOff();
      },

      setPosition: function(newPosition) {
        if ( typeof(newPosition) == "undefined" || newPosition == null ) { newPosition = jP.options.openPosition };
        jP.options.openPosition = newPosition;
        jP.setMenuStyle({ width: jP.options.openPosition });
      },

      setDirection: function(newDirection) {
        if ( typeof(newDirection) == "undefined" || newDirection == null ) { newDirection = jP.options.direction };
        jP.options.direction = newDirection;
        $('.jPanelMenu-panel').css('left', 'auto').css('right', 'auto');
        $('#jPanelMenu-style-master').remove();
        jP.checkFixedChildren();
        jP.setjPanelMenuStyles();
      }
    };

    return {
      on: jP.init,
      off: jP.destroy,
      trigger: jP.triggerMenu,
      open: jP.openMenu,
      close: jP.closeMenu,
      isOpen: jP.menuIsOpen,
      menu: jP.menu,
      getMenu: function() { return $(jP.menu); },
      panel: jP.panel,
      getPanel: function() { return $(jP.panel); },
      position: jP.setPosition,
      direction: jP.setDirection
    };
  };
})(jQuery);
;
