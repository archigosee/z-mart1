"use client";

import React, { useEffect, useState } from "react";
import WebApp from "@twa-dev/sdk"; // Import the Telegram SDK

const History = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // State to hold the user ID

  useEffect(() => {
    // Fetch the user ID from Telegram WebApp
    if (typeof window !== "undefined" && WebApp.initDataUnsafe.user) {
      setUserId(WebApp.initDataUnsafe.user.id);
    }
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) return; // Wait for userId to be available

      try {
        const response = await fetch(`/api/orders?userId=${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }
        const data = await response.json();
        setOrders(data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]); // Fetch orders when userId is available

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!orders.length) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="container max-w-screen-xl mx-auto px-4 py-5">
      <h1 className="text-3xl font-semibold mb-4">Order History</h1>
      <div className="grid grid-cols-1 gap-4">
        {orders.map((order) => (
          <div key={order._id} className="border border-gray-200 bg-white p-4 rounded shadow-sm">
            <h2 className="text-2xl font-semibold mb-2">Order ID: {order._id}</h2>
            <p><strong>Total Amount:</strong> ${order.totalAmount}</p>
            <p><strong>Status:</strong> {order.paymentStatus}</p>
            <ul className="mt-4">
              {order.orderItems.map((item) => (
                <li key={item.product} className="mb-2">
                  <p><strong>Product:</strong> {item.name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> ${item.price}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
