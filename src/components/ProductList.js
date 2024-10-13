import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import { Link } from "react-router-dom";
import { fetchProducts } from "../redux/productSlice";

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.products.items);
  const status = useSelector((state) => state.products.status);
  const cartItems = useSelector((state) => state.cart.items);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState([0, 100]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  useEffect(() => {
    let updatedProducts = [...products];

    if (categoryFilter) {
      updatedProducts = updatedProducts.filter(
        (product) => product.category === categoryFilter
      );
    }

    updatedProducts = updatedProducts.filter(
      (product) =>
        product.price >= priceFilter[0] && product.price <= priceFilter[1]
    );

    if (ratingFilter) {
      updatedProducts = updatedProducts.filter(
        (product) => product.rating && product.rating.rate >= ratingFilter
      );
    }

    updatedProducts.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    setFilteredProducts(updatedProducts);
  }, [products, categoryFilter, priceFilter, ratingFilter, sortOrder]);

  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = (product) => {
    dispatch(addToCart(product));
  };

  const renderStars = (rating) => {
    const totalStars = 5;
    const filledStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0 ? 1 : 0;

    return (
      <div className="flex">
        {[...Array(filledStars)].map((_, index) => (
          <span key={index} className="text-yellow-500">
            &#9733;
          </span>
        ))}
        {halfStar === 1 && <span className="text-yellow-500">&#9734;</span>}{" "}
        {[...Array(totalStars - filledStars - halfStar)].map((_, index) => (
          <span key={index} className="text-gray-400">
            &#9734;
          </span>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col items-center mb-4">
        <h2 className="text-xl font-bold mb-2">Filters</h2>
        <div className="flex flex-wrap justify-center space-x-4 space-y-2">
          <div>
            <label>
              Category:
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                <option value="">All</option>
                <option value="electronics">Electronics</option>
                <option value="jewelery">Jewelery</option>
                <option value="men's clothing">Men's Clothing</option>
                <option value="women's clothing">Women's Clothing</option>
              </select>
            </label>
          </div>
          <div>
            <label>
              Price Range:
              <input
                type="range"
                min="0"
                max="100"
                value={priceFilter[0]}
                onChange={(e) =>
                  setPriceFilter([Number(e.target.value), priceFilter[1]])
                }
                className="ml-2 w-32"
              />
              <input
                type="range"
                min="0"
                max="100"
                value={priceFilter[1]}
                onChange={(e) =>
                  setPriceFilter([priceFilter[0], Number(e.target.value)])
                }
                className="ml-2 w-32"
              />
            </label>
            <div>
              ${priceFilter[0]} - ${priceFilter[1]}
            </div>
          </div>

          <div>
            <label>
              Minimum Rating:
              <input
                type="range"
                min="0"
                max="5"
                value={ratingFilter}
                onChange={(e) => setRatingFilter(Number(e.target.value))}
                className="ml-2 w-32"
              />
              <span className="ml-2">{ratingFilter} ⭐</span>
            </label>
          </div>
          <div>
            <label>
              Sort By Price:
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="ml-2 p-1 border rounded"
              >
                <option value="asc">Low to High</option>
                <option value="desc">High to Low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {currentProducts &&
          currentProducts.map((product) => (
            <div
              key={product.id}
              className="p-4 border rounded-lg flex flex-col justify-between h-full"
            >
              <Link to={`/products/${product.id}`} className="flex-grow">
                <img
                  src={product.image}
                  alt={product.title}
                  loading="lazy"
                  className="w-full h-48 object-cover mb-4"
                />
                <h2 className="text-lg font-bold mb-2">{product.title}</h2>
                {product.rating && (
                  <div className="mb-2">{renderStars(product.rating.rate)}</div>
                )}
              </Link>
              <div className="flex justify-between items-center mt-4 px-2">
                <p className="text-xl font-semibold">${product.price}</p>
                <button
                  className={`py-2 px-4 rounded ${
                    cartItems.find((item) => item.id === product.id)
                      ? "bg-green-500 text-white cursor-not-allowed"
                      : "bg-blue-500 text-white"
                  }`}
                  onClick={() => {
                    if (!cartItems.find((item) => item.id === product.id)) {
                      handleAddToCart(product);
                    }
                  }}
                  disabled={cartItems.find((item) => item.id === product.id)}
                >
                  {cartItems.find((item) => item.id === product.id)
                    ? "Added to Cart"
                    : "Add to Cart"}
                </button>
              </div>
            </div>
          ))}
      </div>

      <div className="flex justify-center mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`mx-1 py-2 px-4 rounded ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-300"
            }`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
