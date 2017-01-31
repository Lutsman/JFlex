/* jflex readyshop jquery */

jQuery(document).ready(function () {

  /* show newsblock for unsubscribed users after 2 sec in jbox on page loads */

  /* jQuery('#newsblock').jbox(); */

  /* newsletter title search label control */

  jQuery('#newsblock label[for="edit-mail"]').click(function () {
    jQuery(this).fadeOut(200);
    jQuery(this).parent().find('input.form-text').focus();
  });

  jQuery('#newsblock input.form-text').focus(function () {
    jQuery('#newsblock label[for="edit-mail"]').fadeOut(200);
  });

  jQuery('#newsblock input.form-text').blur(function () {
    if (jQuery(this).val() == "") {
      jQuery('#newsblock label[for="edit-mail"]').fadeIn(200);
    }
  });

  /* block title search label control */

  jQuery('.globalsearch .block-title').click(function () {
    jQuery(this).fadeOut(200);
    jQuery(this).parent().find('input.form-text').focus();
  });

  jQuery('.globalsearch input.form-text').focus(function () {
    jQuery('.globalsearch .block-title').fadeOut(200);
  });

  jQuery('.globalsearch input.form-text').blur(function () {
    if (jQuery(this).val() == "") {
      jQuery('.globalsearch .block-title').fadeIn(200);
    }
  });


  /* hide cart block if click anywhere outside */

  jQuery('body:not(.ismobiledevice)').mouseup(function (e) {
    var subject = jQuery('#cart-content');
    if (e.target.id != subject.attr('id') && !subject.has(e.target).length) {
      subject.fadeOut();
    }
  });


  /* checkout cart sticky */

  if (jQuery('body:not(.ismobiledevice) #checkout').length) {
    var $stickycart_container = jQuery('.cart-info.sticky').closest('#checkout');
    var checkout_bottom_spacing = jQuery(document).height() - ($stickycart_container.height() + $stickycart_container.offset().top);
    var checkout_margin_top = parseInt(jQuery('.cart-info.sticky').css('margin-top'));
    jQuery('.cart-info.sticky').sticky({
      topSpacing: checkout_margin_top,
      bottomSpacing: checkout_bottom_spacing,
    });
    jQuery('.cart-info.sticky').on('sticky-start', function () {
      jQuery(this).css('margin-top', 0);
    })
    jQuery('.cart-info.sticky').on('sticky-end', function () {
      jQuery(this).css('margin-top', checkout_margin_top);
    })
    jQuery('.cart-info.sticky').sticky('update');
  }

});