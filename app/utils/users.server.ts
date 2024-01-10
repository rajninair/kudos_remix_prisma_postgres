import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import { Profile, RegisterForm } from "./types.server";

export const createUser = async (user: RegisterForm, profile: Profile) => {
  const passwordHash = await bcrypt.hash(user.password, 10);
  console.log("user >>> ", user);
  let fn = profile.firstName;
  let ln = profile.lastName;
  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      Profile: {
        create: {
          firstName: fn,
          lastName: ln,
        },
      },
      UserPreference: {
        create: {
          emailUpdates: true,
        },
      },
    },
    include: {
      Profile: true,
      UserPreference: true,
    },
  });

  console.log("newUser:", newUser);

  return {
    id: newUser.id,
    email: user.email,
  };
};
