/* JSlider for Drupal-7 v1.1 */

$.fn.JSlider = function (options) {
    var _jslider;
    var animations = {
        'fade': function (element) {
            $(element).fadeIn();
        },
        'slide': function (element) {
            $(element).slideDown();
        }
    };

    this.init = function (options) {
        _jslider = this;
        _jslider.options = {
            slide_speed: 400,
            timeout_delay: 8000,
            timeout: null,
            slide_num: 0,
            slide_count: 0,
            pause: false
        };
        _jslider.options.default = {
            slide_speed: 400
        };

        // устанавливаем скорость с атрибута
        var speed = $(this).attr('data-slider-speed');
        if (speed) {
            _jslider.options.timeout_delay = parseInt(speed);
        }

        if (typeof(options) == 'object') {
            $.extend(_jslider.options, options);
        }
        if (typeof(_jslider.options.slider_effect) == 'undefined') {
            _jslider.options.slider_effect = $(_jslider).attr('data-slider-effect') || 'fadein';
        }
        _jslider.options.slide_count = $(_jslider).find('.slide').size();

        $(_jslider).find('.slide').each(function () {
            $(this).css({'position': 'absolute', 'top': '0', 'left': '0'}).hide();
        });
        $(_jslider).find('.slide').first().show();

        _jslider.options.arrows = $('<div class="pn-control m-hide"><a class="pn prev" href="#"></a><a class="pn next" href="#"></a></div>');
        $(_jslider).find('.slider-content').prepend(_jslider.options.arrows);


        $(_jslider.options.arrows).find('.next').click(function () {
            _jslider.animSlide('next');
            return false;
        });
        $(_jslider.options.arrows).find('.prev').click(function () {
            _jslider.animSlide('prev');
            return false;
        });
        _jslider.options.slider_controls = $('<div/>').addClass('slider-controls');
        var groups = [];
        $(_jslider).find('.slide').each(function (index) {
            var group_name = $(this).attr('name');
            if ($.inArray(group_name, groups) == -1) {
                groups.push(group_name);
            }
            var $slide_control = $('<div/>')
                .addClass('control-slide')
                .attr('data-group-name', group_name);

            // добавляем подгрузку pager изображений из .imgpager
            if ($(_jslider).attr('data-control-mode') == 'images') {
                $slide_control.append($('.imgpager img:first', _jslider));
            }

            $slide_control.append('<div class="hide">' + index + '</div>');
            $slide_control.appendTo(_jslider.options.slider_controls);
        });
        _jslider.options.slider_controls.appendTo(_jslider);
        for (var k in groups) {
            $(_jslider).find('.control-slide[data-group-name="' + groups[k] + '"]').wrapAll('<span class="group"></span>');
        }
        $(_jslider.options.slider_controls).find('.group').last().addClass('last');
        $(_jslider.options.slider_controls).find('.control-slide:first').addClass('active');
        $(_jslider.options.slider_controls).find('.control-slide').click(function () {
            var goToNum = parseFloat($(this).text());
            _jslider.animSlide(goToNum);
        });

        // data-slider-mode and hover
        if ($(_jslider).attr('data-slider-mode') == 'paused') {
            clearTimeout(_jslider.options.timeout);
            _jslider.options.pause = true;
        }
        else {
            $('>div', _jslider).hover(
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
                $(document).keydown(function (e) {
                    switch ((e.keyCode ? e.keyCode : e.which)) {
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
                $(document).off("keydown");
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
    };

    this.rotator = function () {
        clearTimeout(_jslider.options.timeout);
        if (!_jslider.options.pause) {
            _jslider.options.timeout = setTimeout(function () {
                _jslider.animSlide('next')
            }, _jslider.options.timeout_delay);
        }
        _jslider.options.slide_speed = _jslider.options.default.slide_speed;
    };

    this.animSlide = function (arrow) { //параметр string ('next', 'prev') или int (индекс слайда)
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

        var $cur_slide = $(_jslider).find('.slide').eq(cur_slide_num);
        var $next_slide = $(_jslider).find('.slide').eq(_jslider.options.slide_num);
        var $animatedElements = _jslider.getAnimatedElements($next_slide);

        _jslider.hideElements($animatedElements);

        switch (_jslider.options.slider_effect) {
            case 'slidex':
                var left, top;

                if ($cur_slide.attr('name') == $next_slide.attr('name')) {
                    if (_jslider.options.slide_num < cur_slide_num) {
                        left = ($(_jslider).width() * -2) + 'px';
                    }
                    else {
                        left = $(_jslider).width() + 'px';
                    }
                    top = 0;
                }
                else {
                    if (_jslider.options.slide_num < cur_slide_num) {
                        top = ($(_jslider).height() * -2) + 'px';
                    }
                    else {
                        top = $(_jslider).height() + 'px';
                    }
                    left = 0;
                }
                $(_jslider).find('.slide').not($cur_slide).each(function (key, val) {
                    $(this).css({
                        display: 'none',
                        'z-index': 0
                    });
                });
                $cur_slide.css('z-index', 0);
                $next_slide
                    .css({
                        display: 'block',
                        left: left,
                        top: top,
                        'z-index': 1
                    })
                    .animate(
                        {
                            left: 0,
                            top: 0
                        },
                        _jslider.options.slide_speed,
                        function () {
                            _jslider.rotator();
                            _jslider.animateElements($animatedElements);
                        }
                    );
                break;

            case 'fadein':
            default:
                $cur_slide.fadeOut(_jslider.options.slide_speed);
                $next_slide.fadeIn(_jslider.options.slide_speed,
                    function () {
                        _jslider.rotator();
                        _jslider.animateElements($animatedElements);
                    });
                break;
        }

        $(_jslider).find('.control-slide.active').removeClass('active');
        $(_jslider).find('.control-slide').eq(_jslider.options.slide_num).addClass('active');
    };

    this.getAnimatedElements = function (slide) {
        return slide.find('[data-animation]');
    };

    this.hideElements = function (elements) {
        elements.each(function () {
            $(this).hide();
        })
    };

    this.animateElements = function (elements) {
        if (!elements.length) return;

        elements.each(function () {
            var el = $(this);
            var animationName = el.attr('data-animation');
            var delay = paseInt(el.attr('data-animation-delay'));
            var animationFunc = animations[animationName];

            if (typeof animationFunc !== 'function') return;

            if (delay) {
                setTimeout(animationFunc.bind(null, el), delay);
            } else {
                animationFunc(el);
            }
        });
    };

    this.init(options);
    return this;
};

$(document).ready(function (e) {
    $('.jslider').each(function () {
        var $slider = $(this).JSlider();
    });
});
