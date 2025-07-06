"use client";
import { Button, Input } from "@heroui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { MdEmail } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { TbLockPassword } from "react-icons/tb";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import Link from "next/link";
import { UserRegister } from "@/app/api/Action";

const Register = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const formSchema = z.object({
    name: z.string().min(2, { message: "Minimum of 2 character" }),
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
      const { email, name, password } = value;
      const response = await UserRegister({ email, name, password });
      if (response.success) {
        toast.success(response.message);
        reset();
        return router.push("/login");
      } else {
        toast.error(response.message);
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
        <h1 className="text-maindeep text-center text-[1rem] font-semibold">
          Register
        </h1>
        <p className="text-maindeep text-center text-[0.8rem]">
          Kindly enter your details
        </p>
        <div>
          <form
            onSubmit={handleSubmit(submit)}
            className="flex mt-10 flex-col gap-4"
          >
            <Input
              {...register("name")}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              label={"Name"}
              type="text"
              placeholder="Name"
              startContent={<FaUser />}
            />
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
            <div className="mt-14">
              {loading ? (
                <Button
                  isLoading
                  className="w-full bg-maindeep text-white h-12"
                  type="button"
                >
                  Registering...
                </Button>
              ) : (
                <Button
                  className="w-full bg-maindeep text-white h-12"
                  type="submit"
                >
                  Register
                </Button>
              )}
            </div>
          </form>
          <p className="text-[0.9rem] mt-3 text-end text-maindeep">
            Already have an account?{" "}
            <Link
              className="underline underline-offset-2 italic font-semibold"
              href={"/login"}
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
