var handler = StripeCheckout.configure({
  key: 'pk_test_6pRNASCoBOKtIshFeQd4XMUh',
  image: 'https://stripe.com/img/documentation/checkout/marketplace.png',
  locale: 'auto',
  token: function(token) {
    // You can access the token ID with `token.id`.
    // Get the token ID to your server-side code for use.
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
  var amount = getAmount();

  if (amount) {
    // Open Checkout with further options:
    handler.open({
      name: 'Stripe.com',
      description: '2 widgets',
      zipCode: true,
      amount: amount
    });
    e.preventDefault();
  }
});

// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
