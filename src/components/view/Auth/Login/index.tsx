import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useStorefrontMutation } from "@/hooks/useStorefront";
import { CUSTOMER_ACCESS_TOKEN_CREATE, CUSTOMER_RECOVER } from "@/graphql/auth";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { setCookie } from "nookies";
import { useRouter } from "next/navigation";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const recoverSchema = z.object({
  email: z.string().email(),
});

type LoginFormProps = {
  setShowRegister: (show: boolean) => void;
};

const Login = ({ setShowRegister }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [recoverMode, setRecoverMode] = useState(false);
  const { mutate } = useStorefrontMutation();
  const router = useRouter();

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const recoverForm = useForm<z.infer<typeof recoverSchema>>({
    resolver: zodResolver(recoverSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setIsLoading(true);
    try {
      const response = (await mutate({
        query: CUSTOMER_ACCESS_TOKEN_CREATE,
        variables: {
          input: {
            email: values.email,
            password: values.password,
          },
        },
      })) as {
        customerAccessTokenCreate: {
          customerUserErrors: { message: string }[];
          customerAccessToken: { accessToken: string };
        };
      };

      if (response.customerAccessTokenCreate.customerUserErrors.length > 0) {
        throw new Error("Failed to login");
      }

      setCookie(
        null,
        "customerAccessToken",
        response.customerAccessTokenCreate.customerAccessToken.accessToken,
        {
          maxAge: 60 * 60 * 24 * 30,
          path: "/",
        }
      );
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  async function onRecover(values: z.infer<typeof recoverSchema>) {
    setIsLoading(true);
    try {
      const response = (await mutate({
        query: CUSTOMER_RECOVER,
        variables: {
          email: values.email,
        },
      })) as {
        customerRecover: {
          customerUserErrors: { message: string }[];
        };
      };

      if (response.customerRecover.customerUserErrors.length > 0) {
        throw new Error(response.customerRecover.customerUserErrors[0].message);
      }

      toast.success("Password recovery instructions sent to your email.");
      setRecoverMode(false);
      recoverForm.reset();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send recovery email");
    } finally {
      setIsLoading(false);
    }
  }

  if (recoverMode) {
    return (
      <Form {...recoverForm}>
        <form onSubmit={recoverForm.handleSubmit(onRecover)} className="my-10 w-full space-y-4">
          <p className="text-sm text-gray-600">Enter your email to receive password reset instructions.</p>
          <FormField
            control={recoverForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-between">
            <Button type="button" variant="link" onClick={() => setRecoverMode(false)}>
              Back to login
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send reset email"}
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  return (
    <Form {...loginForm}>
      <form
        onSubmit={loginForm.handleSubmit(onSubmit)}
        className="my-10 w-full space-y-4"
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            loginForm.handleSubmit(onSubmit)(event);
          }
        }}
      >
        <FormField
          control={loginForm.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={loginForm.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start gap-1">
            <Button variant="link" type="button" onClick={() => setShowRegister(true)} className="text-sm">
              Don&apos;t have an account? <b>Register</b>
            </Button>
            <Button variant="link" type="button" onClick={() => setRecoverMode(true)} className="text-sm">
              Forgot password?
            </Button>
          </div>
          <Button type="submit" className="w-1/2" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Login;
