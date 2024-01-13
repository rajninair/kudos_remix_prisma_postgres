import Layout from "~/components/layout";
import FormField from "~/components/form-field";
import { useState, useEffect, useRef } from "react";
import { ActionFunction, ActionFunctionArgs, json } from "@remix-run/node";
import { Form, useFetcher } from "@remix-run/react";
import { login, register } from "~/utils/auth.server";
import {
  validateEmail,
  validateName,
  validatePassword,
} from "~/utils/validators.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("_action");
  const email = formData.get("email");
  const password = formData.get("password");
  let firstName = formData.get("firstName");
  let lastName = formData.get("lastName");
  console.log("formData", formData);
  // Verify that we receive these as string - for login form
  if (
    typeof action !== "string" ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    console.log("error frm login action >>>", action);
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  if (
    action === "register" &&
    (typeof firstName !== "string" || typeof lastName !== "string")
  ) {
    return json({ error: `Invalid Form Data`, form: action }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
    ...(action === "register"
      ? {
          firstName: validateName((firstName as string)?.trim() || ""),
          lastName: validateName((lastName as string)?.trim() || ""),
        }
      : {}),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: { email, password, firstName, lastName },
        form: action,
      },
      { status: 400 }
    );
  }

  switch (action) {
    case "login": {
      return await login({ email, password });
    }
    case "register": {
      firstName = firstName as string;
      lastName = lastName as string;

      return await register({ email, password }, { firstName, lastName });
    }
    default:
      return json({ error: `Invalid Form Data` }, { status: 400 });
  }
}

const Login = () => {
  let fetcher = useFetcher();
  let fetcherData = fetcher.data;

  const [formData, setFormData] = useState({
    email: fetcherData?.fields?.email || "",
    password: fetcherData?.fields?.password || "",
    firstName: fetcherData?.fields?.firstName || "",
    lastName: fetcherData?.fields?.lastName || "",
  });

  const [action, setAction] = useState("login");

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    setFormData((form) => ({
      ...form,
      [field]: event.target.value,
    }));
  };

  return (
    <Layout>
      <div className="h-full flex justify-center items-center flex-col gap-y-4">
        <button
          onClick={() => setAction(action === "login" ? "register" : "login")}
          className="absolute top-8 right-8 rounded-xl bg-yellow-300 font-semibold text-blue-600 px-3 py-2 transition duration-300 ease-in-out hover:bg-yellow-400"
        >
          {action === "login" ? "Sign Up" : "Sign In"}
        </button>

        <h2 className="text-5xl font-extrabold text-yellow-300">
          my remix app
        </h2>

        <p className="font-semibold text-slate-300">
          {action === "login"
            ? "Log In to Give Some Praise!"
            : " Sign Up to Get Started!"}
        </p>

        <fetcher.Form
          method="POST"
          className="rounded-2xl bg-gray-200 p-6 w-96"
        >
          <div className="text-xs font-semibold text-center tracking-wide text-red-500 w-full">
            <h4>{fetcher?.data?.error}</h4>
          </div>
          <FormField
            htmlFor="email"
            label="Email"
            value={formData.email}
            onChange={(e) => handleInputChange(e, "email")}
            error={fetcher?.data?.errors?.email}
          />
          <FormField
            htmlFor="password"
            label="Password"
            value={formData.password}
            onChange={(e) => handleInputChange(e, "password")}
            error={fetcher?.data?.errors?.password}
          />
          {action !== "login" ? (
            <>
              <FormField
                htmlFor="firstName"
                label="FirstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange(e, "firstName")}
                error={fetcher?.data?.errors?.firstName}
              />
              <FormField
                htmlFor="lastName"
                label="LastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange(e, "lastName")}
                error={fetcher?.data?.errors?.lastName}
              />
            </>
          ) : null}

          <div className="w-full text-center">
            <button
              type="submit"
              name="_action"
              value={action}
              className="rounded-xl mt-2 bg-yellow-300 px-3 py-2 text-blue-600 font-semibold transition duration-300 ease-in-out hover:bg-yellow-400 hover:translate-y-1"
            >
              {action === "login" ? "Sign In" : "Sign Up"}
            </button>
          </div>
        </fetcher.Form>
      </div>
    </Layout>
  );
};
export default Login;
