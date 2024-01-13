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
    </div>
  );
}
