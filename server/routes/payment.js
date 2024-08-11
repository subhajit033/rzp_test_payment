import express from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';

const router = express.Router();

const razorpayInstance = new Razorpay({
  key_id: '',
  key_secret: '',
});

// ROUTE 1
router.get('/get-payment', (req, res) => {
  res.json('Payment Details');
});

router.post('/create-order', async (req, res) => {
  const { amount } = req.body;
  try {
    await razorpayInstance.orders.create(
      {
        amount: Number(amount * 100),
        currency: 'INR',
        receipt: 'receipt#1',
        notes: {
          key1: 'value3',
          key2: 'value2',
        },
      },
      (err, data) => {
        if (err) {
          console.log(err);
          res.status(400).json({ err });
        }
        console.log(data);
        res.status(200).json({ data });
      }
    );
  } catch (e) {
    console.log(e);
  }
});

router.post('/verify-payment', async (req, res) => {
  try {
    // getting the details back from our font-end
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      data
    } = req.body;

    //get all the deatils like what type of things has uuser purchaded  
    const details = await razorpayInstance.payments.fetch(razorpayPaymentId)
    console.log(details);

    // Creating our own digest
    // The format should be like this:
    // digest = hmac_sha256(orderCreationId + "|" + razorpayPaymentId, secret);
    const shasum = crypto.createHmac('sha256', 'RAZOR_PAy_SECRET');

    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest('hex');

    // comaparing our digest with the actual signature
    if (digest !== razorpaySignature)
      return res.status(400).json({ msg: 'Transaction not legit!' });

    // THE PAYMENT IS LEGIT & VERIFIED
    // YOU CAN SAVE THE DETAILS IN YOUR DATABASE IF YOU WANT

    res.status(200).json({
      msg: 'success',
      orderId: razorpayOrderId,
      paymentId: razorpayPaymentId,
    });
  } catch (error) {
    res.status(500).send(error);
  }
});

export default router;
