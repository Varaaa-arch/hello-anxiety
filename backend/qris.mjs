// qris.mjs
import express from "express";
import qrcode from "qrcode";

const qrisRouter = express.Router();
const orders = {}; 

// Generate QRIS
qrisRouter.post("/qris", async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    if (!amount || !orderId) {
      return res.status(400).json({ success: false, message: "amount & orderId wajib" });
    }

    const qrisData = `QRIS|ORDER:${orderId}|AMOUNT:${amount}`;
    const qrImage = await qrcode.toDataURL(qrisData);

    orders[orderId] = { status: "PENDING", amount: Number(amount) };

    // simulasi auto paid setelah 10 detik
    setTimeout(() => {
      if (orders[orderId] && orders[orderId].status === "PENDING") {
        orders[orderId].status = "PAID";
      }
    }, 10000);

    res.json({ success: true, orderId, amount, qrImage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "QRIS failed", error: String(error) });
  }
});

// Cek status pembayaran
qrisRouter.get("/status", (req, res) => {
  const { orderId } = req.query;
  if (!orderId) return res.status(400).json({ success: false, message: "orderId wajib" });
  const order = orders[orderId];
  if (!order) return res.status(404).json({ success: false, message: "Order not found" });
  res.json({ success: true, orderId, status: order.status });
});

export default qrisRouter;
