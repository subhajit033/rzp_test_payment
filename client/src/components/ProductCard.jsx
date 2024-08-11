import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Button,
} from '@material-tailwind/react';
import axios from 'axios';
import { loadScript } from '@/lib/utils';
import { useState } from 'react';

export default function ProductCard() {
  const [amount, setAmount] = useState('399');

  async function displayRazorpay() {
    const res = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );

    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    const result = await axios.post(
      'http://localhost:4000/api/payment/create-order',
      {
        amount: '399',
      }
    );

    if (!result) {
      alert('Server error. Are you online?');
      return;
    }
    console.log(result);

    const { amount, id: order_id, currency } = result.data.data;

    const options = {
      key: 'KET_ID', // Enter the Key ID generated from the Dashboard
      amount: amount.toString(),
      currency: currency,
      name: 'Subhajit Kundu',

      description: 'Test Transaction',
      image:
        'https://th.bing.com/th/id/OIP.g5AKW21APdv9ToQ-pwgo9AHaGK?rs=1&pid=ImgDetMain',
      order_id: order_id,
      handler: async function (response) {
        const data = {
          orderCreationId: order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpayOrderId: response.razorpay_order_id,
          razorpaySignature: response.razorpay_signature,
          data: response,
        };

        const result = await axios.post(
          'http://localhost:4000/api/payment/verify-payment',
          data
        );

        alert(result.data.msg);
      },
      prefill: {
        name: 'Subhajit Kundu',
        email: 'subha@gmail.com',
        contact: '9999999999',
      },
      notes: {
        address: 'Kolkata',
      },
      theme: {
        color: '#61dafb',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  }
  return (
    <Card className='mt-6 w-96 bg-[#222f3e] text-white'>
      {/* CardHeader */}
      <CardHeader color='' className='relative h-96 bg-[#2C3A47]'>
        {/* Image  */}
        <img
          src='https://codeswear.nyc3.cdn.digitaloceanspaces.com/tshirts/pack-of-five-plain-tshirt-white/1.webp'
          alt='card-image'
        />
      </CardHeader>

      {/* CardBody */}
      <CardBody>
        {/* Typography For Title */}
        <Typography variant='h5' className='mb-2'>
          My First Product
        </Typography>

        {/* Typography For Price  */}
        <Typography>
          {`₹${amount}`} <span className=' line-through'>{`₹699`}</span>
        </Typography>
      </CardBody>

      {/* CardFooter  */}
      <CardFooter className='pt-0'>
        {/* Buy Now Button  */}
        <Button onClick={displayRazorpay} className='w-full bg-[#1B9CFC]'>
          Buy Now
        </Button>
      </CardFooter>
    </Card>
  );
}
