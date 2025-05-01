import TipTapEditor from "@/components/TipTapEditor";
import { getServerSession } from "next-auth";

export default async function Home(props: {
  params: Promise<{ docid: string }>;
}) {
  const params = await props.params;
  const slug = params.docid;
  const session = await getServerSession();

  return <TipTapEditor slug={slug} session={session} />;
}
