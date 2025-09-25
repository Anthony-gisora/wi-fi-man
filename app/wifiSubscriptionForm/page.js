"use client";

import React, { useState } from "react";
import axios from "axios";

const Page = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    amount: "",
  });

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Sending M-Pesa prompt...");

    try {
      const res = await axios.post("/api/pay", {
        phone: formData.phone,
        amount: formData.amount,
        name: formData.name, // optional: you can also store this in DB
      });

      if (res.data.ResponseCode === "0") {
        setStatus("✅ STK Push sent. Check your phone!");
      } else {
        setStatus("❌ Payment failed: " + res.data.errorMessage);
      }
    } catch (error) {
      setStatus("⚠️ Error connecting to payment service.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          WiFi Subscription
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-600 mb-1">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="2547XXXXXXXX"
              value={formData.phone}
              onChange={handleChange}
              className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-600 mb-1">
              Subscription Amount
            </label>
            <input
              type="number"
              name="amount"
              required
              value={formData.amount}
              onChange={handleChange}
              className="w-full border text-black rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Processing..." : "Subscribe & Pay"}
          </button>
        </form>

        {status && (
          <div className="mt-4 text-center text-gray-700 font-medium">
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
