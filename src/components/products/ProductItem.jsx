'use client'
import React, { useContext, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import CartContext from "@/context/CartContext";
import { useRouter } from "next/navigation";

const ProductItem = ({ product }) => {
  const { cart, addItemToCart } = useContext(CartContext);
  const [inCart, setInCart] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if the product is already in the cart
    const isInCart = cart.cartItems.some(item => item.product === product._id);
    setInCart(isInCart);
  }, [cart.cartItems, product._id]);

  const addToCartHandler = () => {
    try {
      addItemToCart({
        product: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || "/images/default_product.png",
        stock: product.stock,
        seller: product.seller,
      });

      // Update the button to show "View in Cart"
      setInCart(true);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
  };

  const handleViewInCart = () => {
    // Redirect to the cart page
    router.push('/cart');
  };

  return (
    <article className="border border-gray-200 overflow-hidden bg-white shadow-sm rounded mb-5">
      <div className="flex flex-col items-center md:items-stretch md:flex-row">
        <div className="md:w-1/4 flex justify-center md:justify-start p-3">
          <div
            style={{
              width: "100%",
              height: "auto",
              position: "relative",
            }}
          >
            <Image
              src={
                product?.images[0]
                  ? product?.images[0].url
                  : "/images/default_product.png"
              }
              alt="product name"
              height="240"
              width="240"
              className="object-contain"
            />
          </div>
        </div>
        <div className="md:w-2/4 flex flex-col justify-center p-4">
          <Link
            href={`/product/${product._id}`}
            className="hover:text-blue-600 text-lg font-semibold"
          >
            {product.name}
          </Link>
        </div>
        <div className="md:w-1/4 flex flex-col justify-center items-center md:items-start border-t md:border-t-0 md:border-l border-gray-200 p-5">
          <span className="text-xl font-semibold text-black">
            ${product?.price}
          </span>
          <p className="text-green-500">Free Shipping</p>
          <div className="my-3">
            {inCart ? (
              <a
                className="px-4 py-2 inline-block text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700 cursor-pointer"
                onClick={handleViewInCart}
              >
                View in Cart
              </a>
            ) : (
              <a
                className="px-4 py-2 inline-block text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 cursor-pointer"
                onClick={addToCartHandler}
              >
                Add to Cart
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProductItem;
