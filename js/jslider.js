/* JSlider for Drupal-7 v1.1 */
/*
* dependency:
* - jquery.min.js
* - jquery.swipe.js
* */

$.fn.JSlider = function (options) {
    var _jslider;
    var animations = [
        {
            name: 'fadeIn',
            hideOnStart: true,
            speed: 200,
            method: function (element, speed) {
                speed = speed || this.speed;

                $(element).fadeIn(speed);
            }
        },
        {
            name: 'fadeOut',
            hideOnStart: false,
            speed: 200,
            method: function (element, speed) {
                speed = speed || this.speed;

                $(element).fadeOut(speed);
            }
        },
        {
            name: 'slideDown',
            hideOnStart: true,
            speed: 200,
            method: function (element, speed) {
                speed = speed || this.speed;

                $(element).slideDown(speed);
            }
        },
        {
            name: 'slideUp',
            hideOnStart: false,
            speed: 200,
            method: function (element, speed) {
                speed = speed || this.speed;

                $(element).slideUp(speed);
            }
        }
    ];

    this.init = function (options) {
        _jslider = this;
        _jslider.options = {
            slide_speed: 400,
            timeout_delay: 8000,
            timeout: null,
            slide_num: 0,
            slide_count: 0,
            pause: false,
            isImageMode: false,
            thumbs: {
                viewRange: 4,
                firstInView: 0,
                lastInView: 3,
                stepWidth: 0
            }

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

        /*создаем управление*/
        _jslider.renderControls();

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
        _jslider.prepareElements($animatedElements);

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

    this.getAnimatedElements = function ($parent) {
        return $parent.find('[data-animation]')
            .filter(function () { //фильтруем неизвестные нам анимации
                var currAnimation = _jslider.getAnimation($(this).attr('data-animation'));

                return currAnimation ? true : false;
            });
    };

    this.getAnimation = function (name) {
        for(var i = 0; i < animations.length; i++) {
            if (animations[i].name === name) {
                return animations[i];
            }
        }

        return null;
    };

    this.prepareElements = function ($elements) {
        $elements.each(function () {
            var $el = $(this);
            var currAnimation = _jslider.getAnimation($el.attr('data-animation'));

            if (currAnimation.hideOnStart) {
                $el.hide();
            } else {
                $el.show();
            }
        })
    };

    this.animateElements = function ($elements) {
        if (!$elements.length) return;

        $elements.each(function () {
            var $el = $(this);
            var currAnimation = _jslider.getAnimation($el.attr('data-animation'));
            var delay = parseInt($el.attr('data-delay'));
            var speed = parseInt($el.attr('data-speed'));

            if (delay) {
                setTimeout(currAnimation.method.bind(currAnimation, $el, speed), delay);
            } else {
                currAnimation.method($el, speed);
            }
        });
    };

    this.renderControls = function () {
        /*render arrows*/
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

        /*render thumbs slider*/
        _jslider.options.slider_controls = $('<div/>').addClass('slider-controls');
        var groups = [];
        var isImageMode = _jslider.options.isImageMode = $(_jslider).attr('data-control-mode') == 'images';

        $(_jslider).find('.slide').each(function (index) {
            var group_name = $(this).attr('name');
            if ($.inArray(group_name, groups) == -1) {
                groups.push(group_name);
            }
            var $slide_control = $('<div/>')
                .addClass('control-slide')
                .attr('data-group-name', group_name);

            // добавляем подгрузку pager изображений из .imgpager
            if (isImageMode) {
                $slide_control.append($('.imgpager img:first', _jslider));
            }

            $slide_control.append('<div class="hide">' + index + '</div>');
            $slide_control.appendTo(_jslider.options.slider_controls);
        });
        _jslider.options.slider_controls.appendTo(_jslider);

        if (isImageMode) {
            var $prev = $('<span class="prev-thumb">prev</span>');
            var $next = $('<span class="next-thumb">next</span>');
            var $inner = $('<div class="inner"></div>');
            var $outer = $('<div class="outer"></div>');
            var thumb = _jslider.options.slider_controls.find('.control-slide')[0];
            var thumbOptions = _jslider.options.thumbs;

            thumbOptions.stepWidth = thumb.offsetWidth;
            thumbOptions.viewRange = parseInt($(_jslider).attr('data-previewslides')) || thumbOptions.viewRange;
            thumbOptions.firstInView = 0;
            thumbOptions.lastInView = thumbOptions.viewRange - 1;

            $outer.css({
                'width': thumb.offsetWidth * thumbOptions.viewRange + 'px',
                'height': thumb.offsetHeight + 'px'
            });

            _jslider.options.slider_controls
                .wrapInner($inner)
                .wrapInner($outer)
                .append($prev)
                .append($next);

            $prev.click(function () {
               //console.log('prev');
                _jslider.animSlide('prev');
                _jslider.animThumbs('prev', 1);
            });
            $next.click(function () {
                _jslider.animSlide('next');
                _jslider.animThumbs('next', 1);
                //console.log('next');
            });

            console.log(_jslider.options.slider_controls.find('.inner'));
        }

        for (var k in groups) {
            $(_jslider).find('.control-slide[data-group-name="' + groups[k] + '"]').wrapAll('<span class="group"></span>');
        }
        $(_jslider.options.slider_controls).find('.group').last().addClass('last');
        $(_jslider.options.slider_controls).find('.control-slide:first').addClass('active');
        $(_jslider.options.slider_controls).find('.control-slide').click(function () {
            var goToNum = parseFloat($(this).text());
            _jslider.animSlide(goToNum);
        });

    };

    this.animThumbs = function (arrow, count) {
        var $inner = _jslider.options.slider_controls.find('.inner');
        var thumbOptions = _jslider.options.thumbs;

        if (arrow === 'prev') {
            if (count) {
                $inner.animate(
                    {'left': '+=' + count * thumbOptions.stepWidth},
                    _jslider.options.slide_speed
                );
            }
        } else if (arrow === 'next') {
            if (count) {
                $inner.animate(
                    {'left': '-=' + count * thumbOptions.stepWidth},
                    _jslider.options.slide_speed
                );
            }
        }
    };

    this.init(options);
    return this;
};

$(document).ready(function (e) {
    $('.jslider').each(function () {
        var $slider = $(this).JSlider();
    });
});
