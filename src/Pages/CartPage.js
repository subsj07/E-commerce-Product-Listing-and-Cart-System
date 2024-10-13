import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
} from "../redux/cartSlice";

export default function Cart() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const handleRemoveFromCart = (item) => {
    dispatch(removeFromCart(item));
  };

  const handleIncreaseQuantity = (item) => {
    dispatch(increaseQuantity(item));
  };

  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      dispatch(decreaseQuantity(item));
    }
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const calculateTotalQuantity = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl flex flex-col">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p className="font-semibold mb-4">
          Total Items: {calculateTotalQuantity()}
        </p>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="flex-grow">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between mb-4 p-4 border-b"
              >
                <div className="flex items-center">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-16 h-16 object-cover rounded mr-4"
                  />
                  <div className="flex flex-col">
                    <h2 className="font-semibold">{item.title}</h2>
                    <p className="text-gray-600">Price: ${item.price}</p>
                    <div className="flex items-center mt-2">
                      <button
                        onClick={() => handleDecreaseQuantity(item)}
                        className="bg-gray-300 text-gray-800 py-1 px-2 rounded mr-2"
                      >
                        -
                      </button>
                      <p className="mx-2">Quantity: {item.quantity}</p>
                      <button
                        onClick={() => handleIncreaseQuantity(item)}
                        className="bg-gray-300 text-gray-800 py-1 px-2 rounded"
                      >
                        +
                      </button>
                      <p className="ml-4 font-semibold">
                        Total: ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveFromCart(item)}
                  className="bg-red-500 text-white py-1 px-3 rounded transition-all duration-300 hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
            <div className="flex justify-between font-semibold mt-4">
              <span>Total:</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
