import React, { Suspense } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Updated imports
import HomePage from "./Pages/HomePage";
import CartPage from "./Pages/CartPage";
import { Provider } from "react-redux";
import { store } from "./redux/store";

const ProductPage = React.lazy(() => import("./Pages/ProductPage"));

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="container mx-auto p-4">
          <Routes>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route
              path="/products/:id"
              element={
                <Suspense fallback={<div>Loading...</div>}>
                  <ProductPage />
                </Suspense>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
