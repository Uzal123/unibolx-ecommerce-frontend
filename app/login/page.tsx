"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import useAuthStore from "@/lib/hooks/useAuthStore";
import { toast } from "sonner"

// Applying same design system:
// • Background: gray-50
// • Accent: indigo-600 / hover:indigo-700
// • Card: white, shadow-md, rounded-lg
// • Typography: gray-800

export default function Login() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/user/login", { username });
      if (response.status === 201) {
        setUser(response.data);
        toast("Login Successful")
        console.log("Login successful:", response.data);
        if (response.data.isAdmin) {
          router.push("/admin");
        } else router.push("/");
      } else {
        console.error("Login failed:", response.data);
        toast("Login Failed",response.data.message)
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast("Error during login: " + (error instanceof Error ? error.message : "An unknown error occurred"))
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Optional header can go here */}
      <header className="w-full bg-indigo-600 py-3 shadow-md">
        <div className="max-w-screen-xl mx-auto px-4">
          <h1 className="text-white text-2xl font-bold">My Shop</h1>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
          <h2 className="text-gray-800 text-2xl font-semibold mb-6 text-center">
            Login
          </h2>

          <form className="space-y-4" onSubmit={submitForm}>
            <div>
              <label
                htmlFor="username"
                className="block text-gray-700 font-medium mb-2"
              >
                Username
              </label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              variant="outline"
              className="w-full"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </div>
      </main>
    </div>
  );
}
