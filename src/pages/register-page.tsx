import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { IconInput } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
  Mail,
  User,
  Users,
} from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useAuth } from "@/providers/auth-provider";
import { PASSWORD_MESSAGE, REGEX_PASSWORD } from "@/constants/auth.constant";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

// Infer the type of the form values from the schema. we are using it also on AuthProvider.
export type RegisterFormValues = z.infer<typeof formSchema>;

// Define your form schema.
const formSchema = z
  .object({
    username: z.string().min(1).max(50),
    email: z.string().email(),
    password: z.string().min(8).regex(REGEX_PASSWORD, {
      message: PASSWORD_MESSAGE,
    }),
    confirmPassword: z.string().min(8),
    firstName: z.string().min(2).max(50),
    lastName: z.string().min(2).max(50),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Error path
  });

function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State for pending UI
  const [isPending, setIsPending] = useState(false);

  // Define your form.
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      firstName: "",
      lastName: "",
    },
  });

  // Define a submit handler.
  async function onSubmit(values: RegisterFormValues) {
    const { confirmPassword, ...valuesToSubmit } = values; // no need to confirmPassword for the api call

    try {
      setIsPending(true);
      await register(valuesToSubmit);
      toast({
        title: "Great!",
        description: "You have successfully registered.",
        variant: "primary",
      });
      navigate("/auth/login");
    } catch (error: any) {
      if (error?.response?.data?.error) {
        // Check if the error is related to email already existing
        if (error.response.data.error === "Email already exists") {
          form.setError("email", {
            type: "manual",
            message: error.response.data.error,
          });
        } else {
          toast({
            title: error.response.data.error,
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "An error occurred",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <>
      <Card className=" py-6 min-h-96 min-w-80 flex flex-col items-center justify-center gap-4 rounded-xl">
        <CardTitle className="text-3xl">Register</CardTitle>
        <CardContent className="w-full max-w-80 ">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <fieldset disabled={isPending} className="flex flex-col gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <IconInput
                          Icon={User}
                          placeholder="Username"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <IconInput
                          Icon={Mail}
                          type="email"
                          placeholder="Email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <IconInput
                          Icon={Users}
                          placeholder="First Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <IconInput
                          Icon={Users}
                          placeholder="Last Name"
                          {...field}
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
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IconInput
                            Icon={LockKeyhole}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            {...field}
                          />
                          <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Must be at least 3 characters minimum.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <IconInput
                            Icon={LockKeyhole}
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            {...field}
                          />
                          <span
                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer text-gray-500"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </fieldset>
              <Separator className="my-8" />
              <Button disabled={isPending} type="submit" className="w-full">
                {isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </Form>
          <CardFooter className=" mt-4">
            <p className="text-xs">
              Already have an account?{" "}
              <Link className="underline font-bold" to="/auth/login">
                Login
              </Link>
            </p>
          </CardFooter>
        </CardContent>
      </Card>
    </>
  );
}

export default RegisterPage;
