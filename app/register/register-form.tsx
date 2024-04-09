"use client";

import { CreateUserInput, createUserSchema } from "@/lib/user-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpWithEmailAndPassword } from "./_actions";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = (values) => {
    startTransition(async () => {
      const result = await signUpWithEmailAndPassword({
        data: values,
        emailRedirectTo: `${location.origin}/auth/callback`,
      });
      const { error } = JSON.parse(result);
      if (error?.message) {
        toast.error(error.message);
        console.log("Error message", error.message);
        reset({ password: "" });
        return;
      }

      toast.success("registered successfully");
      router.push("/login");
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)} className="w-full">
      <div className="mb-6 w-full">
        <Input
          {...register("name")}
          placeholder="Name"
        />
        {errors["name"] && (
          <span className="text-red-500 text-xs pt-1 block">
            {errors["name"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <Input
          type="email"
          {...register("email")}
          placeholder="Email address"
        />
        {errors["email"] && (
          <span className="text-red-500 text-xs pt-1 block">
            {errors["email"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <Input
          type="password"
          {...register("password")}
          placeholder="Password"
        />
        {errors["password"] && (
          <span className="text-red-500 text-xs pt-1 block">
            {errors["password"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <Input
          type="password"
          {...register("passwordConfirm")}
          placeholder="Confirm Password"
        />
        {errors["passwordConfirm"] && (
          <span className="text-red-500 text-xs pt-1 block">
            {errors["passwordConfirm"]?.message as string}
          </span>
        )}
      </div>
      <Button
        type="submit"
        className="flex w-full items-center justify-center cursor-pointer	gap-2 py-2 text-sm rounded-lg border border-gray-200 shadow-sm px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800 shadow-md"
        disabled={isPending}
      >
        {isPending ? "loading..." : "Sign Up"}
      </Button>
    </form>
    
  );
};