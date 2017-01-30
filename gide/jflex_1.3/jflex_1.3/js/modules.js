/* jflex modules jquery */

jQuery(document).ready(function () {

  /* phone mask in input field */
  jQuery('input[name="submitted[phone], input[name="phone"], .field-delivery_phone input[type="text"]').mask("+7 (999) 999 99 99?9", {placeholder: " "});

  /* phone number in href */

  jQuery('.tel').each(function () {
    var tel = jQuery(this).text();
    var cleartel = tel.replace(/[^0-9]/g, '');
    jQuery(this).wrap('<a class="telline" href="tel:+' + cleartel + '" />');
  });

  /* slide up page button arrow */
  jQuery(window).scroll(function () {
    if (jQuery(window).scrollTop() < 300) {
      jQuery('#page-slideup').fadeOut();
    }

    if (jQuery(window).scrollTop() > 300) {
      jQuery('#page-slideup').fadeIn();
    }
  });
  jQuery('#page-slideup').click(function () {
    jQuery('html,body').animate({scrollTop: 0}, 'slow');
    return false;
  });

/* breadcrumb menu collapse animation func */

  jQuery('.breadcrumb .expanded').hover(function(e) {
    jQuery(this).find('ul').hoverFlow(e.type, {
      'height': 'show',
      'marginTop': 'show',
      'marginBottom': 'show',
      'paddingTop': 'show',
      'paddingBottom': 'show'
    },150);
  }, function(e) {
    jQuery(this).find('ul').hoverFlow(e.type, {
      'height': 'hide',
      'marginTop': 'hide',
      'marginBottom': 'hide',
      'paddingTop': 'hide',
      'paddingBottom': 'hide' 
    },100);
  });

  /* slideshow controls fadein/out display */

  jQuery('.page-slideshow.hidecontrols').hover(function () {
    jQuery(this).find('.pn-control').fadeIn('100');
  }, function () {
    jQuery(this).find('.pn-control').fadeOut('50');
  });

  /* remove links from complete message on webform */


  if (jQuery('.webform-confirmation').length) {
    jQuery('.links').remove();
    setTimeout(function () {
      parent.history.back();
    }, 10000);
    return false;
  }


  // set checked in newsletter and terms agreement checkboxes in checkout

  jQuery('#checkout .pane.simplenews .form-checkbox, #checkout .pane.terms .form-checkbox').attr('checked', 'checked');



  // forms and messages animation appearance

  jQuery('#user-login, #user-register-form, #user-pass, .messages').fadeIn(800);


});
