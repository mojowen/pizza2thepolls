var stripe = require('stripe')(process.env.STRIPE_KEY)

function charge(params, callback) {
  stripe.charges.create(
    {
      amount: parseInt(params.amount) * 100,
      currency: "usd",
      source: params.token,
      receipt_email: params.email,
      description: "Donation to Pizza to the Polls"
    },
    (err, charge) => { callback(err, charge) }
  )
}

module.exports = charge