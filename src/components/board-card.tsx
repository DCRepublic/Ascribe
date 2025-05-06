"use client";

import { Sidebar } from "@/components/sidebar";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  User,
  Skeleton,
  Autocomplete,
  AutocompleteSection,
  AutocompleteItem,
  Input,
  DropdownSection,
  ModalContent,
  Modal,
  ModalFooter,
  ModalBody,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { Router } from "next/router";
import { useRouter } from "next/navigation";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteBoard,
  getAllUsers,
  removeBoardShare,
  setBoardShare,
} from "@/app/actions/actions";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useState, useMemo, useEffect } from "react";
import { theUser } from "@/lib/types";
import { User as UserType } from "@prisma/client";
import FolderIcon from "@mui/icons-material/Folder";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
export const BoardCard = (props: any) => {
  const router = useRouter();
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());
  const [users, setUsers] = useState<UserType[] | undefined>();
  const [selectedUsers, setSelectedUsers] = useState<any>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const selectedValue = useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  async function getUsers() {
    let theUsers: any = await getAllUsers();

    let tempUsers = [];
    for (const user of theUsers) {
      let newUser = user;
      newUser["key"] = user.name;

      tempUsers.push(newUser);
    }
    console.log(tempUsers);
    setUsers(tempUsers);
  }

  useEffect(() => {
    let theSet = new Set();
    for (const shared_user of props.board?.shared_access) {
      theSet.add(shared_user.name);
    }
    setSelectedKeys(theSet);
    console.log(theSet);
    getUsers();
  }, []);

  return (
    <Card
      isFooterBlurred
      className={
        "dark:bg-slate-800 w-52 h-24   dark:border-white border-1 border-black "
      }
    >
      <Link
        className="hover:cursor-pointer h-full"
        href={`/board/${props.board?.id}`}
      >
        <CardHeader className="text-sm ">
          {props.board?.shared_access.length == 0 ? (
            <FolderIcon className="mr-2" />
          ) : (
            <FolderSharedIcon className="mr-2" />
          )}

          {props.board?.name.substring(0, 20)}
        </CardHeader>
      </Link>

      <CardFooter className="text-sm justify-end">
        <ButtonGroup>
          <Dropdown closeOnSelect={false}>
            <DropdownTrigger>
              <Button isIconOnly>
                <PersonAddAlt1Icon></PersonAddAlt1Icon>{" "}
              </Button>
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Select users to share with"
              closeOnSelect={false}
              selectedKeys={selectedKeys}
              selectionMode="multiple"
              variant="flat"
              className="max-h-28 overflow-y-scroll"
              onSelectionChange={setSelectedKeys}
            >
              <>
                {users?.map((user: UserType) => (
                  <DropdownItem key={user.name}>
                    <User
                      className="col-span-1"
                      classNames={{
                        name: "text-default-600",
                        description: "text-default-500",
                      }}
                      description={user.email}
                      name={user.name}
                      onClick={() =>
                        selectedKeys.has(user.name)
                          ? setBoardShare(user, props.board?.id)
                          : removeBoardShare(user, props.board?.id)
                      }
                    />
                  </DropdownItem>
                ))}
              </>
            </DropdownMenu>
          </Dropdown>

          <Button
            isIconOnly
            onPress={() => {
              deleteBoard(props.board?.id);
            }}
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
