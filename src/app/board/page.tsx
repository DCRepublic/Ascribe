"use client";

import { Sidebar } from "@/components/sidebar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
  Tooltip,
} from "@heroui/react";
import { BoardCard } from "@/components/board-card";
import React, { useCallback, useEffect } from "react";
import { createBoard, createDoc, getUserInfo } from "@/app/actions/actions";
import useSWR from "swr";
import { Board } from "@prisma/client";
import AddIcon from "@mui/icons-material/Add";
import NotesIcon from "@mui/icons-material/Notes";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useRouter } from "next/navigation";
import { theUser } from "@/lib/types";
const fetcher = (url: any) => fetch(url).then((r) => r.json());

export default function IndexPage() {
  const router = useRouter();
  const [boardName, setBoardName] = React.useState("");
  const [desc, setDesc] = React.useState("");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [userInfo, setUserInfo] = React.useState<theUser | null | undefined>();

  const { data, error, isLoading } = useSWR("/api/getboards", fetcher, {
    refreshInterval: 1000,
  });

  async function newBoard() {
    if (boardName != "") {
      let newBoard = await createBoard(boardName, desc);

      router.refresh();

      if (newBoard) {
        setBoardName("");
        setDesc("");
        let userInfo = await getUserInfo();
        setUserInfo(userInfo);
      }
    }
  }

  const loadUserInfo = useCallback(async () => {
    let userInfo = await getUserInfo();
    setUserInfo(userInfo);
  }, []);

  useEffect(() => {
    loadUserInfo();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Board
              </ModalHeader>
              <ModalBody>
                <Input
                  value={boardName}
                  onValueChange={setBoardName}
                  label="Name"
                ></Input>
                <Input
                  value={desc}
                  onValueChange={setDesc}
                  label="Description"
                ></Input>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                    newBoard();
                  }}
                >
                  Create
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <div className="grid grid-cols-5 gap-5">
        <div className="bg-sidebar_background col-start-1 absolute top-10 left-0 px-5 w-[15%] h-[95vh] shadow-lg shadow-black">
          {" "}
          {/* Okay, first, this has to be the weirdest comment syntax ever*/}
          {/* Now, more importantly, this is the div that controls our sidebar column/colors. It is actually not in sidebar. Within sidebar seems to only control components
                  within the sidebar. Somehow, we need to figure out how to extend this column to the bottom of the screen with some padding so that it looks better. */}
          <Sidebar userInfo={userInfo} />
        </div>
        <div className="col-start-2 col-span-4  w-full h-[87vh] overflow-y-scroll lg:pt-2 lg:pl-2 ">
          <Tooltip
            placement={"bottom"}
            delay={500}
            closeDelay={0}
            className="w-35"
            content="Boards are a way to organize your notes by class or topic. "
          >
            <Button onPress={onOpen} className="bg-secondary ml-2">
              <AddIcon /> New Board
            </Button>
          </Tooltip>

          <div className="overflow-y-scroll h-[55vh] grid grid-cols-5 gap-2 justify-items-center mt-5">
            {isLoading != true
              ? data
                  ?.sort((a: any, b: any) => {
                    if (a.name < b.name) {
                      return -1;
                    }
                    if (a.name > b.name) {
                      return 1;
                    }
                    return 0;
                  })
                  .map((board: Board) => (
                    <BoardCard key={board.id} board={board}></BoardCard>
                  ))
              : null}
          </div>
        </div>
      </div>
    </>
  );
}

/*

<Input
                value={boardName}
                onValueChange={setBoardName}
                label="Name"
              ></Input>


 <Card
          className={
            "h-72 grid grid-rows-3 border-4 border-dashed bg-transparent border-gray-600 hover:scale-105 hover:z-50"
          }
        >
          <CardBody className="text-center mt-auto row-start-1 font-semibold text-2xl">
            New Board
          </CardBody>
          <div
            onClick={() => newBoard()}
            className="text-5xl text-center mt-auto row-start-2"
          >
            +
          </div>
          <CardFooter>
            {" "}
            <Input
              value={boardName}
              onValueChange={setBoardName}
              label="Name"
            ></Input>
          </CardFooter>
        </Card>
        <Card
          isPressable
          onPress={() => console.log("HELLOO")}
          className={
            "h-72 grid grid-rows-3 bg-transparent border-4 border-dashed border-gray-600 hover:scale-105 hover:z-50"
          }
        >
          <CardBody className="text-center mt-auto row-start-1 font-semibold text-2xl">
            Template 1
          </CardBody>
          <div className="text-5xl text-center mt-auto row-start-2">+</div>
        </Card>
        {isLoading != true
          ? data?.map((board: Board) => (
              <BoardCard key={board.id} board={board}></BoardCard>
            ))
          : null}

*/
