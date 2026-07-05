(function () {
  function formatMoney(cents, root) {
    if (window.Shopify && typeof window.Shopify.formatMoney === 'function') {
      return window.Shopify.formatMoney(cents);
    }

    var value = (cents / 100).toFixed(2);
    var format = root && root.dataset.moneyFormat ? root.dataset.moneyFormat : '';

    if (format.indexOf('{{amount_no_decimals}}') !== -1) {
      return format.replace('{{amount_no_decimals}}', Math.round(cents / 100).toString());
    }

    if (format.indexOf('{{amount}}') !== -1) {
      return format.replace('{{amount}}', value);
    }

    return (cents / 100).toLocaleString(undefined, {
      style: 'currency',
      currency: root && root.dataset.currency ? root.dataset.currency : 'USD'
    });
  }

  function updateCartCount(count) {
    document.querySelectorAll('[data-knr-cart-count]').forEach(function (badge) {
      badge.textContent = count;
    });

    document.querySelectorAll('.cart-count-bubble span[aria-hidden="true"]').forEach(function (badge) {
      badge.textContent = count;
    });
  }

  function addProductFormToCart(form, button, message) {
    if (!form || !button || button.disabled) return;

    button.classList.add('is-loading');
    if (message) message.textContent = '';

    fetch(window.routes ? window.routes.cart_add_url + '.js' : '/cart/add.js', {
      method: 'POST',
      body: new FormData(form),
      headers: {
        Accept: 'application/json'
      }
    })
      .then(function (response) {
        if (!response.ok) throw new Error('Cart add failed');
        return fetch(window.routes ? window.routes.cart_url + '.js' : '/cart.js');
      })
      .then(function (response) {
        return response.json();
      })
      .then(function (cart) {
        updateCartCount(cart.item_count || 0);
        if (message) message.textContent = 'Added to cart.';
      })
      .catch(function () {
        form.submit();
      })
      .finally(function () {
        button.classList.remove('is-loading');
      });
  }

  function initStoryUpsell(root, variants) {
    var upsell = root.querySelector('.knr-story__upsell');
    if (!upsell) return;

    var hiddenInput = upsell.querySelector('[data-knr-upsell-variant-id]');
    var priceNode = upsell.querySelector('[data-knr-upsell-price]');
    var form = upsell.querySelector('.knr-story__upsell-form');
    var button = form ? form.querySelector('button[type="submit"]') : null;

    upsell.querySelectorAll('[data-knr-upsell-variant]').forEach(function (input) {
      input.addEventListener('change', function () {
        var variant = variants.find(function (item) {
          return String(item.id) === String(input.value);
        });

        if (!variant) return;
        if (hiddenInput) hiddenInput.value = variant.id;
        if (priceNode) priceNode.textContent = formatMoney(variant.price, root);
        if (button) button.disabled = !variant.available;

        upsell.querySelectorAll('.knr-story__upsell-option').forEach(function (label) {
          label.classList.toggle('is-selected', label.contains(input));
        });
      });
    });

    if (form && button) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        addProductFormToCart(form, button, null);
      });
    }
  }

  function initProduct(root) {
    var variantsNode = root.querySelector('[data-knr-variants-json]');
    var variants = [];

    try {
      variants = JSON.parse(variantsNode ? variantsNode.textContent : '[]');
    } catch (error) {
      variants = [];
    }

    var variantInput = root.querySelector('[data-knr-variant-id]');
    var priceNode = root.querySelector('[data-knr-price]');
    var compareNode = root.querySelector('[data-knr-compare-price]');
    var addButton = root.querySelector('[data-knr-add-to-cart]');
    var addLabel = root.querySelector('[data-knr-add-label]');
    var form = root.querySelector('.knr-product__form');
    var message = root.querySelector('[data-knr-form-message]');

    root.querySelectorAll('[data-knr-variant-option]').forEach(function (input) {
      input.addEventListener('change', function () {
        var variant = variants.find(function (item) {
          return String(item.id) === String(input.value);
        });

        if (!variant) return;

        if (variantInput) variantInput.value = variant.id;
        if (priceNode) priceNode.textContent = formatMoney(variant.price, root);

        if (compareNode) {
          if (variant.compare_at_price && variant.compare_at_price > variant.price) {
            compareNode.hidden = false;
            compareNode.textContent = formatMoney(variant.compare_at_price, root);
          } else {
            compareNode.hidden = true;
            compareNode.textContent = '';
          }
        }

        root.querySelectorAll('.knr-product__variant').forEach(function (label) {
          label.classList.toggle('is-selected', label.contains(input));
        });

        if (addButton) addButton.disabled = !variant.available;
        if (addLabel && addButton) {
          addLabel.textContent = variant.available ? addButton.dataset.addLabel : addButton.dataset.soldOutLabel;
        }
      });
    });

    if (form) {
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        addProductFormToCart(form, addButton, message);
      });
    }

    root.querySelectorAll('[data-knr-quantity]').forEach(function (quantityRoot) {
      var input = quantityRoot.querySelector('input[type="number"]');
      var decrease = quantityRoot.querySelector('[data-knr-quantity-decrease]');
      var increase = quantityRoot.querySelector('[data-knr-quantity-increase]');

      if (decrease && input) {
        decrease.addEventListener('click', function () {
          input.value = Math.max(Number(input.min || 1), Number(input.value || 1) - 1);
        });
      }

      if (increase && input) {
        increase.addEventListener('click', function () {
          input.value = Number(input.value || 1) + 1;
        });
      }
    });

    root.querySelectorAll('[data-knr-media-thumb]').forEach(function (button) {
      button.addEventListener('click', function () {
        var image = root.querySelector('.knr-product__main-image');
        if (!image) return;

        image.src = button.dataset.fullSrc;
        image.removeAttribute('srcset');
        image.alt = button.dataset.alt || image.alt;

        root.querySelectorAll('[data-knr-media-thumb]').forEach(function (thumb) {
          thumb.classList.toggle('is-active', thumb === button);
        });
      });
    });

    initStoryUpsell(root, variants);
  }

  function initFaq(root) {
    root.querySelectorAll('[data-knr-faq-trigger]').forEach(function (trigger) {
      var initialPanel = document.getElementById(trigger.getAttribute('aria-controls'));
      var initiallyExpanded = trigger.getAttribute('aria-expanded') === 'true';
      var initialIcon = trigger.querySelector('span[aria-hidden="true"]');

      if (initialPanel) {
        initialPanel.style.maxHeight = initiallyExpanded ? initialPanel.scrollHeight + 'px' : '0px';
        initialPanel.style.opacity = initiallyExpanded ? '1' : '0';
      }

      if (initialIcon) {
        initialIcon.textContent = initiallyExpanded ? (trigger.closest('.knr-product__accordion') ? '⌃' : '−') : (trigger.closest('.knr-product__accordion') ? '⌄' : '+');
      }

      trigger.addEventListener('click', function () {
        var panel = document.getElementById(trigger.getAttribute('aria-controls'));
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        var icon = trigger.querySelector('span[aria-hidden="true"]');
        var isProductAccordion = Boolean(trigger.closest('.knr-product__accordion'));

        trigger.setAttribute('aria-expanded', String(!expanded));
        if (icon) icon.textContent = expanded ? (isProductAccordion ? '⌄' : '+') : (isProductAccordion ? '⌃' : '−');

        if (!panel) return;

        if (expanded) {
          panel.style.maxHeight = panel.scrollHeight + 'px';
          panel.style.opacity = '1';
          window.requestAnimationFrame(function () {
            panel.style.maxHeight = '0px';
            panel.style.opacity = '0';
          });
          window.setTimeout(function () {
            panel.hidden = true;
          }, 280);
        } else {
          panel.hidden = false;
          panel.style.maxHeight = '0px';
          panel.style.opacity = '0';
          window.requestAnimationFrame(function () {
            panel.style.maxHeight = panel.scrollHeight + 'px';
            panel.style.opacity = '1';
          });
        }
      });
    });
  }

  function initRitualCarousel(root) {
    var carousel = root.querySelector('[data-knr-ritual-carousel]');
    var next = root.querySelector('[data-knr-ritual-next]');
    if (!carousel || !next) return;

    next.addEventListener('click', function () {
      var card = carousel.querySelector('article');
      if (!card) return;

      var gap = parseFloat(window.getComputedStyle(carousel).columnGap || window.getComputedStyle(carousel).gap || 0);
      var amount = card.getBoundingClientRect().width + gap;
      var maxScroll = carousel.scrollWidth - carousel.clientWidth;
      var target = Math.min(carousel.scrollLeft + amount, maxScroll);

      if (carousel.scrollLeft >= maxScroll - 2) {
        target = 0;
      }

      carousel.scrollTo({
        left: target,
        behavior: 'smooth'
      });
    });
  }

  function initReviewCarousel(root) {
    var slides = Array.prototype.slice.call(root.querySelectorAll('[data-knr-review-slide]'));
    var previous = root.querySelector('[data-knr-review-prev]');
    var next = root.querySelector('[data-knr-review-next]');
    if (!slides.length || !previous || !next) return;

    var activeIndex = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });

    if (activeIndex < 0) activeIndex = 0;

    var show = function (index) {
      activeIndex = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        var active = slideIndex === activeIndex;
        slide.classList.toggle('is-active', active);
        slide.hidden = !active;
      });
    };

    previous.addEventListener('click', function () {
      show(activeIndex - 1);
    });

    next.addEventListener('click', function () {
      show(activeIndex + 1);
    });

    show(activeIndex);
  }

  function initBeforeAfter(root) {
    var range = root.querySelector('[data-knr-before-after-range]');
    var layer = root.querySelector('[data-knr-after-layer]');
    if (!range || !layer) return;

    var update = function () {
      var value = Number(range.value);
      root.style.setProperty('--knr-before-after', value + '%');
      layer.style.clipPath = 'inset(0 0 0 ' + value + '%)';
    };

    range.addEventListener('input', update);
    update();
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-knr-product]').forEach(function (root) {
      initProduct(root);
      initRitualCarousel(root);
    });
    document.querySelectorAll('[data-knr-faq]').forEach(initFaq);
    document.querySelectorAll('[data-knr-before-after]').forEach(initBeforeAfter);
    document.querySelectorAll('[data-knr-review-carousel]').forEach(initReviewCarousel);
  });
})();
