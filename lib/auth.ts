import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { resend } from "./resend";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword(data) {
      await resend.emails.send({
        to: data.user.email,
        from: "noreply@hoop-dashboard.com",
        subject: "Reset your password",
        text: `Hello ${data.user.email}! Click here to reset your password: https://hoop-dashboard.com/reset-password?token=${data.url}`,
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  plugins: [nextCookies()],
});
