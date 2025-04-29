import { Server } from "@hocuspocus/server";
import { Database } from "@hocuspocus/extension-database";
import { Redis } from "@hocuspocus/extension-redis";

//@ts-ignore
import prisma from "./lib/prisma.ts";

const server = new Server({
  name: "ascribe-server",
  port: 5557,
  quiet: false,
  extensions: [
    new Database({
      // Return a Promise to retrieve data …
      fetch: async ({ documentName }) => {
        console.log(documentName);
        return new Promise(async (resolve, reject) => {
          try {
            let doc = await prisma.docs.findUnique({
              where: {
                id: parseInt(documentName),
              },
            });
            if (!doc || !doc.text) {
              resolve(null);
              return;
            }

            const buffer = Buffer.from(doc.text, "base64"); // decode base64 back
            const uint8Array = new Uint8Array(buffer);
            console.log("gettingDocument");
            resolve(uint8Array);
            return;
          } catch (error) {
            console.error("Error in fetch:", error);
            reject(error);
          }
        });
      },
      // … and a Promise to store data:
      store: async ({ documentName, state }) => {
        console.log("STORE", state);
        const base64 = Buffer.from(state).toString("base64");
        const board = await prisma.docs.update({
          where: {
            id: parseInt(documentName),
          },
          data: {
            text: base64,
          },
        });
      },
    }),
    new Redis({
      host: "ascribe-redis",
      port: 6379,
    }),
  ],
});

server.listen();
process.on("SIGINT", async () => {
  console.log("Stopping server...");
  server.destroy();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("Stopping server...");
  server.destroy();
  process.exit(0);
});
console.log("Hocuspocus server is running...");
