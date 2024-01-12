/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import {
  loadStripe,
} from "@stripe/stripe-js";
import { useEffect, useState } from "react";

export default function PaymentConfirmationView() {
  const [stripePromise, setStripePromise] = useState(null);
  const [clientSecret, setClientSecret] = useState("");

  useEffect(() => {
    const publishableKey = "pk_test_hnNdXEiRdGcV3AfTEuXFxPZu";
    setStripePromise(loadStripe(publishableKey));
  }, []);

  useEffect(() => {
    createPaymentIntent();
  }, []);

  const createPaymentIntent = () => {
    fetch("http://127.0.0.1:8888/admin/payments/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        currency: "HKD",
        amountInCents: 10000,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        console.log('client secret: ' + data.data.clientSecret);
        setClientSecret(data.data.clientSecret);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      <h1>Payment Confirmation</h1>
      {stripePromise && clientSecret && (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            locale: "zh-HK",
            appearance: {
                theme: "stripe",
                          variables: {
                borderRadius: "0",
                colorPrimary: "#231B55",
                focusOutline: "none",
              },
            }
            // appearance: {
            //   theme: "stripe",
            //   variables: {
            //     borderRadius: "0.75rem",
            //     colorPrimary: "#231B55",
            //     focusOutline: "none",
            //   },
            // },
          }}
        >
          <CustomEmbeddedPaymentForm />
        </Elements>
      )}
    </>
  );
}

function CustomEmbeddedPaymentForm() {
  const [message, setMessage] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsProcessing(true);
    elements;

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
    });

    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsProcessing(false);
  };

  return (
    <>
      <form id="payment-form" onSubmit={handleSubmit}>
        <PaymentElement
          id="payment-element"
          //   className="m-2 border-2 border-[#231B55] rounded-xl"
        />
        {/* <CardElement id="card-element" className="flex flex-col" /> */}
        {/* <ExpressCheckoutElement
          id="express-checkout-element"
          className=""
          onConfirm={() => {
            window.location.href = "/completion";
          }}
        /> */}
        <button disabled={isProcessing || !stripe || !elements} id="submit">
          <span id="button-text">
            {isProcessing ? "Processing ... " : "Pay now"}
          </span>
        </button>
        {/* Show any error or success messages */}
        {message && <div id="payment-message">{message}</div>}
      </form>
    </>
  );
}
