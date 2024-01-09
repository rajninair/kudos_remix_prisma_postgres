import bcrypt from "bcryptjs";
import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { LoginForm, RegisterForm } from "./types.server";
import { createUser } from "./users.server";

const secret = process.env.SESSION_SECRET;
if (!secret) {
  throw new Error("SESSION_SECRET is not set");
}
const storage = createCookieSessionStorage({
  cookie: {
    name: "kudos-session",
    secure: process.env.NODE_ENV === "production",
    secrets: [secret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
  },
});
export const register = async (form: RegisterForm) => {
  const exists = await prisma.user.count({
    where: {
      email: form.email,
    },
  });

  if (exists) {
    return json(
      { error: "User already exists with that email" },
      { status: 400 }
    );
  }

  const newUser = await createUser(form);
  console.log("new user", newUser);

  if (!newUser) {
    return json(
      {
        error: "Something went wrong trying to create a new user",
        fields: { email: form.email, password: form.password },
      },
      {
        status: 400,
      }
    );
  }
  return createUserSession(newUser.id, "/");
};

export const login = async (form: LoginForm) => {
  // Find the user
  const user = await prisma.user.findUnique({
    where: {
      email: form.email,
    },
  });

  // If user not found in database or wrong credentials
  if (!user || !(await bcrypt.compare(form.password, user.password))) {
    return json(
      {
        error: "Incorrect login",
      },
      {
        status: 400,
      }
    );
  }
  return createUserSession(user.id, "/");
};

export const createUserSession = async (userId: string, redirectTo: string) => {
  const session = await storage.getSession();
  session.set("userId", userId);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await storage.commitSession(session),
    },
  });
};
