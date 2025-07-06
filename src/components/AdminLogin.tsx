"use client";
import { Button, Input, Select, SelectItem } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { TbLockPassword } from "react-icons/tb";
import { signIn } from "next-auth/react";

type CategoryProps = {
  category: {
    name: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
  }[];
};
const AdminLogin = ({ category }: CategoryProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [cateId, setCateId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const cateInfo = category.map((eachCategory) => {
    return {
      key: eachCategory.id,
      label: eachCategory.name,
    };
  });
  const formSchema = z.object({
    email: z.string().email(),
    password: z
      .string({ message: "Kindly enter your password" })
      .min(6, { message: "Minimum of 6 character" })
      .max(30, { message: "Maximum of 30 character" }),
  });
  type formSchemaType = z.infer<typeof formSchema>;

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const submit = async (value: formSchemaType) => {
    try {
      setLoading(true);
      const { email, password } = value;
      if (Number(cateId) < 1) {
        toast.error("Invalid category");
        return;
      }
      const categoryId = cateId;
      const response = await signIn("credentials", {
        email,
        password,
        category: categoryId,
        redirect: false,
      });
      if (response?.error) {
        if (response.error === "CredentialsSignin") {
          toast.error("Invalid email or password");
        } else if (response.error === "OAuthSignin") {
          toast.error("Something went wrong with the OAuth provider");
        } else if (response.error === "OAuthCallback") {
          toast.error("OAuth callback failed");
        } else if (response.error === "OAuthCreateAccount") {
          toast.error("Could not create OAuth account");
        } else if (response.error === "EmailSignin") {
          toast.error("Could not send sign-in email");
        } else {
          toast.error("An unexpected error occurred. Please try again");
        }
      } else if (response?.ok) {
        toast.success("Login successfully");
        reset();
        return router.push("/admin");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full">
      <div className="md:w-2/6 mx-auto rounded-lg p-5 border-2 border-maindeep mb-10 mt-24">
        <h1 className="text-maindeep text-center text-[0.9rem] font-semibold">
          Login
        </h1>
        <p className="text-maindeep text-center text-[0.7rem]">
          Kindly enter your details
        </p>
        <div>
          <form
            onSubmit={handleSubmit(submit)}
            className="flex mt-10 flex-col gap-4"
          >
            <Input
              {...register("email")}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              label={"Email"}
              type="email"
              placeholder="Email"
              startContent={<MdEmail />}
            />
            <Input
              {...register("password")}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              label={"Password"}
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              startContent={<TbLockPassword />}
              endContent={
                showPassword ? (
                  <FaEyeSlash
                    className="cursor-pointer"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <FaEye
                    className="cursor-pointer"
                    onClick={() => setShowPassword(true)}
                  />
                )
              }
            />
            <Select
              className="w-full"
              label="Category"
              placeholder="Select your category as admin"
              variant="bordered"
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setCateId(e.target.value)
              }
            >
              {cateInfo.map((category) => (
                <SelectItem key={category.key}>{category.label}</SelectItem>
              ))}
            </Select>
            <div className="mt-14">
              {loading ? (
                <Button
                  isLoading
                  className="w-full bg-maindeep text-white h-12"
                  type="button"
                >
                  Processing...
                </Button>
              ) : (
                <Button
                  className="w-full bg-maindeep text-white h-12"
                  type="submit"
                >
                  Login
                </Button>
              )}
            </div>
          </form>
          <p className="text-[0.7rem] text-end text-maindeep">
            Dont have an accont?{" "}
            <Link
              className="underline underline-offset-2 mt-3 italic font-semibold"
              href={"/"}
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
