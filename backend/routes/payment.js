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
