"use client"

import React, { useState, useTransition } from "react";
import Link from "next/link";

import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

import { CardWrapper } from "./card-wrapper";
import { FormError } from "./form-error";
import { FormSuccess } from "./form-success";
import { FidgetSpinner } from "react-loader-spinner";
import { useAuth } from "@/providers/authProviders";

const LOGIN_URL = "/api/login";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get("error") === "OAuthAccountNotLinked"
    ? "Sign in or register with another email provider"
    : "";

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const handleSubmit = async (data: any) => {
    setLoading(true);
    try {
      const response = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      setLoading(false);
    }
  };

  const inputClass = "text-black bg-neutral-100 border-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:text-slate-300";

  return (
    <CardWrapper
      headerTitle="Admin"
      headerLabel="This page is restricted"
      headerLabelColor="text-rose-400"
      backButtonLabel="Don't have an account?"
      backButtonHref="/auth/register"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="mt-[-10px">
          <div className="space-y-3 mb-3">
            <>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className={inputClass}
                        placeholder="Username"
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        {...field}
                        className={inputClass}
                        placeholder="Password"
                        disabled={loading}
                        type={showPassword ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="link"
              size="sm"
              className="h-4 px-0 font-normal text-sm"
              asChild
            >
              <Link href="/auth/reset">Forgot password?</Link>
            </Button>

            <div className="flex items-center space-x-2 mt-4 mb-2">
              <Checkbox
                className="w-3.5 h-3.5 border-gray-400"
                id="togglepwd"
                onCheckedChange={() => {
                  setShowPassword(!showPassword);
                }}
              />
              <label
                htmlFor="togglepwd"
                className="text-gray-400 ml-1 text-xs font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Show password
              </label>
            </div>
          </div>

          {loading ? (
            <div className="mb-2 flex justify-center text-center">
              <FidgetSpinner />
            </div>
          ) : (
            <Button disabled={loading || !form.getValues("username") || !form.getValues("password")} type="submit" className="w-full">
              Log in
            </Button>
          )}
          <div className="mt-2">
            {error && <FormError message={error || urlError} />}
            {success && <FormSuccess message={success} />}
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};