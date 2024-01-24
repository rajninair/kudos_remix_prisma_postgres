import { requireUserId } from "~/utils/auth.server";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

export default function Index() {
  return (
    <div className="h-screen w-full bg-slate-600">
      <h2 className="font-bold text-5xl text-blue-400">Tailwind works</h2>
      <p>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Enim doloribus
        sequi a esse voluptatibus delectus rem nam quia possimus eum? Magni sunt
        a voluptatibus hic fugit excepturi commodi maxime praesentium. Minus,
        totam non illum, facere, vel praesentium ab numquam modi laborum
        consequuntur corporis exercitationem cumque nostrum nobis fuga
        asperiores! Cum!
      </p>
    </div>
  );
}
