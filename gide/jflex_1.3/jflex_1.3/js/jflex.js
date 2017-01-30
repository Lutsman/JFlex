/* jflex jquery */

jQuery(document).ready(function () {

  /* main-menu collapse animation func */

  jQuery('.menu.expanded ul > li.expanded').not('.menu.expanded ul > li.expanded li').hover(function(e) {
    jQuery(this).find('ul').hoverFlow(e.type, {
      'height': 'show',
      'marginTop': 'show',
      'marginBottom': 'show',
      'paddingTop': 'show',
      'paddingBottom': 'show'
    },100);
  }, function(e) {
    jQuery(this).find('ul').hoverFlow(e.type, {
      'height': 'hide',
      'marginTop': 'hide',
      'marginBottom': 'hide',
      'paddingTop': 'hide',
      'paddingBottom': 'hide' 
    },50);
  });

  /* main-menu a name title span */


  jQuery('#main-menu a').each(function () {
    if(jQuery(this).attr('name')) {
      jQuery(this).addClass('named');
      nametitle = jQuery(this).attr('name');
      jQuery('<i>'+ nametitle +'</i>').appendTo(jQuery(this));
    }
  });

  /* expanded menu fixing */

  

  jQuery('.menu.vert.expanded li.expanded > span, .menu.vert.expanded li.expanded > a').hover(function () {
      var $linkwidth = jQuery(this).width();
      jQuery(this).parent().find('ul').not('ul ul ul').css({'margin-left': $linkwidth + 20 + 'px'});
  });


  var $pagewidth = jQuery('.page-content').width();
  var $menuwidth = jQuery('.leftside').width();
  jQuery('.menu.vert.expanded li.wide > span, .menu.vert.expanded li.wide > a').hover(function () {
      jQuery(this).parent().find('ul').css({'width': $pagewidth - $menuwidth});
  });

  /* bg image to css background-image cover */

  jQuery('img.bg').each(function () {
      bgimgsrc = jQuery(this).attr('src');
      jQuery(this).parents('.bg-to').css('background-image', 'url("' + bgimgsrc + '")');
      jQuery(this).remove();
  });

  //var searchBlock = jQuery('#search-block-form');
  //var searchBlock = jQuery('body.ismobiledevice #search-block-form');
  //if (searchBlock.lenght) {
  //  searchBlock.find('input[name="search_block_form"]').blur(function () {
  //    searchBlock.find('.form-item ul.ui-autocomplete').show();
  //  });
  //}
});


/* img scale for retina displays */
function changeSizeImgRetina() {
  var $resize = function (img) {
    var $img = jQuery(img);
    if (!$img.hasClass('retina-show')) {
      var retinawidth = img.width / 2;
      //var retinawidth = jQuery(this).width() / 2;
      var retinaheight = img.height / 2;
      //var retinaheight = jQuery(this).height() / 2;
      $img.css({
        'width' : retinawidth,
        'height' : retinaheight
      }).addClass('retina-show');
    }
  };
  jQuery('img.retina, .photo.retina>img').once().each(function () {
    if (this.width && this.width > 30) {
      $resize(this);
    }
    else {
      jQuery(this).load(function() {
        jQuery(this).each(function () {
          $resize(this);
        })
      });
    }
  });
}