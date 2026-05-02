document.addEventListener("DOMContentLoaded", function () {
  const menuItems = [
    {
      id: "flat-white",
      category: "hot",
      name: "Flat White",
      price: 95,
      calories: 120,
      description: "Double espresso with smooth microfoam and a richer finish.",
      accent: "#c88f63"
    },
    {
      id: "signature-latte",
      category: "hot",
      name: "Signature Latte",
      price: 99,
      calories: 180,
      description: "Silky milk, Costa espresso, and a balanced caramel sweetness.",
      accent: "#d7a77b"
    },
    {
      id: "cappuccino",
      category: "hot",
      name: "Cappuccino",
      price: 92,
      calories: 140,
      description: "Classic espresso, warm milk, and a thick foam cap.",
      accent: "#b98559"
    },
    {
      id: "iced-spanish-latte",
      category: "cold",
      name: "Iced Spanish Latte",
      price: 110,
      calories: 240,
      description: "Cold espresso with creamy milk and a sweet finish over ice.",
      accent: "#d5b091"
    },
    {
      id: "cold-brew",
      category: "cold",
      name: "Cold Brew",
      price: 98,
      calories: 35,
      description: "Slow-steeped coffee with a clean body and smooth lift.",
      accent: "#8b624c"
    },
    {
      id: "berry-refresher",
      category: "cold",
      name: "Berry Refresher",
      price: 102,
      calories: 90,
      description: "Bright fruit notes and chilled citrus made for warm days.",
      accent: "#c4798d"
    },
    {
      id: "turkey-cheese-croissant",
      category: "food",
      name: "Turkey Cheese Croissant",
      price: 115,
      calories: 320,
      description: "Buttery layers filled with smoky turkey and melted cheese.",
      accent: "#d8b281"
    },
    {
      id: "almond-brownie",
      category: "food",
      name: "Almond Brownie",
      price: 88,
      calories: 290,
      description: "Dense chocolate brownie with toasted almond crunch.",
      accent: "#7c5543"
    },
    {
      id: "chicken-caesar-wrap",
      category: "food",
      name: "Chicken Caesar Wrap",
      price: 125,
      calories: 360,
      description: "A fast lunch option with grilled chicken and crisp greens.",
      accent: "#b2a46d"
    }
  ];

  const stores = [
    {
      id: "city-stars",
      name: "City Stars Mall",
      area: "Nasr City, Cairo",
      lat: 30.0738,
      lng: 31.3461,
      openHour: 8,
      closeHour: 24
    },
    {
      id: "festival-city",
      name: "Cairo Festival City",
      area: "New Cairo",
      lat: 30.0285,
      lng: 31.4098,
      openHour: 8,
      closeHour: 23
    },
    {
      id: "mall-of-arabia",
      name: "Mall of Arabia",
      area: "6th of October, Giza",
      lat: 30.0716,
      lng: 30.9715,
      openHour: 10,
      closeHour: 23
    },
    {
      id: "point-90",
      name: "Point 90",
      area: "New Cairo",
      lat: 29.9885,
      lng: 31.4402,
      openHour: 9,
      closeHour: 24
    },
    {
      id: "mall-of-egypt",
      name: "Mall of Egypt",
      area: "6th of October, Giza",
      lat: 29.9722,
      lng: 30.9577,
      openHour: 10,
      closeHour: 23
    },
    {
      id: "heliopolis-club",
      name: "Heliopolis Club",
      area: "Heliopolis, Cairo",
      lat: 30.0916,
      lng: 31.3158,
      openHour: 7,
      closeHour: 23
    }
  ];

  const STORAGE_KEY = "costa-redesign-cart";
  const fallbackCoords = { lat: 30.0444, lng: 31.2357 };

  let activeCategory = "hot";
  let cart = loadCart();
  let currentCoords = fallbackCoords;
  let selectedStoreId = stores[0].id;
  let lastFocusedElement = null;

  const navbar = document.querySelector(".navbar");
  const navToggle = document.getElementById("nav-toggle");
  const mobileMenu = document.getElementById("mobile-menu");
  const menuGrid = document.getElementById("menu-grid");
  const storesGrid = document.getElementById("stores-grid");
  const tabButtons = Array.from(document.querySelectorAll(".tab-button"));
  const useLocationButton = document.getElementById("use-location");
  const locationStatus = document.getElementById("location-status");
  const heroPickupTime = document.getElementById("hero-pickup-time");
  const heroStoreName = document.getElementById("hero-store-name");
  const heroStoreDistance = document.getElementById("hero-store-distance");
  const heroStoreBadge = document.getElementById("hero-store-badge");
  const cartTrigger = document.getElementById("cart-trigger");
  const navCartCount = document.getElementById("nav-cart-count");
  const cartBar = document.getElementById("cart-bar");
  const cartBarTrigger = document.getElementById("cart-bar-trigger");
  const cartBarCount = document.getElementById("cart-bar-count");
  const cartBarTotal = document.getElementById("cart-bar-total");
  const cartOverlay = document.getElementById("cart-overlay");
  const cartDrawer = document.getElementById("cart-drawer");
  const cartClose = document.getElementById("cart-close");
  const cartItemsContainer = document.getElementById("cart-items");
  const cartEmpty = document.getElementById("cart-empty");
  const cartTotal = document.getElementById("cart-total");
  const checkoutButton = document.getElementById("checkout-button");

  const revealObserver = createRevealObserver();

  renderMenu();
  renderStores(currentCoords);
  renderCart();
  observeRevealElements();
  handleScroll();

  window.addEventListener("scroll", handleScroll);

  navToggle.addEventListener("click", function () {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.hidden = isOpen;
    document.body.classList.toggle("menu-open", !isOpen);
  });

  mobileMenu.addEventListener("click", function (event) {
    if (event.target.tagName === "A") {
      navToggle.setAttribute("aria-expanded", "false");
      mobileMenu.hidden = true;
      document.body.classList.remove("menu-open");
    }
  });

  tabButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      activeCategory = button.dataset.category;
      tabButtons.forEach(function (tab) {
        const isActive = tab === button;
        tab.classList.toggle("is-active", isActive);
        tab.setAttribute("aria-selected", String(isActive));
      });
      renderMenu();
      observeRevealElements();
    });
  });

  menuGrid.addEventListener("click", function (event) {
    const addButton = event.target.closest("[data-add-id]");
    if (!addButton) {
      return;
    }

    addItem(addButton.dataset.addId);
  });

  storesGrid.addEventListener("click", function (event) {
    const pickupButton = event.target.closest("[data-store-select]");
    if (!pickupButton) {
      return;
    }

    selectedStoreId = pickupButton.dataset.storeSelect;
    renderStores(currentCoords);
  });

  useLocationButton.addEventListener("click", function () {
    if (!navigator.geolocation) {
      locationStatus.textContent = "Location is not available in this browser. Showing stores from central Cairo.";
      return;
    }

    locationStatus.textContent = "Finding your closest Costa...";

    navigator.geolocation.getCurrentPosition(
      function (position) {
        currentCoords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        locationStatus.textContent = "Showing nearest stores to your current location.";
        renderStores(currentCoords);
        observeRevealElements();
      },
      function () {
        locationStatus.textContent = "Location permission was blocked. Showing stores from central Cairo.";
        currentCoords = fallbackCoords;
        renderStores(currentCoords);
        observeRevealElements();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000
      }
    );
  });

  cartTrigger.addEventListener("click", function () {
    openCart(cartTrigger);
  });

  cartBarTrigger.addEventListener("click", function () {
    openCart(cartBarTrigger);
  });

  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  cartItemsContainer.addEventListener("click", function (event) {
    const button = event.target.closest("[data-cart-action]");
    if (!button) {
      return;
    }

    const itemId = button.dataset.itemId;
    const action = button.dataset.cartAction;

    if (action === "increase") {
      addItem(itemId);
      return;
    }

    if (action === "decrease") {
      updateItemQuantity(itemId, -1);
      return;
    }

    if (action === "remove") {
      delete cart[itemId];
      saveCart();
      renderCart();
      renderMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (document.body.classList.contains("menu-open")) {
        navToggle.setAttribute("aria-expanded", "false");
        mobileMenu.hidden = true;
        document.body.classList.remove("menu-open");
      }

      if (document.body.classList.contains("cart-open")) {
        closeCart();
      }
    }
  });

  function renderMenu() {
    const filteredItems = menuItems.filter(function (item) {
      return item.category === activeCategory;
    });

    menuGrid.innerHTML = filteredItems.map(function (item) {
      const quantity = cart[item.id] || 0;
      const addLabel = quantity > 0 ? "Add another" : "Add";
      const stateClass = quantity > 0 ? " is-added" : "";

      return [
        '<article class="product-card" data-reveal>',
        '  <div class="product-visual" style="background: linear-gradient(135deg, ' + hexToRgba(item.accent, 0.92) + ', rgba(245, 233, 226, 0.92));">',
        '    <span class="product-badge">' + capitalize(item.category) + "</span>",
        "  </div>",
        '  <div class="product-card-body">',
        '    <div class="product-topline">',
        "      <div>",
        "        <h3>" + item.name + "</h3>",
        "      </div>",
        '      <span class="product-price">' + formatPrice(item.price) + "</span>",
        "    </div>",
        '    <p class="product-note">' + item.description + "</p>",
        '    <div class="product-footer">',
        '      <span class="product-calories">' + item.calories + " cal</span>",
        '      <button class="add-button' + stateClass + '" type="button" data-add-id="' + item.id + '">' + addLabel + "</button>",
        "    </div>",
        "  </div>",
        "</article>"
      ].join("");
    }).join("");
  }

  function renderStores(coords) {
    const enrichedStores = stores.map(function (store) {
      return Object.assign({}, store, {
        distance: calculateDistance(coords, store),
        isOpen: getStoreOpenState(store)
      });
    }).sort(function (first, second) {
      return first.distance - second.distance;
    });

    if (!selectedStoreId || !enrichedStores.some(function (store) { return store.id === selectedStoreId; })) {
      selectedStoreId = enrichedStores[0].id;
    }

    storesGrid.innerHTML = enrichedStores.map(function (store) {
      const selectedClass = store.id === selectedStoreId ? " is-selected" : "";
      const statusClass = store.isOpen ? "is-open" : "is-closed";
      const statusText = store.isOpen ? "Open now" : "Closed now";
      const mapsQuery = encodeURIComponent(store.name + ", " + store.area);

      return [
        '<article class="store-card" data-reveal>',
        '  <div class="store-card-top">',
        "    <div>",
        '      <span class="store-distance">' + formatDistance(store.distance) + "</span>",
        "      <h3>" + store.name + "</h3>",
        "    </div>",
        '    <span class="store-status ' + statusClass + '">' + statusText + "</span>",
        "  </div>",
        '  <p class="store-address">' + store.area + "</p>",
        '  <p class="store-hours">Open ' + formatHour(store.openHour) + " - " + formatHour(store.closeHour) + "</p>",
        '  <div class="store-actions">',
        '    <button class="store-secondary' + selectedClass + '" type="button" data-store-select="' + store.id + '">' + (store.id === selectedStoreId ? "Pickup Selected" : "Set as Pickup") + "</button>",
        '    <a class="store-primary" href="https://www.google.com/maps/search/?api=1&query=' + mapsQuery + '" target="_blank" rel="noreferrer">Directions</a>',
        "  </div>",
        "</article>"
      ].join("");
    }).join("");

    const selectedStore = enrichedStores.find(function (store) {
      return store.id === selectedStoreId;
    }) || enrichedStores[0];

    updateHeroStore(selectedStore);
  }

  function renderCart() {
    const entries = getCartEntries();
    const count = getCartCount(entries);
    const total = getCartTotal(entries);

    navCartCount.textContent = String(count);
    cartBarCount.textContent = count === 1 ? "1 item" : count + " items";
    cartBarTotal.textContent = formatPrice(total);
    cartTotal.textContent = formatPrice(total);
    checkoutButton.disabled = count === 0;

    cartBar.hidden = count === 0;
    document.body.classList.toggle("has-cart", count > 0);

    cartEmpty.hidden = count > 0;

    if (count === 0) {
      cartItemsContainer.innerHTML = "";
    } else {
      cartItemsContainer.innerHTML = entries.map(function (entry) {
        return [
          '<article class="cart-item">',
          '  <div class="cart-item-top">',
          "    <div>",
          "      <h3>" + entry.item.name + "</h3>",
          '      <p>' + formatPrice(entry.item.price) + " each</p>",
          "    </div>",
          '    <strong>' + formatPrice(entry.item.price * entry.quantity) + "</strong>",
          "  </div>",
          '  <div class="cart-item-controls">',
          '    <div class="quantity-stepper" aria-label="Quantity controls">',
          '      <button type="button" data-cart-action="decrease" data-item-id="' + entry.item.id + '" aria-label="Decrease quantity">-</button>',
          "      <span>" + entry.quantity + "</span>",
          '      <button type="button" data-cart-action="increase" data-item-id="' + entry.item.id + '" aria-label="Increase quantity">+</button>',
          "    </div>",
          '    <button class="cart-remove" type="button" data-cart-action="remove" data-item-id="' + entry.item.id + '">Remove</button>',
          "  </div>",
          "</article>"
        ].join("");
      }).join("");
    }
  }

  function addItem(itemId) {
    cart[itemId] = (cart[itemId] || 0) + 1;
    saveCart();
    renderCart();
    renderMenu();
    observeRevealElements();
  }

  function updateItemQuantity(itemId, delta) {
    const nextValue = (cart[itemId] || 0) + delta;

    if (nextValue <= 0) {
      delete cart[itemId];
    } else {
      cart[itemId] = nextValue;
    }

    saveCart();
    renderCart();
    renderMenu();
  }

  function openCart(triggerElement) {
    lastFocusedElement = triggerElement || document.activeElement;
    document.body.classList.add("cart-open");
    cartOverlay.hidden = false;
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartTrigger.setAttribute("aria-expanded", "true");
    cartClose.focus();
  }

  function closeCart() {
    document.body.classList.remove("cart-open");
    cartOverlay.hidden = true;
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartTrigger.setAttribute("aria-expanded", "false");

    if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
      lastFocusedElement.focus();
    }
  }

  function handleScroll() {
    navbar.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  function getCartEntries() {
    return Object.keys(cart).map(function (itemId) {
      return {
        item: menuItems.find(function (menuItem) {
          return menuItem.id === itemId;
        }),
        quantity: cart[itemId]
      };
    }).filter(function (entry) {
      return Boolean(entry.item);
    });
  }

  function getCartCount(entries) {
    return entries.reduce(function (sum, entry) {
      return sum + entry.quantity;
    }, 0);
  }

  function getCartTotal(entries) {
    return entries.reduce(function (sum, entry) {
      return sum + (entry.item.price * entry.quantity);
    }, 0);
  }

  function loadCart() {
    try {
      const savedCart = window.localStorage.getItem(STORAGE_KEY);
      return savedCart ? JSON.parse(savedCart) : {};
    } catch (error) {
      return {};
    }
  }

  function saveCart() {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }

  function updateHeroStore(store) {
    heroStoreName.textContent = store.name;
    heroStoreDistance.textContent = formatDistance(store.distance) + " away";
    heroStoreBadge.textContent = store.area.split(",")[0];
    heroPickupTime.textContent = "Ready in " + estimatePickupMinutes(store.distance) + " min";
  }

  function estimatePickupMinutes(distance) {
    const minutes = Math.max(7, Math.round((distance * 2.2) + 5));
    return minutes;
  }

  function calculateDistance(origin, store) {
    const earthRadius = 6371;
    const latDelta = toRadians(store.lat - origin.lat);
    const lngDelta = toRadians(store.lng - origin.lng);
    const startLat = toRadians(origin.lat);
    const endLat = toRadians(store.lat);

    const haversine = (Math.sin(latDelta / 2) * Math.sin(latDelta / 2)) +
      (Math.cos(startLat) * Math.cos(endLat) * Math.sin(lngDelta / 2) * Math.sin(lngDelta / 2));

    return earthRadius * (2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine)));
  }

  function toRadians(value) {
    return value * (Math.PI / 180);
  }

  function formatDistance(distance) {
    if (distance < 1) {
      return Math.round(distance * 1000) + " m";
    }

    return distance.toFixed(1) + " km";
  }

  function getStoreOpenState(store) {
    const hour = new Date().getHours();

    if (store.closeHour === 24) {
      return hour >= store.openHour;
    }

    if (store.closeHour > store.openHour) {
      return hour >= store.openHour && hour < store.closeHour;
    }

    return hour >= store.openHour || hour < store.closeHour;
  }

  function formatHour(hour) {
    if (hour === 24) {
      return "12:00 AM";
    }

    if (hour === 12) {
      return "12:00 PM";
    }

    if (hour === 0) {
      return "12:00 AM";
    }

    if (hour > 12) {
      return (hour - 12) + ":00 PM";
    }

    return hour + ":00 AM";
  }

  function formatPrice(value) {
    return "EGP " + value;
  }

  function capitalize(value) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  function hexToRgba(hex, alpha) {
    const normalized = hex.replace("#", "");
    const red = parseInt(normalized.substring(0, 2), 16);
    const green = parseInt(normalized.substring(2, 4), 16);
    const blue = parseInt(normalized.substring(4, 6), 16);
    return "rgba(" + red + ", " + green + ", " + blue + ", " + alpha + ")";
  }

  function createRevealObserver() {
    if (!("IntersectionObserver" in window)) {
      return null;
    }

    return new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.14
    });
  }

  function observeRevealElements() {
    const revealElements = document.querySelectorAll("[data-reveal]");

    revealElements.forEach(function (element) {
      if (element.classList.contains("is-visible")) {
        return;
      }

      if (!revealObserver) {
        element.classList.add("is-visible");
        return;
      }

      revealObserver.observe(element);
    });
  }
});
