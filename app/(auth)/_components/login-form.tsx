"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { motion } from "motion/react";
import { FaSpinner } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { CiLogin } from "react-icons/ci";
import { handleCredentialLogin, signGoogleServer } from "@/actions/auth";
import { toast } from "react-toastify";
import { errorHandler } from "@/app/utils/helper";
import Link from "next/link";

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .regex(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, {
      message: "Invalid email address format",
    }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export type FormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      setLoading(true);

      const res = await handleCredentialLogin(data);

      if (res?.error) {
        toast.error(res?.error.split(".")[0]);
        return;
      }

      toast.success("Login Successfull!");

      window.location.reload()
    } catch (error) {
      errorHandler(error)
    } finally {
      setLoading(false);
    }
  };

  const logInWithGoogle = async () => {
    setGoogleLoading(true);
    try {
      await signGoogleServer();

      toast.success("Login Successfull!");
    } catch (error: unknown) {
      errorHandler(error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 p-1"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="john@example.com"
                    {...field}
                    className="mt-1 bg-white/50 dark:bg-transparent border border-blue-100 outline-none rounded-xl h-12 pl-4"
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
                <FormLabel className="font-semibold">Password</FormLabel>
                <FormControl>
                  <Input
                    placeholder="*******"
                    {...field}
                    className="mt-1 bg-white/50 border dark:bg-transparent border-blue-100 outline-none rounded-xl h-12 pl-4"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            disabled={googleLoading || loading}
            className={`w-full mt-2 flex justify-center text-white items-center gap-2 h-12 gradient-bg gradient-bg:hover rounded-xl font-medium text-lg ${loading || googleLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            type="submit"
          >
            {loading ? "Loading..." : "Log In"}
            {!loading && <CiLogin />}
          </motion.button>
        </form>
      </Form>

      <div className="relative text-center my-4 text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative bg-transparent dark:bg-[#0d0d0d] z-10 font-semibold px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>
      <motion.button
        onClick={logInWithGoogle}
        disabled={googleLoading || loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.95 }}
        className="w-full flex gap-2 items-center justify-center gradient-bg gradient-bg:hover text-white py-3 rounded-xl font-semibold shadow-md"
      >
        {googleLoading ? (
          <FaSpinner className="animate-spin text-white mr-2" size={20} />
        ) : (
          <>
            <FcGoogle className="mr-2" size={20} />
            Continue with Google
          </>
        )}
      </motion.button>

      <p className="text-sm font-light mt-6  dark:text-white text-center">
        Don’t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary-600 hover:underline dark:text-primary-500"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default Login;
