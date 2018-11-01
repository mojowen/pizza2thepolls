var totals_url =
  "https://spreadsheets.google.com/feeds/list/1mxmW0YljLEcNP1BUJoUlAEtzzE0FXwbaDBPN26dlloo/2/public/basic?alt=json";
var adresses_url =
  "https://spreadsheets.google.com/feeds/list/1mxmW0YljLEcNP1BUJoUlAEtzzE0FXwbaDBPN26dlloo/2/public/basic?alt=json";
var upcoming_url =
  "https://spreadsheets.google.com/feeds/list/1mxmW0YljLEcNP1BUJoUlAEtzzE0FXwbaDBPN26dlloo/3/public/basic?alt=json";
var deliveries_url =
  "https://spreadsheets.google.com/feeds/list/1mxmW0YljLEcNP1BUJoUlAEtzzE0FXwbaDBPN26dlloo/4/public/basic?alt=json";
var now = new Date();
var addresses = [];
var directPay;

/****************************
Site nav
****************************/
var menuToggle = document.getElementById("menu-toggle");
var menu = document.getElementById("menu");

menuToggle.addEventListener("click", function() {
  if (menu.getAttribute("aria-hidden") === "true") {
    menu.setAttribute("aria-hidden", "false");
  } else {
    menu.setAttribute("aria-hidden", "true");
  }
});

const checkWidthAndToggleMenu = () => {
  if (window.innerWidth > 600) {
    menu.setAttribute("aria-hidden", "false");
  } else {
    menu.setAttribute("aria-hidden", "true");
  }
};

window.addEventListener("resize", e => {
  checkWidthAndToggleMenu();
});

checkWidthAndToggleMenu();

/****************************
Locations
****************************/
const concatenateLocation = pieces => {
  let location = `${pieces.address} ${pieces.city}, ${pieces.state} <br> ${
    pieces.date
  }, ${pieces.time}`;

  if (pieces.pizza) {
    return `<a href="${pieces.report} target="blank" title="View report">${
      pieces.pizza
    } pizzas to ${location}</a>`;
  } else {
    return `<a href="${
      pieces.report
    } target="blank" title="View report">${location}</a>`;
  }
};

const parseLocations = (data, listID) => {
  data.feed.entry.map(entry => {
    let pieces = { address: entry.title["$t"] };
    entry.content["$t"].split(", ").map(piece => {
      const key = piece.split(": ")[0];
      const value = piece.split(": ")[1];
      pieces[key] = value;
    });
    const location = concatenateLocation(pieces);
    document.getElementById(listID).innerHTML += `<li>${location}</li>`;
  });
};

tinyGET(totals_url, function(data) {
  var now = new Date();
  var pizzas = data.feed.entry[0].content["$t"].split(": ")[1];
  var locations = data.feed.entry[1].content["$t"].split(": ")[1];
  var states = data.feed.entry[2].content["$t"].split(": ")[1];
  var raised = "$" + data.feed.entry[3].content["$t"].split(": ")[1];
  var raisedAllTime = "$" + data.feed.entry[4].content["$t"].split(": ")[1];
  var remaining = "$" + data.feed.entry[5].content["$t"].split(": ")[1];
  document.getElementById("stat-pizzas").innerHTML = pizzas;
  document.getElementById("stat-locations").innerHTML = locations;
  document.getElementById("stat-states").innerHTML = states;
  document.getElementById("stat-raised").innerHTML = raised;
  document.getElementById("stat-raised-alltime").innerHTML = raisedAllTime;
  document.getElementById("stat-remaining").innerHTML = remaining;
  document.getElementById("stat-info").innerHTML =
    "As of " + now.toLocaleString();
});

tinyGET(upcoming_url, data => {
  if (data.feed.entry) {
    parseLocations(data, "upcoming-list");
  } else {
    document.getElementById("upcoming-list").innerHTML = "<li>None yet</li>";
  }
});

tinyGET(deliveries_url, data => {
  if (data.feed.entry) {
    console.log(data.feed.entry);
    parseLocations(data, "deliveries-list");
  } else {
    document.getElementById("deliveries-list").innerHTML = "<li>None yet</li>";
  }
});

tinyGET(adresses_url, function(data) {
  for (var i = 0; i < data.feed.entry.length; i++) {
    var content = data.feed.entry[i].content["$t"],
      address = {},
      keys = content.match(/[a-z]*(?=:\s)/g).filter(function(el) {
        return el.length > 0;
      });
    values = content.split(/\,\s[a-z]*\:\s/).filter(function(el) {
      return el.length > 0;
    });
    for (var j = 0; j < keys.length; j++) {
      var key = keys[j];
      address[key] = values[j].replace(key + ": ", "");
    }
    try {
      address.timestamp = new Date(address.timestamp);
    } catch (e) {}
    addresses.push(address);
  }
});

var showConfirmation = function(amount) {
  var message = `Thanks for donating $${amount} to Pizza to the Polls. You'll receive a receipt in your email soon.`;
  document.getElementById("donate-confirmation-message").innerHTML = message;
  document.getElementById("donate-confirmation").removeAttribute("hidden");
  document.getElementById("donate-form").setAttribute("hidden", null);
};

var tokenHandler = function(token, callback) {
  tinyPOST(
    "https://docs.google.com/forms/d/e/1FAIpQLSf5RPXqXaVk8KwKC7kzthukydvA9vL7_bP9V9O9PIAiXl14cQ/formResponse",
    {
      "entry.1599572815": token.email,
      "entry.690252188": token.card.address_zip,
      "entry.1474063298": token.id,
      "entry.1036377864": window.amount.toString(),
      "entry.104127523": document.domain
    },
    callback || function() {}
  );

  showConfirmation(window.amount.toString());
};

var enableDirectPay = function(amount, pizzas) {
  var total = {
    label: "About " + pizzas + " Pizza" + (pizzas > 1 ? "s" : ""),
    amount: amount
  };

  // [Enable apple pay if possible
  if (directPay) {
    directPay.update({ total: total });
  } else {
    directPay = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: total,
      requestPayerName: true,
      requestPayerEmail: true
    });

    var prButton = elements.create("paymentRequestButton", {
      paymentRequest: directPay,
      style: {
        paymentRequestButton: {
          type: "donate",
          theme: "light",
          height: "60px"
        }
      }
    });

    directPay.canMakePayment().then(function(result) {
      if (result) {
        // dobt show apple pay button
        // document.getElementById('payment-request-button').style.display = 'block';
        // prButton.mount('#payment-request-button');
      } else {
        document.getElementById("payment-request-button").style.display =
          "none";
      }
    });
    directPay.on("token", function(ev) {
      tokenHandler(ev.token, function() {
        ev.complete("success");
      });
    });
  }
};

var handler = StripeCheckout.configure({
  key: "pk_live_P8CQD0jjeNY83ykHy75Bfxig",
  image: "https://polls.pizza/images/logo.png",
  locale: "auto",
  token: tokenHandler
});

var getAmount = function() {
  var radios = document.getElementsByName("amount");
  var custom = document.getElementById("custom-amount");
  var amount;

  if (custom.value) {
    amount = custom.value * 100;
  } else {
    for (var i = 0; i < radios.length; i++) {
      if (radios[i].checked) {
        amount = radios[i].value * 100;
      }
    }
  }

  return amount;
};

document.getElementById("donate-form").addEventListener("change", function(e) {
  var amount = getAmount(),
    pizzas = Math.ceil(amount / 100 / 20);

  if (amount) {
    document.getElementById("checkout").classList.remove("is-disabled");
    enableDirectPay(amount, pizzas);
  } else {
    document.getElementById("checkout").classList.add("is-disabled");
  }
});

document.getElementById("checkout").addEventListener("click", function(e) {
  var amount = getAmount(),
    pizzas = Math.ceil(amount / 100 / 20);

  if (amount) {
    // Open Checkout with further options:
    handler.open({
      name: "Pizza to the Polls",
      description: "About " + pizzas + " Pizza" + (pizzas > 1 ? "s" : ""),
      zipCode: true,
      amount: amount,
      image: "https://polls.pizza/images/logo.png"
    });
    window.amount = amount / 100;
    e.preventDefault();
  }
});

// Close Checkout on page navigation:
window.addEventListener("popstate", function() {
  handler.close();
});

// Apple / Google Pay
var stripe = Stripe("pk_live_P8CQD0jjeNY83ykHy75Bfxig");
var elements = stripe.elements();

// Address lookup

var placeSearch, autocomplete;
var componentForm = {
  street_number: "short_name",
  route: "long_name",
  locality: "long_name",
  administrative_area_level_1: "short_name",
  postal_code: "short_name",
  premise: "name",
  formatted_address: "formatted_address"
};

function toggleAddressVisibility() {
  const address = document.getElementById("address");
  if (address.getAttribute("hidden") !== null) {
    address.removeAttribute("hidden");
  } else {
    address.setAttribute("hidden", "");
  }
}

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
    document.getElementById("autocomplete"),
    { types: ["establishment"], componentRestrictions: { country: "us" } }
  );

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener("place_changed", fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = "";
  }

  toggleAddressVisibility();

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0],
      val = place.address_components[i][componentForm[addressType]];
    if (componentForm[addressType]) {
      document.getElementById(addressType).value = val;
    }
  }
  premise.value = place.name;
  formatted_address.value = place.formatted_address;
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

function handleSubmit() {
  /* TODO:
  - Check for required values
  -
  */
  var data = {};
  submit_message.textContent = "";

  Array.prototype.map.call(
    document.getElementById("form").querySelectorAll("input"),
    function(el) {
      data[el.name] = el.value;
    }
  );
  if (!data.full_place || !data.social_link) {
    submit_message.textContent =
      "Hmmm you are missing some crucial details there";
    return false;
  }
  tinyPOST(
    "https://hooks.zapier.com/hooks/catch/2966893/qk6is7/",
    data,
    function(resp) {
      toggleAddressVisibility();
      Array.prototype.map.call(
        document.getElementById("form").querySelectorAll("input"),
        function(el) {
          el.value = "";
        }
      );
      submit_message.textContent = "Thanks! We will get right on that";
    }
  );
}
