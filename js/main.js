var url = "https://spreadsheets.google.com/feeds/list/1mxmW0YljLEcNP1BUJoUlAEtzzE0FXwbaDBPN26dlloo/od6/public/basic?alt=json";

var now = new Date;

tinyGET(url, null, function(data) {
  var raised = '$' + data.feed.entry[0].content['$t'].split(': ')[1];
  var pizzas = data.feed.entry[1].content['$t'].split(': ')[1];
  var remaining = '$' + data.feed.entry[2].content['$t'].split(': ')[1];
  document.getElementById('stat-raised').innerHTML = raised;
  document.getElementById('stat-pizzas').innerHTML = pizzas;
  document.getElementById('stat-remaining').innerHTML = remaining;
  document.getElementById('stat-info').innerHTML = 'As of ' + now.toLocaleString();
});

var handler = StripeCheckout.configure({
  key: 'pk_live_P8CQD0jjeNY83ykHy75Bfxig',
  image: 'https://polls.pizza/images/logo.png',
  locale: 'auto',
  token: function(token) {
    tinyPOST(
      'https://docs.google.com/forms/d/e/1FAIpQLSf5RPXqXaVk8KwKC7kzthukydvA9vL7_bP9V9O9PIAiXl14cQ/formResponse',
      {
        'entry.1599572815': token.email,
        'entry.690252188': token.card.address_zip,
        'entry.1474063298': token.id,
        'entry.1036377864': (window.amount).toString()
      }
    )
  }
});

var getAmount = function() {
  var radios = document.getElementsByName('amount');
  var custom = document.getElementById('custom-amount');
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

document.getElementById('donate-form').addEventListener('change', function(e) {
  var amount = getAmount();
  if (amount) {
    document.getElementById('checkout').classList.remove('is-disabled');
  } else {
    document.getElementById('checkout').classList.add('is-disabled');
  }
});

document.getElementById('checkout').addEventListener('click', function(e) {
  var amount = getAmount(),
      pizzas = Math.ceil(amount/100/13.5)

  if (amount) {
    // Open Checkout with further options:
    handler.open({
      name: 'Pizza to the Polls',
      description: 'About '+pizzas+' Pizza' + (pizzas > 1 ? 's' : ''),
      zipCode: true,
      amount: amount,
      image: 'https://polls.pizza/images/logo.png'
    });
    window.amount = amount / 100
    e.preventDefault();
  }
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
