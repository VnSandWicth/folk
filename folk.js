const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const midtransClient = require("midtrans-client");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Konfigurasi Midtrans
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "YOUR_MIDTRANS_SERVER_KEY",
});

app.post("/api/checkout", async (req, res) => {
  try {
    const { amount } = req.body;
    const transactionDetails = {
      transaction_details: {
        order_id: "order-" + new Date().getTime(),
        gross_amount: amount,
      },
    };

    const transaction = await snap.createTransaction(transactionDetails);
    res.json({ paymentUrl: transaction.redirect_url });
  } catch (error) {
    res.status(500).json({ error: "Gagal memproses pembayaran" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server berjalan di port ${PORT}`));
