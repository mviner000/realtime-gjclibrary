import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FidgetSpinner } from "react-loader-spinner";
import { useAuth } from "@/providers/authProviders";
import { deleteTokensFromServer } from "@/actions/token";

const LOGIN_URL = "/api/login";

const QuickLoginForm = () => {
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();

  const handleQuickLogin = async () => {
    setLoading(true);
    
    try {
      // First, handle logout
      await deleteTokensFromServer();

      // Then proceed with login
      const credentials = {
        username: "abad52310078",
        password: "52310078abad"
      };

      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "An error occurred during login");
        setLoading(false);
        return;
      }

      setError("");
      setSuccess("Login successful!");
      login();
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={handleQuickLogin}
        disabled={loading}
        className="w-full flex items-center justify-center min-h-[36px]"
      >
        {loading ? (
          <FidgetSpinner height={24} width={24} />
        ) : (
          "Switch User"
        )}
      </Button>
      {error && (
        <div className="absolute top-full left-0 right-0 mt-2 text-red-500 text-sm text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default QuickLoginForm;