"use client";

import { Button, Card, CardBody, CardFooter, CardHeader } from "@heroui/react";
import Link from "next/link";
import Image from "next/image";
export default function IndexPage() {
  return (
    <>
      <div className="grid lg:grid-cols-2">
        <div className="ml-10 mt-5 animation-appear ">
          <div className="text-6xl ">Notes</div>
          <div className="text-6xl ">done</div>
          <div className="text-6xl ">collaboratively.</div>
          <div className="mt-5 text-xl">
            Ascribe helps you your classmates be more efficent with your
            note-taking.
          </div>
          <div className="mt-10 grid gap-5 grid-cols-4 w-full ">
            <Link href="/board">
              <Button
                color="primary"
                variant="shadow"
                size="lg"
                className="justify-self-center"
              >
                Get Started
              </Button>
            </Link>
            <Link href="https://docs.google.com/forms/d/e/1FAIpQLSf4Oxa5FzIk0D9pz-FLVR79g4Y-SSCuVLX7ZKblyjOlwmDXNQ/viewform?usp=dialog">
              <Button
                color="default"
                variant="faded"
                size="lg"
                className="justify-self-center"
              >
                Leave a Review
              </Button>
            </Link>
          </div>
        </div>
        <div>
          <Image
            className="rounded-xl lg:justify-self-end lg:mr-20 lg:mt-5 justify-self-center mt-10 opacity-90"
            src="/home.jpeg"
            alt="pen and quill"
            width="500"
            height="500"
          ></Image>
        </div>
      </div>
    </>
  );
}
