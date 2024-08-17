"use client";

import { createContext, useState, useEffect } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ cartItems: [] }); // Ensure cartItems is always an array

  useEffect(() => {
    setCartToState();
  }, []);

  const setCartToState = () => {
    const storedCart = localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : { cartItems: [] }; // Default to an empty array if not found

    setCart(storedCart);
  };

  const addItemToCart = async ({
    product,
    name,
    price,
    image,
    stock,
    seller,
    quantity = 1,
  }) => {
    const item = {
      product,
      name,
      price,
      image,
      stock,
      seller,
      quantity,
    };

    // Ensure cartItems is an array before trying to call find
    const isItemExist = cart.cartItems?.find((i) => i.product === item.product);

    let newCartItems;

    if (isItemExist) {
      newCartItems = cart.cartItems.map((i) =>
        i.product === isItemExist.product ? item : i
      );
    } else {
      newCartItems = [...cart.cartItems, item];
    }

    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();
  };

  const deleteItemFromCart = async (id) => {
    const newCartItems = cart.cartItems?.filter((i) => i.product !== id); // Safe check

    localStorage.setItem("cart", JSON.stringify({ cartItems: newCartItems }));
    setCartToState();
  };

  const clearCart = () => {
    setCart({ cartItems: [] });
    localStorage.removeItem("cart");
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addItemToCart,
        deleteItemFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
