import { prisma } from "./prisma.server";
import bcrypt from "bcryptjs";
import { RegisterForm } from "./types.server";

export const createUser = async (user: RegisterForm) => {
  const passwordHash = await bcrypt.hash(user.password, 10);

  const newUser = await prisma.user.create({
    data: {
      email: user.email,
      password: passwordHash,
      profile: {
        create: {
          firstName: user.profile?.firstName,
          lastName: user.profile?.lastName,
        },
      },
    },
  });
  return {
    id: newUser.id,
    email: user.email,
  };
};
