import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../redux/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((state) =>
    state.products.items.find((p) => p.id === parseInt(id))
  );
  const cartItems = useSelector((state) => state.cart.items);

  const isInCart = cartItems.find((item) => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      dispatch(addToCart(product));
    }
  };

  return (
    <div className="flex flex-col items-center">
      <img src={product.image} alt={product.title} className="h-48 w-auto" />
      <h1 className="text-2xl font-bold mt-4">{product.title}</h1>
      <p className="mt-2">{product.description}</p>
      <p className="text-xl font-semibold mt-2">${product.price}</p>
      <button
        onClick={handleAddToCart}
        className={`mt-4 py-2 px-4 rounded ${
          isInCart
            ? "bg-green-500 text-white cursor-not-allowed"
            : "bg-blue-500 text-white"
        }`}
        disabled={isInCart} // Disable button if the product is already in the cart
      >
        {isInCart ? "Added to Cart" : "Add to Cart"}
      </button>
    </div>
  );
}
