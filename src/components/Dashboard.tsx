"use client";
import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from "@heroui/react";
import { FaTicketAlt } from "react-icons/fa";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import { CreateTicket } from "@/app/api/Action";

type CategoryProps = {
  category: {
    id: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  myticket: {
    Category: {
      name: string;
      id: number;
      createdAt: Date;
      updatedAt: Date;
    };
    categoryId: number;
    title: string;
    description: string;
    status: string;
    id: number;
    createdAt: Date;
    updatedAt: Date;
    userId: number;
  }[];
};

const Dashboard = ({ category, myticket }: CategoryProps) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [cateId, setCateId] = useState("");
  const cateInfo = category.map((eachCategory) => {
    return {
      key: eachCategory.id,
      label: eachCategory.name,
    };
  });
  const MyTicket = myticket.filter((eachTicket) => {
    return eachTicket.userId === Number(session?.user.id as number);
  });
  const formSchema = z.object({
    title: z
      .string()
      .min(2, { message: "Minimum of 2 character" })
      .max(200, { message: "Maximum of 200 characters" }),
    description: z.string().min(2, { message: "Minimum of 2 character" }),
  });
  type formSchemaType = z.infer<typeof formSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });
  const submit = async (value: formSchemaType) => {
    try {
      setLoading(true);
      const { description, title } = value;
      if (Number(cateId) < 1) {
        toast.error("Invalid category");
        return;
      }
      const categoryId = Number(cateId);
      const userId = session?.user.id as number;
      const response = await CreateTicket({
        categoryId,
        description,
        title,
        userId,
      });
      if (response.success) {
        toast.success(response.message);
        reset();
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
    <div>
      <div className="flex flex-row justify-between items-center">
        <div className="mt-5">
          <h1 className="text-maindeep text-[0.9rem] font-semibold">
            {session?.user.name}
          </h1>
          <p className="text-[0.7rem] text-maindeep">
            {session?.user.email.slice(0, 3)}...{session?.user.email.slice(-9)}
          </p>
        </div>
        <Button onPress={() => signOut()} className="bg-red-700 text-white">
          Logout
        </Button>
      </div>
      <div className="flex w-full mt-10 flex-col">
        <Tabs aria-label="Options" className="">
          <Tab
            key="myticket"
            title={
              <div className="flex items-center space-x-2">
                <FaTicketAlt className="text-maindeep" />
                <span className="text-maindeep font-semibold">My Tickets</span>
              </div>
            }
          >
            <Card>
              <CardHeader className="flex w-full items-center justify-center">
                <h1 className="font-semibold text-center underline underline-offset-2 text-maindeep">
                  My Tickets
                </h1>
              </CardHeader>
              <CardBody className="text-maindeep">
                {MyTicket.length < 1 ? (
                  <div className="my-10 text-center">
                    <h1 className="text-maindeep font-semibold">
                      You have no ticket currently
                    </h1>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    {MyTicket.map((eachTicket, index) => {
                      return (
                        <div
                          className="w-full rounded-md p-2 odd:bg-slate-200 even:bg-transparent text-[0.9rem] flex flex-col md:flex-row gap-5"
                          key={index}
                        >
                          <p className="md:w-2/12">{eachTicket.title}</p>
                          <div className="md:w-6/12">
                            <p className="h-20 overflow-y-auto">
                              {eachTicket.description}
                            </p>
                          </div>
                          <p className="md:w-2/12">
                            {eachTicket.Category.name}
                          </p>
                          <p className="md:w-2/12">{eachTicket.status}</p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>
          <Tab
            key="createticket"
            title={
              <div className="flex items-center space-x-2">
                <FaTicketAlt className="text-maindeep" />
                <span className="text-maindeep font-semibold">
                  Create Ticket
                </span>
              </div>
            }
          >
            <Card className="md:w-2/6 mx-auto">
              <CardBody className="w-full p-5">
                <h1 className="text-maindeep font-semibold text-[0.9rem] text-center">
                  Create Ticket here
                </h1>
                <p className="text-center text-[0.7rem] text-maindeep">
                  Kindly enter your ticket details
                </p>
                <form
                  className="flex flex-col mt-10 gap-5"
                  onSubmit={handleSubmit(submit)}
                >
                  <Input
                    {...register("title")}
                    isInvalid={!!errors.title}
                    errorMessage={errors.title?.message}
                    label={"Title"}
                    placeholder="Title"
                    type="text"
                  />
                  <Input
                    {...register("description")}
                    isInvalid={!!errors.description}
                    errorMessage={errors.description?.message}
                    label={"Description"}
                    placeholder="Description"
                    type="text"
                  />
                  <Select
                    className="w-full"
                    label="Category"
                    placeholder="Select a category"
                    variant="bordered"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setCateId(e.target.value)
                    }
                  >
                    {cateInfo.map((category) => (
                      <SelectItem key={category.key}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="mt-20">
                    {loading ? (
                      <Button
                        className="text-white bg-maindeep w-full h-12"
                        type="button"
                        isDisabled
                        isLoading
                      >
                        Processing...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className="text-white bg-maindeep w-full h-12"
                      >
                        Submit
                      </Button>
                    )}
                  </div>
                </form>
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
