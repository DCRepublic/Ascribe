"use client";

import { Sidebar } from "@/components/sidebar";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  CircularProgress,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@heroui/react";
import { DocCard } from "@/components/doc-card";
import { marked } from "marked";

import React, { useCallback, useEffect } from "react";
import { calcStats, createDoc, getBoardByID } from "@/app/actions/actions";
import { Board, Docs } from "@prisma/client";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const fetcher = (url: any) => fetch(url).then((r) => r.json());

export default function IndexPage({
  params,
}: {
  params: Promise<{ boardid: string }>;
}) {
  const router = useRouter();
  const [docName, setDocName] = React.useState("");
  const [board, setBoard] = React.useState<Board | null>();
  const [stats, setStats] = React.useState<any>(undefined);
  //const [documents, setDocuments] = React.useState<Docs[] | undefined>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [id, setID] = React.useState<number | undefined>();
  const { data, error, isLoading } = useSWR(
    `/api/getDocs?boardid=${id}`,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  async function newDocument() {
    if (docName != "") {
      let newDoc = await createDoc(docName, id);
      if (newDoc) {
        setDocName("");
        router.refresh();
      }
    }
  }

  async function getStats() {
    if (id) {
      let stats = await calcStats(id);

      setStats(stats);
    }
  }

  useEffect(() => {
    async function getData() {
      const slug = await params;
      setID(parseInt(slug.boardid));
      console.log(parseInt(slug.boardid));
      const theBoard = await getBoardByID(parseInt(slug.boardid));
      setBoard(theBoard);
    }
    getData();
  }, []);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              {stats == undefined ? (
                <ModalBody className="ml-auto mr-auto">
                  <CircularProgress
                    className="justify-items-center"
                    aria-label="Loading..."
                    label="Generating Overview"
                  />
                </ModalBody>
              ) : (
                <>
                  <ModalHeader className="flex flex-col gap-1 text-xl text-center">
                    Summary Of Notes In {board?.name}
                  </ModalHeader>
                  <ModalBody>
                    SUMMARY:
                    <div>{stats?.summary}</div>
                    <div>
                      WORDCLOUD:
                      <div className="grid grid-cols-5 gap-5 justify-items-center mt-5">
                        {stats?.cloud?.map((word: any) => (
                          <Chip color="primary" size="lg">
                            {word}
                          </Chip>
                        ))}
                      </div>
                    </div>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </>
          )}
        </ModalContent>
      </Modal>
      <div className="text-4xl text-center">{board?.name}</div>
      <div className="justify-self-end ">
        <Button
          variant="ghost"
          onPress={() => {
            onOpen();
            getStats();
          }}
        >
          Generate Stats
        </Button>
      </div>

      <div className="w-full h-[75vh] overflow-y-scroll  grid grid-cols-7  lg:pt-2 lg:pl-2 mt-5 ">
        <Card
          className={
            " w-44 h-56 grid grid-rows-3 border-4 border-dashed bg-transparent border-gray-600 hover:scale-105 hover:z-50"
          }
        >
          <CardBody className="text-center mt-auto row-start-1 font-semibold text-2xl">
            New Document
          </CardBody>
          <div
            onClick={() => newDocument()}
            className="text-5xl text-center mt-auto row-start-2"
          >
            +
          </div>
          <CardFooter>
            {" "}
            <Input
              value={docName}
              onValueChange={setDocName}
              label="Name"
            ></Input>
          </CardFooter>
        </Card>

        {!isLoading ? (
          data
            ?.sort((a: any, b: any) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
            .map((doc: Docs) => <DocCard key={doc.id} doc={doc}></DocCard>)
        ) : (
          <Skeleton className="w-full h-56 col-span-6 rounded-md"></Skeleton>
        )}
      </div>
    </>
  );
}
