async function payNow() {
  const response = await fetch("http://localhost:3000/api/payment/initiate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: 100,
      currency: "BWP",
      email: "test@example.com"
    })
  });

  const data = await response.json();
  window.location.href = data.paymentURL;
}
