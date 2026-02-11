const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/initiate', async (req, res) => {
  const { amount, currency, customerEmail } = req.body;

  try {
    const response = await axios.post(
      process.env.DPO_API_URL + "createToken",
      {
        CompanyToken: process.env.DPO_COMPANY_TOKEN,
        ServiceType: process.env.DPO_SERVICE_TYPE,
        Amount: amount,
        Currency: currency,
        RedirectURL: `${process.env.BASE_URL}/success`,
        BackURL: `${process.env.BASE_URL}/cancel`,
        CustomerEmail: customerEmail
      }
    );

    res.json({
      paymentURL: response.data.PaymentURL
    });

  } catch (error) {
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

module.exports = router;

// DPO redirects here after payment
router.get('/success', async (req, res) => {
  const transactionToken = req.query.TransactionToken;

  if (!transactionToken) {
    return res.status(400).send("Missing transaction token");
  }

  try {
    // Verify payment with DPO
    const verifyResponse = await axios.post(
      process.env.DPO_API_URL + "verifyToken",
      {
        CompanyToken: process.env.DPO_COMPANY_TOKEN,
        TransactionToken: transactionToken
      }
    );

    const paymentStatus = verifyResponse.data.Result;

    if (paymentStatus === "000") {
      // SUCCESS
      res.redirect(`/receipt?token=${transactionToken}`);
    } else {
      // FAILED
      res.redirect('/failed.html');
    }

  } catch (error) {
    res.status(500).send("Verification failed");
  }
});
router.get('/receipt', async (req, res) => {
  const token = req.query.token;

  res.json({
    message: "Payment verified",
    transactionToken: token
  });
});


