import React from "react";
import ProductList from "../components/ProductList";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Products</h1>
        <Link to="/cart">
          <button className="bg-green-500 text-white py-2 px-4 rounded transition-all duration-300 hover:bg-green-600">
            View Cart
          </button>
        </Link>
      </div>
      <ProductList />
    </div>
  );
};

export default HomePage;
