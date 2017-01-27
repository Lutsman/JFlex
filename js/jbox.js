/* Jeto jBox v1.2 */

function jboxCheckNofixed() {
  var jboxHolder = jQuery('#jbox-holder');
  jboxHolder.removeClass('nofixed');
  if (jboxHolder.height() > jQuery(window).height()) {
    jboxHolder.addClass('nofixed')
      .css({
        'top': '0',
        'margin-top': '100px',
      });
  }
}

jQuery(document).ready(function () {
  var jbox = {};
  jbox.holder = jQuery('#jbox-holder');
  jbox.inner = jQuery('.inner', jbox.holder);

  jQuery('<div id="jbox-overlay" class="jbox-overlay hide" />').appendTo('body');
  jQuery('<div id="jbox-holder" class="jbox-holder hide loading"><div class="inner-wrap"><div id="jbox-close" class="jbox-close"></div><div class="inner"></div></div></div>').appendTo('body');
  jQuery('<div id="jbox-close" class="jbox-close"></div>').appendTo('.anchortarget');
  var parentElement;

  jQuery('[class*="gallery-"]:not(a)').each(function (index) {
    var galery = jQuery(this);
    var wrap = galery.attr('class').split(/\s+/);
    var className;
    jQuery.each(wrap, function (index, item) {
      if (item.indexOf('gallery-') > -1) {
        className = item;
        return false;
      }
    });
    if (className) {
      jQuery('a.jbox', galery).each(function (index) {
        jQuery(this).addClass(className);
      });
    }
  });

  jQuery(document).on('click', '.jbox, #p-tbl-compact a:not(.anchor, .no-jbox), #p-tbl a:not(.anchor, [target="_blank"], .no-jbox), a.buy', function () {
    jbox.holder = jQuery('#jbox-holder');
    jbox.inner = jQuery('.inner', jbox.holder);
    jbox.obj = jQuery(this);
    jbox.clean();
    jQuery('#jbox-holder').addClass('active');
    var urltype = jQuery(this).attr('href');
    var objtype = jQuery(this).attr('src');
    var productsku = jQuery(this).attr('id');

    if (urltype !== undefined && urltype.indexOf('.') > -1) {
      jboximg(urltype, jbox.obj);
    }

    if (urltype !== undefined && urltype.indexOf('#') > -1) {
      jboxhtml();
    }

    if (productsku != null) {
      jboxsku();
    }

    if (objtype !== undefined && objtype.indexOf('.') > -1) {
      jboximg(objtype, jbox.obj);
    }

    /**
     * Проверка на сущ. gallery
     * Необходимо каждой фотке указать класс gallery-XXX для группировки фото в галлереи
     */
    function jboximg(el) {
      jbox.inner.html('');
      jbox.holder.addClass('image');
      var imgurl = el.replace('#', '');
      jQuery('<img class="jimage" src="#" /><div class="overimg"></div>').appendTo(jbox.inner);
      jQuery('img', jbox.inner).hide().attr('src', imgurl);
      var tmpimg = new Image();
      tmpimg.src = imgurl;
      jQuery(tmpimg).on('load', function () {
        jQuery('img', jbox.inner).show();
        jboxPosAbsolute(false, true);
      });

      // Определяем класс обвертки
      var elCur = jbox.obj;
      var objClass = elCur.attr('class').split(/\s+/);
      var className;
      jQuery.each(objClass, function (index, item) {
        if (item.indexOf('gallery-') > -1) {
          className = item;
          return false;
        }
      });

      // Проверка на сущ. gallery
      if (className) {
        var jBoxGallery = {};
        jBoxGallery.className = className;
        jBoxGallery.indexCurrent = 0;
        jBoxGallery.elements = jQuery('a.jbox.' + jBoxGallery.className);
        if (!jBoxGallery.elements.eq(0).attr('data-gallery-index')) {
          jBoxGallery.elements.each(function (index) {
            jQuery(this).attr('data-gallery-index', index);
          });
        }
        jBoxGallery.indexSumm = jBoxGallery.elements.length - 1;
        if (jBoxGallery.indexSumm > 0) {
          jBoxGallery.imgCurrent = jQuery('img', jbox.inner);
          jBoxGallery.indexCurrent = parseInt(elCur.attr('data-gallery-index'));
          var control = jQuery('<div class="jbox-control"><span class="prev"></span><span class="next"></span></div>');
          jQuery('span', control).hover(function () {
            jQuery(this).animate({opacity: 1}, 150);
          }, function () {
            jQuery(this).animate({opacity: 0}, 50);
          });
          jBoxGallery.imgCurrent.addClass(jBoxGallery.className)
            .attr('data-gallery-index', jBoxGallery.indexCurrent)
            .after(control);

          // function change image
          jBoxGallery.changeImg = function (direction) {
            jBoxGallery.indexCurrent = parseInt(jBoxGallery.imgCurrent.attr('data-gallery-index'));
            switch (direction) {
              case 'prev':
                jBoxGallery.indexCurrent = jBoxGallery.indexCurrent > 0 ? --jBoxGallery.indexCurrent : jBoxGallery.indexSumm;
                break;
              case 'next':
                jBoxGallery.indexCurrent = jBoxGallery.indexCurrent >= jBoxGallery.indexSumm ? 0 : ++jBoxGallery.indexCurrent;
                break;
            }
            var imgUrl = jBoxGallery.elements.eq(jBoxGallery.indexCurrent).attr('href');
            var img = jBoxGallery.imgCurrent;
            img.fadeTo(300, 0.1);
            //var timerId = '';
            //if (timerId) {
            //  clearTimeout(timerId);
            //}
            //timerId = setTimeout(function () {
            setTimeout(function () {
              img.attr('src', imgUrl)
                .attr('data-gallery-index', jBoxGallery.indexCurrent)
                .fadeTo(250, 1);
            }, 300);
            // tmp img for validate downloads img
            var tmpimg = new Image();
            tmpimg.src = imgUrl;
            jQuery(tmpimg).on('load', function () {
              jBoxGallery.imgCurrent = img;
              jboxPosAbsolute(true, true);
            });
          }

          // control
          jQuery('.prev', control).click(function () {
            jBoxGallery.changeImg('prev');
          });
          jQuery('.next', control).click(function () {
            jBoxGallery.changeImg('next');
          });

          // Events when you press forward / backward.
          jbox.holder.hover(
            function () {
              jQuery(document).keydown(function (e) {
                switch ((e.keyCode ? e.keyCode : e.which)) {
                  case 37:   // Left Arrow
                    e.preventDefault();
                    jBoxGallery.changeImg('prev');
                    break;
                  case 39:   // Right Arrow
                    e.preventDefault();
                    jBoxGallery.changeImg('next');
                    break;
                }
              });
            },
            function () {
              jQuery(document).off("keydown");
            }
          );

          //Enable swiping...
          jbox.holder.swipe({
            //Generic swipe handler for all directions
            swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
              //_jslider.options.slide_speed = 150;
              //clearTimeout(_jslider.options.timeout);
              switch (direction) {
                case 'left':
                  jBoxGallery.changeImg('next');
                  break;
                case 'right':
                  jBoxGallery.changeImg('prev');
                  break;
              }
            }
          });

        }
      }
      return false;
    }

    function jboxhtml() {
      jbox.holder.removeClass('loading');
      var innerid = urltype.replace('#', '');
      parentElement = jQuery('#' + innerid).parent();
      if (innerid == 'advantages') {
        jQuery('#' + innerid).clone(true, true).removeClass('hide').appendTo(jbox.inner);
      }
      else {
        jQuery('#' + innerid).appendTo(jbox.inner);
      }
      jboxPosAbsolute();
    }

    function jboxsku() {
      var innerid = 'sku-' + productsku;
      parentElement = jQuery('#' + innerid).parent();
      jQuery('.p-reference #' + innerid).appendTo(jbox.inner);
      jboxPosAbsolute();
    }

    // размещаем по центру экрана
    function jboxPosAbsolute(noAnimate, img) {
      var obj = jbox.holder;
      if (typeof obj !== undefined && obj.length && jQuery(jbox.inner).html()) {
        var scrollTop = self.pageYOffset || (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop);
        var scrollLeft = self.pageXOffset || (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft);
        var wh = document.documentElement.clientHeight;
        var ww = document.documentElement.clientWidth;
        //сбрасываем положение
        var objImg = jQuery('img', obj);
        objImg.css('max-height', '100%');
        obj.css({
          'left': '0',
          'top': '0',
          'margin-left': '0',
          'width': 'inherit',
          'max-width': 'none',
          'height': 'auto'
        });
        obj.removeClass('compact');
        var objH = obj.height();
        // Для изображения делаем высоту не больше экрана
        if (img) {
          if ((objH + 80) >= wh) {
            obj.css('height', wh);
            objImg.css('max-height', (wh - 120) + 'px');
            objH = wh;
          }
        }
        var objW = obj.width();
        if (objW >= ww) {
          obj.addClass('compact');
          objW = ww;
        }
        else {
          // Учитываем padding
          obj.css({'margin-left': '-40px'});
        }

        obj.css({
          'top': (scrollTop + (wh / 2) - (objH / 2)) + 'px',
          'left': (scrollLeft + (ww / 2) - (objW / 2)) + 'px',
          'margin-top': 0 + 'px',
        });

        if (!noAnimate) {
          jQuery('#jbox-overlay').fadeIn(200);
          obj.delay(250).slideDown(200).removeClass('loading');
        }
      }
    }

    //// function scrin;
    //jQuery(window).bind('displayChanged', function () {
    //  jboxPosAbsolute();
    //  // function scrin
    //});
    //jQuery(window).resize(function () {
    //  jboxPosAbsolute();
    //  // function scrin
    //});

    return false;
  });

  jbox.clean = function () {
    jQuery(this).parent('.anchortarget').hide();
    jbox.inner.contents().appendTo(parentElement);
    jbox.inner.html('');
    jbox.holder
      .css({'width': 'auto', 'height': 'auto'})
      .hide()
      .addClass('loading')
      .removeClass('image')
      .removeClass('html');
  }

  jQuery('#jbox-overlay, #jbox-close').click(function () {
    if (jQuery(this).hasClass('error')) {
      return;
    }
    jQuery('body').removeClass('m-view');
    jQuery('#jbox-holder').removeClass('active');
    jQuery(this).parent('.anchortarget').slideUp(150);
    jQuery('#jbox-overlay, #jbox-holder').fadeOut(200);
    jbox.holder
      .css({'width': 'auto', 'height': 'auto'})
      .addClass('loading')
      .removeClass('image')
      .removeClass('html');
    setTimeout(function () {
      jbox.inner.contents().appendTo(parentElement);
      jbox.inner.html('');
    }, 500);
  });

});
