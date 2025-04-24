"use client";
import { Cart, Item } from "@/types/types";
import axios from "@/lib/axios";
import { Fragment, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/lib/hooks/useAuthStore";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

// Color palette:
// • Background: gray-50
// • Accent: indigo-600 (hover indigo-700)
// • Card: white with soft shadow and rounded-lg
// • Typography: gray-800

export default function Home() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [items, setItems] = useState<Item[]>();
  const [loading, setLoading] = useState(false);
  const [cartLoading, setCartLoading] = useState(false);
  const [cart, setCart] = useState<Cart>();
  const [couponInput, setCouponInput] = useState("");

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/items/");
      if (res.status === 200) setItems(res.data);
    } catch (error) {
      console.error(error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
    setLoading(false);
  };

  const getCart = async () => {
    setCartLoading(true);
    try {
      const res = await axios.get(`/api/cart/${user?.id}`);
      if (res.status === 200) setCart(res.data);
    } catch (error) {
      console.error(error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
    setCartLoading(false);
  };

  const addToCart = async (itemId: number) => {
    setCartLoading(true);
    try {
      const res = await axios.post("/api/cart/add", {
        userId: user?.id,
        itemId,
        quantity: 1,
      });
      if (res.status === 201) setCart(res.data);
    } catch (error) {
      console.error(error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
    setCartLoading(false);
  };

  const removeFromCart = async (itemId: number) => {
    setCartLoading(true);
    try {
      const res = await axios.post("/api/cart/remove", {
        userId: user?.id,
        itemId,
        quantity: 1,
      });
      if (res.status === 200) setCart(res.data);
    } catch (error) {
      console.error(error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
    setCartLoading(false);
  };

  const handlePlaceOrder = async () => {
    setCartLoading(true);
    try {
      const res = await axios.post("/api/order/", {
        userId: user?.id,
        cart,
      });
      if (res.status === 200) {
        getCart()
        toast("Order placed successfully!");
        };
    } catch (error) {
      console.error(error);
      toast("Error during login: " + (error instanceof Error ? error.message : "An unknown error occurred"))
    }
    setCartLoading(false);
  };

  const applyCouponCode = async (code?: string) => {
    setCartLoading(true);
    try {
      const res = await axios.post("/api/discount/apply", {
        userId: user?.id,
        discountCode: code,
      });
      if (res.status === 200) {
        toast("Coupon applied successfully!");
        setCart(res.data)};
    } catch (error) {
      console.error(error);
      toast(
        "Error during login: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
      getCart();
    }
    setCartLoading(false);
  };

  const removeCouponCode = async () => {
    setCartLoading(true);
    try {
      const res = await axios.post("/api/discount/remove", {
        userId: user?.id,
        discountCode: cart?.discountCodeUsed,
      });
      if (res.status === 200) getCart();
    } catch (error) {
      getCart();
        toast(
          "Error during login: " +
            (error instanceof Error
              ? error.message
              : "An unknown error occurred")
        );
      console.error(error);
    }
    setCartLoading(false);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  useEffect(() => {
    if (!isAuthenticated || !user) router.push("/login");
    fetchItems();
    getCart();
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
      <div className="max-w-screen-xl mx-auto p-6 flex flex-col lg:flex-row gap-6">
        {/* Items Grid */}
        <section className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items?.map((item) => {
                const cartItem = cart?.items.find((ci) => ci.id === item.id);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow p-5 flex flex-col items-center"
                  >
                    <h2 className="text-gray-800 text-lg font-semibold mb-2">
                      {item.name}
                    </h2>
                    <p className="text-gray-600 mb-4">${item.price}</p>

                    {cartItem ? (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={cartLoading}
                          onClick={() => removeFromCart(item.id)}
                        >
                          –
                        </Button>
                        <span className="text-gray-800 font-medium">
                          {cartItem.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={cartLoading}
                          onClick={() => addToCart(item.id)}
                        >
                          +
                        </Button>
                      </div>
                    ) : (
                      <Button
                      variant="ghost"
                        className="w-full"
                        disabled={cartLoading}
                        onClick={() => addToCart(item.id)}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Cart Sidebar */}
        <aside className="w-full lg:w-80 bg-white rounded-lg shadow-md p-6 sticky top-6 self-start">
          <h2 className="text-gray-800 text-xl font-semibold mb-4">
            Your Cart
          </h2>

          {cartLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
            </div>
          ) : cart && cart.items.length > 0 ? (
            <Fragment>
              {/* Items */}
              <div className="space-y-3 mb-4">
                {cart.items.map((it) => (
                  <div
                    key={it.id}
                    className="flex justify-between items-center"
                  >
                    <span className="text-gray-700">{it.name}</span>
                    <span className="text-gray-600">x{it.quantity}</span>
                    <span className="text-gray-700">${it.totalPrice}</span>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="border-t pt-3 mb-4 space-y-2">
                <div className="flex justify-between">
                  <span>Total:</span>
                  <span>${cart.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount:</span>
                  <span>${cart.discountAmount || 0}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Grand Total:</span>
                  <span>${cart.grandTotal}</span>
                </div>
              </div>

              {/* Remove Applied Coupon */}
              {cart.discountCodeUsed && (
                <div className="flex items-center justify-between p-2 bg-gray-100 rounded mb-4">
                  <span className="text-gray-700">
                    Applied: {cart.discountCodeUsed}
                  </span>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={cartLoading}
                    onClick={() => {
                      setCouponInput("");
                      removeCouponCode();
                    }}
                  >
                    Remove
                  </Button>
                </div>
              )}

              {/* Coupon Entry */}
              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Coupon Code</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                  />
                  <Button
                    disabled={cartLoading}
                    onClick={() => applyCouponCode(couponInput)}
                  >
                    Apply
                  </Button>
                </div>
                {cart.availableDiscountCodes?.length ? (
                  <div className="mt-3 space-y-2">
                    {cart.availableDiscountCodes.map((dc) => (
                      <div
                        key={dc.code}
                        className="flex justify-between items-center p-2 bg-gray-100 rounded"
                      >
                        <span>{dc.code}</span>
                        <span className="text-sm">{dc.percentage}% off</span>
                        <Button
                          size="sm"
                          disabled={couponInput === dc.code}
                          onClick={() => {
                            setCouponInput(dc.code);
                            applyCouponCode(dc.code);
                          }}
                        >
                          Apply
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic mt-2">
                    No coupons available.
                  </p>
                )}
              </div>

              <Button
                variant="secondary"
                className="w-full"
                disabled={cartLoading}
                onClick={handlePlaceOrder}
              >
                Place Order
              </Button>
            </Fragment>
          ) : (
            <p className="text-gray-500">Your cart is empty.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
