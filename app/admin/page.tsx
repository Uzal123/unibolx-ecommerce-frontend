"use client";
import React, { Fragment, useEffect, useState } from "react";
import axios from "@/lib/axios";
import { Insights } from "@/types/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/hooks/useAuthStore";
import { toast } from "sonner";

// Using same design system:
// • Background: gray-50
// • Accent: indigo-600 / hover:indigo-700
// • Cards: white, shadow-md, rounded-lg
// • Typography: gray-800

export default function AdminPage() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState<Insights>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCarts: 0,
    totalItems: 0,
    averageOrderValue: 0,
    averageItemsPerCart: 0,
    totalDiscountAmount: 0,
    totalDiscountCodesUsed: 0,
    discountCodes: [],
    totalDiscountCodes: 0,
  });
  const [newPercentage, setNewPercentage] = useState<number>(0);
  const [creating, setCreating] = useState(false);

  const fetchInsights = async () => {
    setLoading(true);
    try {
      const res = await axios.get<Insights>("/api/admin/insights");
      if (res.status === 200) {
        setInsights(res.data);
      }
    } catch (error) {
      console.error("Error fetching insights:", error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
    setLoading(false);
  };

  const handleCreateCoupon = async () => {
    if (!newPercentage) return;
    setCreating(true);
    try {
      const res = await axios.post("/api/admin/discount", {
        percentage: newPercentage,
      });
      if (res.status === 201) {
        // refresh insights to include new coupon
        await fetchInsights();
        setNewPercentage(0);
        toast("Coupon created successfully");
      }
    } catch (error) {
      console.error("Error creating coupon:", error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
    setCreating(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if ((user && !user.isAdmin) || !user) router.push("/login");
    fetchInsights();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="w-full bg-indigo-600 py-3 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">My Shop</h1>
          <div className="flex items-center gap-4">
            <span className="text-white">Hello, {user?.username}</span>
            <Button size="sm" variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-xl mx-auto p-6 space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
          </div>
        ) : (
          <Fragment>
            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/** existing metric cards... **/}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Total Orders
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  {insights.totalOrders}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Total Revenue
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  ${insights.totalRevenue.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Total Carts
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  {insights.totalCarts}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Total Items
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  {insights.totalItems}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Avg Order Value
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  ${insights.averageOrderValue.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Avg Items/Cart
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  {insights.averageItemsPerCart.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Total Discount
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  ${insights.totalDiscountAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-gray-700 text-lg font-medium mb-2">
                  Codes Used
                </h2>
                <p className="text-indigo-600 text-2xl font-bold">
                  {insights.totalDiscountCodesUsed}
                </p>
              </div>
            </div>

            {/* Create Coupon Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-gray-700 text-lg font-medium mb-4">
                Create Coupon Code
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-gray-700 mb-1">% Off</label>
                  <Input
                    type="number"
                    placeholder="Percentage"
                    value={newPercentage}
                    onChange={(e) => setNewPercentage(Number(e.target.value))}
                    disabled={creating}
                  />
                </div>
                <div>
                  <Button
                    onClick={handleCreateCoupon}
                    disabled={creating}
                    className="w-full"
                  >
                    {creating ? "Creating..." : "Create"}
                  </Button>
                </div>
              </div>
            </div>

            {/* List of Coupon Codes */}
            <div>
              <h2 className="text-gray-800 text-xl font-semibold mb-3">
                Coupon Codes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {insights.discountCodes.map((dc) => (
                  <div
                    key={dc.code}
                    className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center"
                  >
                    <span className="text-gray-800 font-medium mb-1">
                      {dc.code}
                    </span>
                    <span className="text-indigo-600 font-bold text-lg">
                      {dc.percentage}% off
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Fragment>
        )}
      </main>
    </div>
  );
}
