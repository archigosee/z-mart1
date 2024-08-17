"use client";

import React, { useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CartContext from "@/context/CartContext";
import Link from "next/link";
import Image from "next/image";
import WebApp from '@twa-dev/sdk'; // Import the Telegram WebApp SDK

const Cart = () => {
  const { cart, addItemToCart, deleteItemFromCart, clearCart } = useContext(CartContext);
  const router = useRouter();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Fetch the user data from Telegram WebApp SDK
    if (typeof window !== 'undefined' && WebApp.initDataUnsafe.user) {
      setUserData(WebApp.initDataUnsafe.user);
    }
  }, []);

  const increaseQty = (cartItem) => {
    const newQty = cartItem?.quantity + 1;
    if (newQty > Number(cartItem.stock)) return;

    addItemToCart({ ...cartItem, quantity: newQty });
  };

  const decreaseQty = (cartItem) => {
    const newQty = cartItem?.quantity - 1;
    if (newQty <= 0) return;

    addItemToCart({ ...cartItem, quantity: newQty });
  };

  const amountWithoutcom = cart?.cartItems?.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const commissionamount = (amountWithoutcom * 0.02).toFixed(2);
  const totalAmount = (Number(amountWithoutcom) + Number(commissionamount)).toFixed(2);

  const handleContinue = async () => {
    try {
      const orderItems = cart.cartItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        image: item.image,
        price: item.price,
        product: item.product,
      }));
  
      const userId = userData?.id;
  
      if (!userId) {
        console.error('User ID is not available. Cannot place order.');
        return;
      }
  
      if (orderItems.length === 0 || totalAmount <= 0) {
        console.error('Invalid order details. Cannot place order.');
        return;
      }
  
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          orderItems,
          totalAmount,
          commissionamount: Number(commissionamount),
        }),
      });
  
      if (response.ok) {
        clearCart();
        router.push('/order-confirmed');
      } else {
        console.error('Failed to create order:', response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  
  
  

  return (
    <>
      <section className="py-5 sm:py-7 bg-blue-100">
        <div className="container max-w-screen-xl mx-auto px-4">
          <h2 className="text-3xl font-semibold mb-2">
            {cart?.cartItems?.length || 0} Item(s) in Cart
          </h2>
        </div>
      </section>

      {cart?.cartItems?.length > 0 ? (
        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4">
              <main className="md:w-3/4">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                  {cart?.cartItems?.map((cartItem) => (
                    <div key={cartItem.product}>
                      <div className="flex flex-wrap lg:flex-row gap-5 mb-4 items-center">
                        <div className="w-full lg:w-2/5 xl:w-2/4">
                          <figure className="flex leading-5">
                            <div>
                              <div className="block w-24 h-24 md:w-32 md:h-32 rounded border border-gray-200 overflow-hidden relative">
                                <Image
                                  src={cartItem.image}
                                  alt={cartItem.name}
                                  layout="fill"
                                  objectFit="cover"
                                />
                              </div>
                            </div>
                            <figcaption className="ml-3">
                              <p>
                                <Link href="#">
                                  <span className="hover:text-blue-600">
                                    {cartItem.name}
                                  </span>
                                </Link>
                              </p>
                              <p className="mt-1 text-gray-400">
                                Seller: {cartItem.seller}
                              </p>
                            </figcaption>
                          </figure>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <button
                              className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 md:w-12 rounded-l cursor-pointer outline-none"
                              onClick={() => decreaseQty(cartItem)}
                            >
                              <span className="m-auto text-xl font-thin">−</span>
                            </button>
                            <input
                              type="number"
                              className="outline-none focus:outline-none text-center w-12 bg-gray-300 font-semibold text-md hover:text-black focus:text-black md:text-base cursor-default flex items-center text-gray-900"
                              name="custom-input-number"
                              value={cartItem.quantity}
                              readOnly
                            />
                            <button
                              className="bg-gray-300 text-gray-600 hover:text-gray-700 hover:bg-gray-400 h-full w-10 md:w-12 rounded-r cursor-pointer"
                              onClick={() => increaseQty(cartItem)}
                            >
                              <span className="m-auto text-xl font-thin">+</span>
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold not-italic">
                              ${(cartItem.price * cartItem.quantity).toFixed(2)}
                            </p>
                            <small className="text-gray-400">
                              ${cartItem.price} / per item
                            </small>
                          </div>
                        </div>
                        <div className="flex-auto">
                          <div className="float-right">
                            <button
                              className="px-4 py-2 inline-block text-red-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer"
                              onClick={() => deleteItemFromCart(cartItem.product)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>

                      <hr className="my-4" />
                    </div>
                  ))}
                </article>
              </main>
              <aside className="md:w-1/4">
                <article className="border border-gray-200 bg-white shadow-sm rounded mb-5 p-3 lg:p-5">
                  <ul className="mb-5">
                    <li className="flex justify-between text-gray-600 mb-1">
                      <span>Price:</span>
                      <span>${amountWithoutcom}</span>
                    </li>
                    <li className="flex justify-between text-gray-600 mb-1">
                      <span>Total Units:</span>
                      <span className="text-green-500">
                        {cart?.cartItems?.reduce(
                          (acc, item) => acc + item.quantity,
                          0
                        )}{" "}
                        (Units)
                      </span>
                    </li>
                    <li className="flex justify-between text-gray-600 mb-1">
                      <span>Commission:</span>
                      <span>${commissionamount}</span>
                    </li>
                    <li className="text-lg font-bold border-t flex justify-between mt-3 pt-3">
                      <span>Total price:</span>
                      <span>${totalAmount}</span>
                    </li>
                  </ul>

                  <button
                    className="px-4 py-3 mb-2 inline-block text-lg w-full text-center font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer"
                    onClick={handleContinue}
                  >
                    Continue
                  </button>

                  <Link href="/">
                    <span className="px-4 py-3 inline-block text-lg w-full text-center font-medium text-green-600 bg-white shadow-sm border border-gray-200 rounded-md hover:bg-gray-100">
                      Back to shop
                    </span>
                  </Link>
                </article>
              </aside>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-10">
          <div className="container max-w-screen-xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <Link href="/">
              <span className="px-4 py-2 inline-block text-lg font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
                Back to Shop
              </span>
            </Link>
          </div>
        </section>
      )}
    </>
  );
};

export default Cart;
