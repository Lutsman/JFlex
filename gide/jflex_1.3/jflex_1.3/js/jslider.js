/* JSlider for Drupal-7 v1.1 */

jQuery.fn.JSlider = function (options) {
  var _jslider;

  this.init = function (options) {
    _jslider = this;
    _jslider.options = {
      slide_speed: 400,
      timeout_delay: 8000,
      timeout: null,
      slide_num: 0,
      slide_count: 0,
      pause: false,
    };
    _jslider.options.default = {
      slide_speed: 400,
    };

    // устанавливаем скорость с атрибута
    var speed = jQuery(this).attr('data-slider-speed');
    if (speed) {
      _jslider.options.timeout_delay = parseInt(speed);
    }

    if (typeof(options) == 'Object') {
      jQuery.extend(_jslider.options, options);
    }
    if (typeof(_jslider.options.slider_effect) == 'undefined') {
      _jslider.options.slider_effect = jQuery(_jslider).attr('data-slider-effect') || 'fadein';
    }
    _jslider.options.slide_count = jQuery(_jslider).find('.slide').size();

    jQuery(_jslider).find('.slide').each(function () {
      jQuery(this).css({'position': 'absolute', 'top': '0', 'left': '0'}).hide();
    });
    jQuery(_jslider).find('.slide').first().show();

    _jslider.options.arrows = jQuery('<div class="pn-control m-hide"><a class="pn prev" href="#"></a><a class="pn next" href="#"></a></div>');
    jQuery(_jslider).find('.slider-content').prepend(_jslider.options.arrows);


    jQuery(_jslider.options.arrows).find('.next').click(function () {
      _jslider.animSlide('next');
      return false;
    })
    jQuery(_jslider.options.arrows).find('.prev').click(function () {
      _jslider.animSlide('prev');
      return false;
    })
    _jslider.options.slider_controls = jQuery('<div/>').addClass('slider-controls');
    var groups = [];
    jQuery(_jslider).find('.slide').each(function (index) {
      group_name = jQuery(this).attr('name');
      if (jQuery.inArray(group_name, groups) == -1) {
        groups.push(group_name);
      }
      $slide_control = jQuery('<div/>')
        .addClass('control-slide')
        .attr('data-group-name', group_name);

      // добавляем подгрузку pager изображений из .imgpager
      if (jQuery(_jslider).attr('data-control-mode') == 'images') {
        $slide_control.append(jQuery('.imgpager img:first', _jslider));
      }

      $slide_control.append('<div class="hide">' + index + '</div>');
      $slide_control.appendTo(_jslider.options.slider_controls);
    });
    _jslider.options.slider_controls.appendTo(_jslider);
    for (k in groups) {
      jQuery(_jslider).find('.control-slide[data-group-name="' + groups[k] + '"]').wrapAll('<span class="group"></span>');
    }
    jQuery(_jslider.options.slider_controls).find('.group').last().addClass('last');
    jQuery(_jslider.options.slider_controls).find('.control-slide:first').addClass('active');
    jQuery(_jslider.options.slider_controls).find('.control-slide').click(function () {
      var goToNum = parseFloat(jQuery(this).text());
      _jslider.animSlide(goToNum);
    });

    // data-slider-mode and hover
    if (jQuery(_jslider).attr('data-slider-mode') == 'paused') {
      clearTimeout(_jslider.options.timeout);
      _jslider.options.pause = true;
    }
    else {
      jQuery('>div', _jslider).hover(
        function () {
          clearTimeout(_jslider.options.timeout);
          _jslider.options.pause = true;
        },
        function () {
          _jslider.options.pause = false;
          _jslider.rotator();
        }
      );
    }

    // Events when you press forward / backward.
    _jslider.hover(
      function () {
        jQuery(document).keydown(function(e){
          switch((e.keyCode ? e.keyCode : e.which)){
            case 37:   // Left Arrow
              e.preventDefault();
              _jslider.animSlide('prev');
              break;
            case 39:   // Right Arrow
              e.preventDefault();
              _jslider.animSlide('next');
              break;
          }
        });
      },
      function () {
        jQuery(document).off("keydown");
      }
    );

    //Enable swiping...
    _jslider.swipe({
      //Generic swipe handler for all directions
      swipe: function (event, direction, distance, duration, fingerCount, fingerData) {
        _jslider.options.slide_speed = 150;
        clearTimeout(_jslider.options.timeout);
        switch (direction) {
          case 'left':
            _jslider.animSlide('next');
            break;

          case 'right':
            _jslider.animSlide('prev');
            break;
        }
      },
      allowPageScroll: "vertical"
    });
  }

  this.rotator = function () {
    clearTimeout(_jslider.options.timeout);
    if (!_jslider.options.pause) {
      _jslider.options.timeout = setTimeout(function () {
        _jslider.animSlide('next')
      }, _jslider.options.timeout_delay);
    }
    _jslider.options.slide_speed = _jslider.options.default.slide_speed;
  }

  this.animSlide = function (arrow) {
    clearTimeout(_jslider.options.timeout);
    var cur_slide_num = _jslider.options.slide_num;
    if (arrow == 'next') {
      if (_jslider.options.slide_num == (_jslider.options.slide_count - 1)) {
        _jslider.options.slide_num = 0;
      }
      else {
        _jslider.options.slide_num++;
      }
    }
    else if (arrow == 'prev') {
      if (_jslider.options.slide_num == 0) {
        _jslider.options.slide_num = _jslider.options.slide_count - 1;
      }
      else {
        _jslider.options.slide_num -= 1;
      }
    }
    else {
      _jslider.options.slide_num = arrow;
    }

    switch (_jslider.options.slider_effect) {
      case 'slidex':
        var $cur_slide = jQuery(_jslider).find('.slide').eq(cur_slide_num);
        var $next_slide = jQuery(_jslider).find('.slide').eq(_jslider.options.slide_num);
        var left, top;
        if ($cur_slide.attr('name') == $next_slide.attr('name')) {
          if (_jslider.options.slide_num < cur_slide_num) {
            left = (jQuery(_jslider).width() * -2) + 'px';
          }
          else {
            left = jQuery(_jslider).width() + 'px';
          }
          top = 0;
        }
        else {
          if (_jslider.options.slide_num < cur_slide_num) {
            top = (jQuery(_jslider).height() * -2) + 'px';
          }
          else {
            top = jQuery(_jslider).height() + 'px';
          }
          left = 0;
        }
        jQuery(_jslider).find('.slide').not($cur_slide).each(function (key, val) {
          jQuery(this).css({
            display: 'none',
            'z-index': 0,
          });
        });
        $cur_slide.css('z-index', 0);
        $next_slide
          .css({
            display: 'block',
            left: left,
            top: top,
            'z-index': 1,
          })
          .animate(
          {
            left: 0,
            top: 0,
          },
          _jslider.options.slide_speed,
          _jslider.rotator
        );
        break;

      case 'fadein':
      default:
        jQuery(_jslider).find('.slide').eq(cur_slide_num).fadeOut(_jslider.options.slide_speed);
        jQuery(_jslider).find('.slide').eq(_jslider.options.slide_num).fadeIn(_jslider.options.slide_speed, _jslider.rotator);
        break;
    }

    jQuery(_jslider).find('.control-slide.active').removeClass('active');
    jQuery(_jslider).find('.control-slide').eq(_jslider.options.slide_num).addClass('active');
  }

  this.init(options);
  return this;
}

jQuery(document).ready(function (e) {
  jQuery('.jslider').each(function () {
    $slider = jQuery(this).JSlider();
  });
});
