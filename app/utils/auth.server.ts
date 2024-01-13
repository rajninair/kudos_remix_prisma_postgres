import bcrypt from "bcryptjs";
import { json, createCookieSessionStorage, redirect } from "@remix-run/node";
import { prisma } from "./prisma.server";
import { LoginForm, Profile, RegisterForm } from "./types.server";
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
export const register = async (form: RegisterForm, profile: Profile) => {
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

  const newUser = await createUser(form, profile);
  console.log("new user", newUser);

  if (!newUser) {
    return json(
      {
        error: "Something went wrong trying to create a new user",
        fields: {
          email: form.email,
          password: form.password,
          firstName: profile.firstName,
          lastName: profile.lastName,
        },
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

export async function requireUserId(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const session = await getUserSession(request);
  const userId = session.get("userId");
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

function getUserSession(request: Request) {
  return storage.getSession(request.headers.get("Cookie"));
}

// getUserId

// getUser
