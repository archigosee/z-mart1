"use client";

import React from "react";
import Link from "next/link";

const OrderConfirmed = () => {
  return (
    <section className="bg-white py-10">
      <div className="container max-w-screen-xl mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-gray-600 mb-8">
            Thank you for your purchase. Your order has been placed successfully.
          </p>
          <Link href="/">
            <span className="px-4 py-2 inline-block text-lg font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
              Back to Shopping
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OrderConfirmed;
