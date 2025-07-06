"use server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";
import { revalidatePath } from "next/cache";

type UserRegisterProps = {
  name: string;
  email: string;
  password: string;
};
export const UserRegister = async ({
  name,
  email,
  password,
}: UserRegisterProps) => {
  try {
    if (!name || !email || !password) {
      return {
        success: false,
        message: "All filed are required",
      };
    }
    const existUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existUser) {
      return {
        success: false,
        message: "user already exist, kindly login",
      };
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const registerUser = await prisma.user.create({
      data: {
        email,
        name,
        password: hashPassword,
      },
    });
    if (registerUser) {
      return {
        success: true,
        message: "user registered successfully",
      };
    } else {
      return {
        success: false,
        message: "Error when sending registering",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occured",
    };
  }
};

type CreateTicketProps = {
  title: string;
  description: string;
  userId: number;
  categoryId: number;
};
export const CreateTicket = async ({
  categoryId,
  description,
  title,
  userId,
}: CreateTicketProps) => {
  try {
    if (!title || !description || !userId || !categoryId) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const existTicket = await prisma.ticket.findFirst({
      where: {
        categoryId: Number(categoryId),
        description,
        title,
        userId: Number(userId),
        status: "Delivered",
      },
    });
    if (existTicket) {
      return {
        success: false,
        message: "Ticket already created",
      };
    }
    const ticket = await prisma.ticket.create({
      data: {
        description,
        title,
        categoryId: Number(categoryId),
        userId: Number(userId),
        status: "Delivered",
      },
    });
    if (ticket) {
      revalidatePath("/user");
      revalidatePath("/admin");
      return {
        success: true,
        message: "Ticket created successfully",
      };
    } else {
      return {
        success: false,
        message: "Error when creating ticket",
      };
    }
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "An error occured",
    };
  }
};

type AdminDeleteTicketProps = {
  ticketId: number;
  adminCategoryId: number;
};

export const AdminDeleteTicket = async ({
  adminCategoryId,
  ticketId,
}: AdminDeleteTicketProps) => {
  try {
    if (!ticketId || !adminCategoryId) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const fetchTicket = await prisma.ticket.findUnique({
      where: {
        id: Number(ticketId),
      },
    });
    if (!fetchTicket || fetchTicket.categoryId !== Number(adminCategoryId)) {
      return {
        success: false,
        message: "Unauthorize access",
      };
    }

    const ticket = await prisma.ticket.delete({
      where: {
        id: Number(ticketId),
      },
    });
    if (ticket) {
      revalidatePath("/user");
      revalidatePath("/admin");
      return {
        success: true,
        message: "Ticket delete successfully",
      };
    } else {
      return {
        success: false,
        message: "Error when deleting the ticket",
      };
    }
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occured",
    };
  }
};

type UpdateTicketStatusProps = {
  tickedId: number;
  status: string;
  adminCategoryId: number;
};

export const UpdateTicketStatus = async ({
  adminCategoryId,
  status,
  tickedId,
}: UpdateTicketStatusProps) => {
  try {
    if (!tickedId || !adminCategoryId || !status) {
      return {
        success: false,
        message: "All field are required",
      };
    }
    const fetchTicket = await prisma.ticket.findUnique({
      where: {
        id: Number(tickedId),
      },
    });
    if (!fetchTicket || fetchTicket.categoryId !== Number(adminCategoryId)) {
      return {
        success: false,
        message: "Unauthorize access",
      };
    }
    const statusOption = [
      "No_Status",
      "Pending",
      "Delivered",
      "Resolved",
      "Denied",
      "Rejected",
    ];
    if (!statusOption.includes(status)) {
      return {
        success: false,
        message: "Invalid status",
      };
    }

    const ticket = await prisma.ticket.update({
      where: {
        id: Number(tickedId),
      },
      data: {
        status:
          status === "No_Status"
            ? "No_Status"
            : status === "Delivered"
            ? "Delivered"
            : status === "Denied"
            ? "Denied"
            : status === "Pending"
            ? "Pending"
            : status === "Rejected"
            ? "Rejected"
            : "Resolved",
      },
    });
    if (ticket) {
      revalidatePath("/user");
      revalidatePath("/admin");

      return {
        success: true,
        message: "Ticket updated successfully",
      };
    } else {
      return {
        success: false,
        message: "Error when updating ticket",
      };
    }
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "An error occured",
    };
  }
};
