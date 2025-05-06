"use server";

import { Prisma, User } from "@prisma/client";
import prisma from "../lib/prisma";
import { auth } from "@/app/auth";
import OpenAI from "openai";
import { GoogleGenAI } from "@google/genai";
import jsonwebtoken from "jsonwebtoken";

export async function genJWT() {
  const session = await auth();

  if (session?.user && session.user?.email) {
    const payload = {
      // The payload contains claims like the user ID, which can be used to identify the user and their permissions.
      sub: session.user?.email,
    };
    // The 'sign' method creates the JWT, with the payload and your secret key as inputs.
    const jwt = jsonwebtoken.sign(payload, process.env.TIPTAP_APP_SECRET || "");
    // The resulting JWT is used for authentication in API requests, ensuring secure access.
    // Important: Never expose your secret key in client-side code!
    return jwt;
  }
}

export async function getAllUsers() {
  const session = await auth();
  let output = [];
  if (session?.user) {
    const users = await prisma.user.findMany({});
    for (const user of users) {
      if (user.email != session.user.email) {
        output.push(user);
      }
    }

    return output;
  }
}

export async function setBoardShare(newUsers: User, boardId: any) {
  let updatedBoard = await prisma.board.update({
    where: {
      id: boardId,
    },
    include: { shared_access: true, docs: true },
    data: {
      shared_access: { connect: { id: newUsers.id } },
    },
  });

  if (updatedBoard) {
    for (const doc of updatedBoard.docs) {
      let updatedDoc = await prisma.docs.update({
        where: {
          id: doc.id,
        },
        data: {
          shared_access: { connect: { id: newUsers.id } },
        },
      });
    }
  }
  console.log(updatedBoard);
}

export async function removeBoardShare(newUsers: User, boardId: any) {
  console.log("REMOVE");
  let updatedBoard = await prisma.board.update({
    where: {
      id: boardId,
    },
    include: { shared_access: true, docs: true },
    data: {
      shared_access: { disconnect: { id: newUsers.id } },
    },
  });
  console.log(updatedBoard);

  if (updatedBoard) {
    for (const doc of updatedBoard.docs) {
      let updatedDoc = await prisma.docs.update({
        where: {
          id: doc.id,
        },
        data: {
          shared_access: { disconnect: { id: newUsers.id } },
        },
      });
    }
  }
}

export async function setDocShare(newUsers: User, boardId: any) {
  let updatedBoard = await prisma.docs.update({
    where: {
      id: boardId,
    },
    include: { shared_access: true },
    data: {
      shared_access: { connect: { id: newUsers.id } },
    },
  });
  if (updatedBoard) {
    let updatedDoc = await prisma.board.update({
      where: {
        id: updatedBoard.boardid,
      },
      data: {
        shared_access: { connect: { id: newUsers.id } },
      },
    });
  }
}

export async function removeDocShare(newUsers: User, boardId: any) {
  let updatedBoard = await prisma.docs.update({
    where: {
      id: boardId,
    },
    include: { shared_access: true },
    data: {
      shared_access: { disconnect: { id: newUsers.id } },
    },
  });
  if (updatedBoard) {
    let updatedDoc = await prisma.board.update({
      where: {
        id: updatedBoard.boardid,
      },
      data: {
        shared_access: { disconnect: { id: newUsers.id } },
      },
    });
  }
}

export async function checkUserExists(session: any) {
  if (session?.user) {
    console.log("authenticated Proceeding with User check...");
    if (session?.user.email && session.user.name) {
      let today = new Date();
      const user = await prisma.user.upsert({
        where: {
          email: session.user.email || Prisma.skip,
        },
        update: {
          lastLogin: today,
          name: session?.user?.name || Prisma.skip,
        },
        create: {
          email: session?.user?.email,
          name: session?.user?.name,
          lastLogin: today,
          authType: "google",
        },
      });
    }
    console.log("error creating Local User");
  }
}

export async function createDoc(name: any, boardId: Number | any) {
  const session = await auth();
  let doc;

  if (session?.user && session?.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (user) {
      doc = await prisma.docs.create({
        data: {
          shared: false,
          text: "",
          name: name,
          board: {
            connect: {
              id: boardId,
            },
          },
          owner: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
  }
  return doc;
}

export async function updateDoc(id: any, content: string) {
  const board = await prisma.docs.update({
    where: {
      id: id,
    },
    data: {
      text: content,
    },
  });

  return board;
}

export async function getDocs() {
  const docs = await prisma.docs.findMany();

  return docs;
}

export async function getDocByID(id: number) {
  if (id) {
    const board = await prisma.docs.findUnique({
      where: { id: id },
      include: { shared_access: true },
    });

    return board;
  }
}

// BOARDS #####################################################################

export async function createBoard(name: any, description: string) {
  const session = await auth();

  if (session?.user && session?.user.email) {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    let board;
    if (user) {
      board = await prisma.board.create({
        data: {
          shared: false,
          name: name,
          description: description,
          owner: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }
    return board;
  }
}

export async function deleteBoard(id: any) {
  if (id) {
    const session = await auth();

    if (session?.user && session?.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        await prisma.board.delete({
          where: {
            id: id,
          },
        });
      }
    }
  }
}

export async function deleteDoc(id: any) {
  if (id) {
    const session = await auth();

    if (session?.user && session?.user.email) {
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
      if (user) {
        await prisma.docs.delete({
          where: {
            id: id,
          },
        });
      }
    }
  }
}

export async function getBoards() {
  const boards = await prisma.board.findMany({
    include: {
      docs: true,
    },
  });
  return boards;
}

export async function getUserInfo() {
  const session = await auth();

  if (session?.user && session?.user.email) {
    const boards = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      include: {
        shared_boards: { include: { docs: true } },
        boards: { include: { docs: true } },
      },
    });

    return boards;
  }
}

export async function updateSideBarOpen(things: Set<React.Key> | "all") {
  let newSideBarOpen: string[] = [];
  for (const thing of things) {
    newSideBarOpen.push(thing.toString());
  }
  const session = await auth();

  if (session?.user && session?.user.email) {
    const boards = await prisma.user.update({
      where: {
        email: session.user.email,
      },
      data: { sidebarOpen: newSideBarOpen },
    });

    return boards;
  }
}

export async function getBoardByID(id: number) {
  const board = await prisma.board.findUnique({
    where: { id: id },
    include: {
      docs: true,
    },
  });
  return board;
}

export async function calcStats(id: number | undefined) {
  if (id) {
    //Open ai, I ran out of credits apparently and had to switch to gemini?
    //const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let response;
    let response2;
    let output: any = {};
    const board = await prisma.board.findUnique({
      where: { id: id },
      include: {
        docs: true,
      },
    });

    let text = "";

    if (board) {
      for (const doc of board.docs) {
        text = text + " " + doc.text?.replace(/<\/?[^>]+(>|$)/g, "");
      }

      for (const doc of board.docs) {
        if (doc.text) {
          const buffer = Buffer.from(doc.text, "base64"); // decode base64 back
          const readableString = buffer.toString("utf-8");
          text = text + "=======" + readableString.replace(/[^\x20-\x7E]/g, "");
        }
      }
    }

    if (text != "") {
      response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: text,
        config: {
          systemInstruction:
            "Each block of text separated by ======= is a seperate document. Provide a summary of each document in 30 words max per document. DONT USE MARKDOWN",
        },
      });
      response2 = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: text,
        config: {
          systemInstruction:
            "Find the 10 most important and inclusive words used to describe all of the documents, separated by only a comma",
        },
      });
      /* CHAT - if you have credits then go for it
      response = await client.responses.create({
        model: "gpt-4.1",
        instructions: "Summarize the following text in 50 words. ",
        input: text,
      });
      response2 = await client.responses.create({
        model: "gpt-4.1",
        instructions:
          "Find the 10 most occuring words in the following text and reply with only those words, in descending order by frequency, separated by only a space",
        input: text,
      });
      */
      output["summary"] = response?.text;
      output["cloud"] = response2?.text?.split(",");
    }

    console.log(output);

    return output;
  }
}

export async function calcStatsDoc(id: number | undefined) {
  if (id) {
    //Open ai, I ran out of credits apparently and had to switch to gemini?
    //const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

    let response;
    let response2;
    let output: any = {};
    const doc = await prisma.docs.findUnique({
      where: { id: id },
    });
    console.log(doc);

    let text = "";

    if (doc) {
      if (doc.text) {
        const buffer = Buffer.from(doc.text, "base64"); // decode base64 back
        const readableString = buffer.toString("utf-8");
        text = text + "=======" + readableString.replace(/[^\x20-\x7E]/g, "");
      }
    }

    if (text != "") {
      response = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: text,
        config: {
          systemInstruction:
            "Each block of text separated by ======= is a seperate document. Provide a summary of each document in 30 words max per document. DONT USE MARKDOWN",
        },
      });
      response2 = await client.models.generateContent({
        model: "gemini-2.0-flash",
        contents: text,
        config: {
          systemInstruction:
            "Find the 10 most important and inclusive words in the original text used to describe this document, separated by only a comma. Do not make new words, only use words that are in the original text, if there are less than 10, you can return less than 10.",
        },
      });
      /* CHAT - if you have credits then go for it
      response = await client.responses.create({
        model: "gpt-4.1",
        instructions: "Summarize the following text in 50 words. ",
        input: text,
      });
      response2 = await client.responses.create({
        model: "gpt-4.1",
        instructions:
          "Find the 10 most occuring words in the following text and reply with only those words, in descending order by frequency, separated by only a space",
        input: text,
      });
      */
      output["summary"] = response?.text;
      output["cloud"] = response2?.text?.split(",");
    }

    console.log(output);

    return output;
  }
}
