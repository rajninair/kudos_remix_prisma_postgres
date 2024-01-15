import { LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Layout from "~/components/layout";
import { getUser, requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  const user = await getUser(request);
  return user;
};

const UserProfile = () => {
  const user = useLoaderData();
  console.log("user >>>");
  return (
    <Layout>
      <div className="h-full bg-purple-400 p-5 flex flex-col gap-3">
        <h2 className="bg-white p-5 font-bold text-4xl mb-5 rounded-xl">
          User Profile
        </h2>
        <hr />

        <div className=" bg-white h-full p-5 flex gap-3 rounded-lg mt-5">
          <div className="flex items-center flex-1">
            <img src="" alt="User Icon" />
          </div>
          <div className="flex flex-1 flex-col gap-5 justify-center">
            <div className="flex p-3 gap-4">
              <h3>Email:</h3>
              <h4>{user.email}</h4>
            </div>
            <div className="flex p-3 gap-4">
              <h3>First Name:</h3>
              <h4>{user.Profile.firstName}</h4>
            </div>
            <div className="flex p-3 gap-4">
              <h3>Last Name:</h3>
              <h4>{user.Profile.lastName}</h4>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default UserProfile;
