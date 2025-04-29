"use client";

import { deleteDoc, removeDocShare, setDocShare } from "@/app/actions/actions";

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
} from "@heroui/react";
import {
  deleteBoard,
  getAllUsers,
  removeBoardShare,
  setBoardShare,
} from "@/app/actions/actions";
import Link from "next/link";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import { useEffect, useState } from "react";
import { User as UserType } from "@prisma/client";

export const DocCard = (props: any) => {
  const [selectedKeys, setSelectedKeys] = useState<any>(new Set());
  const [users, setUsers] = useState<UserType[] | undefined>();

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
    for (const shared_user of props?.doc?.shared_access) {
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
        "dark:bg-slate-800 w-44 h-56  dark:border-white border-1 border-black "
      }
    >
      <Link
        href={`/document/${props.doc?.id}`}
        className="cursor-pointer h-full"
      >
        <CardHeader className="p-5">{props.doc?.name}</CardHeader>

        <CardBody className="p-5">
          {props.doc?.text?.replace(/<\/?[^>]+(>|$)/g, "").substring(0, 20)}...
        </CardBody>
      </Link>
      <CardFooter className="justify-end">
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
              className="max-h-20 overflow-y-scroll"
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
                          ? setDocShare(user, props.doc?.id)
                          : removeDocShare(user, props.doc?.id)
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
              deleteDoc(props.board?.id);
            }}
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>
      </CardFooter>
    </Card>
  );
};
