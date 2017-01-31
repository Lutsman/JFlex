(function ($) {
  jQuery(function () {
    /* Делаем обвертку для табов, устанавливаем для нее атрибут data-selector
     *  и прописываем селектор до списка страниц.
     *  символ > меняем на |
     *  класс .tab-block - расстягивает кнопки по ширине.
     *
     * ТАБЫ:
     * <div class="tab-name-wrap" data-selector=".page-partner-coupons|.attachment">
     *  <div class="tab-name">Таб1</div>
     *  <div class="tab-name">Таб2</div>
     *  <div class="tab-name">Таб3</div>
     * </div>
     *
     * СТРАНИЦЫ:
     * <div class="tab-page">страница1</div>
     * <div class="tab-page">страница2</div>
     * <div class="tab-page">страница3</div>
     */
    if (jQuery('.tab-name').length) {
      jQuery('.tab-name-wrap').each(function (i) {
        var tabNames = jQuery(this);
        jQuery('.tab-name', tabNames).each(function (i) {
          jQuery(this).attr('data-tn-id', (i + 1));
        });
        jQuery('.tab-name:first', tabNames).addClass('first active');
        jQuery('.tab-name:last', tabNames).addClass('last');
        jQuery('.tab-name', tabNames).wrapAll("<div class='tabs-all' />");

        // проверка наличия страниц
        var isPages = false;
        var tabPageSelector = $(tabNames).attr('data-selector');
        if (tabPageSelector) {
          var tabPages = jQuery(tabPageSelector.replace(/\|/g, ">"));
          if (tabPages.length) {
            if (jQuery('.tab-page', tabPages).length) {
              isPages = true;
              jQuery('.tab-page', tabPages).each(function (i) {
                jQuery(this).attr('data-tp-id', (i + 1));
                jQuery(this).hide();
              });
              jQuery('.tab-page:first', tabPages).show();
            }
          }
        }
        // клик по табу
        jQuery('.tab-name', tabNames).click(function (e) {
          jQuery('.tab-name', tabNames).each(function (i) {
            jQuery(this).removeClass('active');
          });
          jQuery(this).addClass('active');
          // если нет страниц, у табов просто будет меняться класс
          if (isPages) {
            var tabPageId = jQuery(this).attr('data-tn-id');
            jQuery('.tab-page', tabPages).each(function (i) {
              jQuery(this).hide();
            });
            jQuery('.tab-page[data-tp-id=' + tabPageId + ']', tabPages).show();
          }
        });
      });
    }
  });
}(jQuery));

