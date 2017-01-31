/*slider*/

/*this.animThumbs = function (arrow) {
 var $inner = _jslider.options.slider_controls.find('.inner');
 var options = _jslider.options;
 var thumbOptions = _jslider.options.thumbs;
 var speed = _jslider.options.slide_speed;
 var left;
 var prefix = '';

 if (arrow === 'prev') {
 if (options.slide_num > 0) {
 if (options.slide_num > thumbOptions.firstInView) {
 return;
 }

 left = thumbOptions.stepWidth;
 prefix = '+=';
 thumbOptions.firstInView--;
 thumbOptions.lastInView--;
 } else if (options.slide_num === 0) {
 left = (options.slide_count - thumbOptions.viewRange) * thumbOptions.stepWidth;
 prefix = '-';

 thumbOptions.firstInView = options.slide_count - thumbOptions.viewRange;
 thumbOptions.lastInView = options.slide_count - 1;
 }
 } else if (arrow === 'next') {
 if (options.slide_num < options.slide_count - 1) {
 if (options.slide_num < thumbOptions.lastInView) {
 return;
 }

 left = thumbOptions.stepWidth;
 prefix = '-=';
 thumbOptions.firstInView++;
 thumbOptions.lastInView++;
 } else if (options.slide_num === options.slide_count - 1) {
 left = 0;

 thumbOptions.firstInView = 0;
 thumbOptions.lastInView = thumbOptions.viewRange - 1;
 }
 }

 $inner.animate(
 {'left': prefix + left},
 speed
 );
 }; //запускать перед animSlide*/
/*this.animThumbs = function (arrow, count) {
 var $inner = _jslider.options.slider_controls.find('.inner');
 var options = _jslider.options;
 var thumbOptions = _jslider.options.thumbs;
 var speed = _jslider.options.slide_speed;
 var left;
 var prefix = '';

 if (arrow === 'prev') {
 if (count) {
 if (count > options.slide_num) {
 count = (count - options.slide_num) % options.slide_count;
 left = (options.slide_count - count - thumbOptions.viewRange) > 0 ?
 (options.slide_count - count - thumbOptions.viewRange) * thumbOptions.stepWidth : 0;
 prefix = '-';

 thumbOptions.firstInView = count - thumbOptions.viewRange;
 thumbOptions.lastInView = count;
 } else {
 left = count * thumbOptions.stepWidth;
 prefix = '+=';

 thumbOptions.firstInView -= count;
 thumbOptions.lastInView -= count;
 }
 } else {
 left = 0;

 thumbOptions.firstInView = 0;
 thumbOptions.lastInView = thumbOptions.viewRange - 1;
 }
 } else if (arrow === 'next') {
 if (count) {
 if (count + options.slide_num >= options.slide_count) {
 count = (count + options.slide_num - options.slide_count) % options.slide_count;
 left = (count - thumbOptions.viewRange) * thumbOptions.stepWidth;
 prefix = '-';
 }
 left = count * thumbOptions.stepWidth;
 prefix = '-=';
 } else {
 left = (options.slide_count - thumbOptions.viewRange) * thumbOptions.stepWidth;
 }
 }

 $inner.animate(
 {'left': prefix + left},
 speed
 );
 };*/