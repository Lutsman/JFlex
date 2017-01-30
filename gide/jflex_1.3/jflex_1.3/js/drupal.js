/**
 * behaviors
 */
(function ($, Drupal, window, document, undefined) {
  // JS
  $(document).ready(function () {


    /* adding plus and minus controld to uc addto cart forms */
    //jQuery('<span class="control min l">–</span>').insertBefore('#uc-cart-view-form .qty input[type=text], .form-item-qty input[type=text]');
    //jQuery('<span class="control plus l">+</span>').insertAfter('#uc-cart-view-form .qty input[type=text], .form-item-qty input[type=text]');

    jQuery('.plus').live("click", function (e) {
      e.preventDefault();
      var isCart = $(this).closest('#uc-cart-view-form').length;
      var currentVal = 0;
      var maxProducts = 20;
      var currentValEl = parseInt(jQuery(this).parent().find('input[type=text]').val());
      if (!isCart) {
        var nid = $(this).closest('form').attr('id');
        var re = /([a-z\-])+/;
        nid = nid.replace(re, "");
        currentVal = parseInt(jQuery('#uc-cart-view-form tr[nid="' + nid + '"] .qty input[type=text]').val());
      }
      if (!currentVal) {
        currentVal = currentValEl;
      }
      if (isCart) {
        if (currentVal < maxProducts) {
          jQuery(this).parent().find('input[type=text]').val(currentVal + 1);
        } else {
          jQuery(this).parent().find('input[type=text]').val(maxProducts);
        }
      }
      else {
        if ((currentVal + currentValEl) < maxProducts) {
          currentVal = currentValEl ? currentValEl + 1 : 0;
          jQuery(this).parent().find('input[type=text]').val(currentVal);
        } else {
          jQuery(this).parent().find('input[type=text]').val(currentValEl);
        }
      }
      if (isCart) {
        setTimeout(function () {
          jQuery('#uc-cart-view-form #edit-update-ajax').click().trigger('keypress').trigger('mousedown');
        }, 500);
      }
    });
    jQuery('.min').live("click", function (e) {
      e.preventDefault();
      var isCart = $(this).closest('#uc-cart-view-form').length;
      var fieldName = jQuery(this).parent().find('input[type=text]');
      var currentVal = parseInt(jQuery(this).parent().find('input[type=text]').val());
      if (currentVal > 1) {
        jQuery(this).parent().find('input[type=text]').val(currentVal - 1);
      } else {
        jQuery(this).parent().find('input[type=text]').val(1);
      }
      if (isCart) {
        setTimeout(function () {
          jQuery('#uc-cart-view-form #edit-update-ajax').click().trigger('keypress').trigger('mousedown');
        }, 500);
      }
    });

  });

  /* Modale window then run ajax. */
  if (typeof(Drupal.ajax) != 'undefined') {
    var beforeSend = Drupal.ajax.prototype.beforeSend;
    var success = Drupal.ajax.prototype.success;
    var error = Drupal.ajax.prototype.error;
    /**
     * Prepare the Ajax request before it is sent.
     */
    Drupal.ajax.prototype.beforeSend = function (xmlhttprequest, options) {
      // Вызываем код, который описан в Drupal.ajax.prototype.beforeSend в файле misc/ajax.js,
      // чтобы не нарушить работу AJAX.
      beforeSend.call(this, xmlhttprequest, options);
      //if (this.progress.type == "ajax_progress_overlay") {
      jQuery(this.element).parents('form.uc-cart-checkout-form, form#uc-cart-view-form, .apo-show').prepend(jQuery('<div />').addClass('ajax-progress-overlay'));
      if (jQuery(this.element).closest('.views-exposed-widgets').length) {
        jQuery('.apo-show, .views-exposed-widgets').prepend(jQuery('<div />').addClass('ajax-progress-overlay'));
      }
      //}
    };

    /**
     * Handler for the form redirection completion.
     */
    Drupal.ajax.prototype.success = function (xmlhttprequest, options) {
      success.call(this, xmlhttprequest, options);
      // show activity on view filters sort
      var wrap = jQuery('form.uc-cart-checkout-form, form#uc-cart-view-form, .apo-show, .views-exposed-widgets');
      if (wrap.length) {
        jQuery('.ajax-progress-overlay', wrap).remove();
        if (this.element.type == 'radio') {
          jQuery(this.element).closest('.form-type-radio').addClass('active').siblings().removeClass('active');
        }
      }
    };

  }



  // Behaviors.
  Drupal.behaviors.jflexDrupal = {
    attach: function (context, settings) {
      /**
       * Order sent to 1C
       */
      //function exchange_1c_fn() {
      //  if (Drupal.settings.hasOwnProperty('exchange_1c')) {
      //    var order_id = Drupal.settings.exchange_1c;
      //    if (order_id) {
      //      $.get("/request-send/" + order_id);
      //    }
      //  }
      //}
      //$('body').once('exchange_1c', exchange_1c_fn);

      // Set active class for :radio wrapp
      jQuery('input:radio:checked').once().closest('.form-type-radio').addClass('active').siblings().removeClass('active');

      /* img scale for retina displays */
      changeSizeImgRetina();

      /* adding plus and minus controld to uc addto cart forms */
      $('#uc-cart-view-form .qty, .form-item-qty').each(function () {
        if (!$('.control.plus', this).length) {
          jQuery('<span class="control min l">–</span>').insertBefore($('input[type=text]', this));
          jQuery('<span class="control plus l">+</span>').insertAfter($('input[type=text]', this));
        }
      });

      // filters as tabs first-last
      jQuery('.views-widget .form-item-edit-field-product-marker-tid-all').remove();
      jQuery('.bef-select-as-links a:first').addClass('first');
      jQuery('.bef-select-as-links a:last').addClass('last');


      /* animations for compact product mode view */

      jQuery('.product.teaser.compact').hover(function (e) {
        jQuery(this).find('.title').addClass('active');
        jQuery(this).find('.overflow').hoverFlow(e.type, {
          'opacity': 'show'
        }, 150);

        jQuery(this).find('.sku, .add-to-cart').hoverFlow(e.type, {
          'height': 'show',
          'marginTop': 'show',
          'marginBottom': 'show',
          'paddingTop': 'show',
          'paddingBottom': 'show'
        }, 150);

      }, function (e) {

        jQuery(this).find('.title').removeClass('active');
        jQuery(this).find('.overflow').hoverFlow(e.type, {
          'opacity': 'hide'
        }, 150);

        jQuery(this).find('.sku, .add-to-cart').hoverFlow(e.type, {
          'height': 'hide',
          'marginTop': 'hide',
          'marginBottom': 'hide',
          'paddingTop': 'hide',
          'paddingBottom': 'hide'
        }, 100);
      });

      /* SET MODE. Set view mode switcher. */
      function setDisplayMode(key, el) {
        var $dSwitch = $(el);
        var $dMode = $('body.displaymode');
        var setMode = function (mode, onlyLink) {
          jQuery('#display-switch a.' + mode).addClass('active').siblings().removeClass('active');
          if (!onlyLink) {
            $dMode.removeClass('grid linear').addClass(mode);
            jQuery.cookie('displaymode', mode, {expires: 30});
          }
        };
        // Set mode after loaded page
        var hash = document.location.hash;
        if (hash) {
          hash = hash.replace('#', '');
          if (!$dMode.hasClass(hash)) {
            switch (hash) {
              case 'grid':
                setMode('grid');
                break;
              case 'linear':
                setMode('linear');
                break;
            }
          }
          else {
            hash == 'linear' ? setMode('linear', true) : '';
          }
        }
        else {
          $dMode.hasClass('linear') ? setMode('linear', true) : '';
        }
        // Event click on link MODE
        $('#display-switch a').click(function () {
          setMode(jQuery(this).attr('href').replace('#', ''));
        });
      }

      $('body.displaymode .switcher #display-switch:first').once('displaymode', setDisplayMode);
      /* END SET MODE. */


      /* removing view fileters if only one product in view */
      var prodcount = jQuery('.view-content .product').length;
      if (prodcount == 1) {
        jQuery('.view-filters').once().remove();
      }


    }
  };

})(jQuery, Drupal, this, this.document);