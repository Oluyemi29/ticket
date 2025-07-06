"use client";
import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Card,
  CardBody,
  Button,
  CardHeader,
  Select,
  SelectItem,
} from "@heroui/react";
import { Modal, ModalContent, ModalBody, ModalFooter } from "@heroui/react";
import { FaTicketAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { signOut, useSession } from "next-auth/react";
import { AdminDeleteTicket, UpdateTicketStatus } from "@/app/api/Action";

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

const AdminDashboard = ({ category, myticket }: CategoryProps) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteInfo, setDeleteInfo] = useState({
    title: "",
    description: "",
    id: 0,
  });
  const [editInfo, setEditInfo] = useState({
    title: "",
    description: "",
    status: "",
    id: 0,
  });
  //   const [cateId, setCateId] = useState("");
  const statusData = [
    {
      key: "No_Status",
      label: "No_Status",
    },
    {
      key: "Pending",
      label: "Pending",
    },
    {
      key: "Delivered",
      label: "Delivered",
    },
    {
      key: "Resolved",
      label: "Resolved",
    },
    {
      key: "Denied",
      label: "Denied",
    },
    {
      key: "Rejected",
      label: "Rejected",
    },
  ];
  const TicketForMe = myticket.filter((eachTicket) => {
    return eachTicket.categoryId === session?.user.categoryId;
  });

  const AdminCateRole = category.find((eachcategory) => {
    return eachcategory.id === (session?.user.categoryId as number);
  });
  const handleDeleteTicket = (
    title: string,
    id: number,
    description: string
  ) => {
    setDeleteInfo((prevData) => {
      return {
        ...prevData,
        title,
        id,
        description,
      };
    });
    setDeleteModal(true);
  };
  const handleEditTicket = (title: string, id: number, description: string) => {
    setEditInfo((prevData) => {
      return {
        ...prevData,
        title,
        id,
        description,
      };
    });
    setEditModal(true);
  };
  const DeleteTicket = async () => {
    try {
      setLoading(true);
      if (!deleteInfo.id || deleteInfo.id < 1) {
        toast.error("Invalid credentials");
        return;
      }
      const ticketId = deleteInfo.id;
      const adminCategoryId = session?.user.categoryId as number;
      const response = await AdminDeleteTicket({ adminCategoryId, ticketId });
      if (response.success) {
        toast.success(response.message);

        setDeleteModal(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const EditTicket = async () => {
    try {
      setLoading(true);
      if (!editInfo.status || !editInfo.id || editInfo.id < 1) {
        toast.error("invalid credentials");
        return;
      }
      const tickedId = editInfo.id;
      const status = editInfo.status;
      const adminCategoryId = session?.user.categoryId as number;
      const response = await UpdateTicketStatus({
        adminCategoryId,
        status,
        tickedId,
      });
      if (response.success) {
        toast.success(response.message);
        setEditModal(false);
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
            Welcome {AdminCateRole?.name} Admin
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
                <span className="text-maindeep font-semibold">Tickets</span>
              </div>
            }
          >
            <Card>
              <CardHeader className="flex w-full items-center justify-center">
                <h1 className="font-semibold text-center underline underline-offset-2 text-maindeep">
                  Available Tickets
                </h1>
              </CardHeader>
              <CardBody className="text-maindeep">
                {TicketForMe.length < 1 ? (
                  <div className="text-center my-10">
                    <h1 className="text-maindeep font-semibold">
                      You have no ticket currently
                    </h1>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 w-full">
                    {TicketForMe.map((eachTicket, index) => {
                      return (
                        <div
                          className="w-full rounded-md p-2 odd:bg-slate-200 even:bg-transparent text-[0.9rem] flex flex-col md:flex-row gap-5"
                          key={index}
                        >
                          <p className="md:w-2/12">{eachTicket.title}</p>
                          <div className="md:w-6/12">
                            <p className="h-20 no-scrollbar overflow-y-auto">
                              {eachTicket.description}
                            </p>
                          </div>
                          <p className="md:w-2/12">
                            {eachTicket.Category.name}
                          </p>
                          <p className="md:w-2/12">{eachTicket.status}</p>
                          <div className="flex md:flex-col flex-row gap-4">
                            <Button
                              onPress={() =>
                                handleEditTicket(
                                  eachTicket.title,
                                  eachTicket.id,
                                  eachTicket.description
                                )
                              }
                              className="bg-maindeep text-white"
                            >
                              Update Status
                            </Button>
                            <Button
                              onPress={() =>
                                handleDeleteTicket(
                                  eachTicket.title,
                                  eachTicket.id,
                                  eachTicket.description
                                )
                              }
                              className="bg-red-700 text-white"
                            >
                              Delete Ticket
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardBody>
            </Card>
          </Tab>
        </Tabs>
      </div>

      <Modal isOpen={editModal} onClose={() => setEditModal(false)}>
        <ModalContent>
          <ModalBody>
            <Card className="w-full mx-auto">
              <CardBody className="w-full p-5">
                <h1 className="text-maindeep font-semibold text-[0.9rem] text-center">
                  Edit {deleteInfo.title} Ticket Status
                </h1>
                <p className="text-center text-[0.7rem] text-maindeep">
                  {deleteInfo.description}
                </p>

                <form className="flex flex-col mt-10 gap-5">
                  <Select
                    className="w-full"
                    label="Status"
                    placeholder="Select a staus"
                    variant="bordered"
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setEditInfo((prevData) => {
                        return {
                          ...prevData,
                          status: e.target.value,
                        };
                      })
                    }
                  >
                    {statusData.map((status) => (
                      <SelectItem key={status.key}>{status.label}</SelectItem>
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
                        className="bg-maindeep text-white"
                        onPress={() => EditTicket()}
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                </form>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setEditModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Modal isOpen={deleteModal} onClose={() => setDeleteModal(false)}>
        <ModalContent>
          <ModalBody>
            <Card className="w-full mx-auto">
              <CardBody className="w-full p-5">
                <h1 className="text-maindeep font-semibold text-[0.9rem] text-center">
                  Delete {deleteInfo.title} Ticket
                </h1>
                <p className="text-center text-[0.7rem] text-maindeep">
                  {deleteInfo.description}
                </p>
                <p className="text-center mt-6 text-[0.7rem] text-maindeep">
                  once delete, it cant be reversed again
                </p>
                <div className="mt-10">
                  {loading ? (
                    <Button
                      className="bg-red-700 text-white"
                      disabled
                      isLoading
                    >
                      Deleting...
                    </Button>
                  ) : (
                    <Button
                      className="bg-red-700 text-white"
                      onPress={() => DeleteTicket()}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onPress={() => setDeleteModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
