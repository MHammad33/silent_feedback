/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				identifier: { label: "Email", type: "text" },
				password: { label: "Password", type: "password" },
			},

			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			async authorize(credentials: any, req): Promise<any> {
				await dbConnect();

				try {
					const user = await UserModel.findOne({
						$or: [
							{ email: credentials.identifier },
							{ username: credentials.identifier },
						],
					});

					if (!user) {
						throw new Error("No user found with this email.");
					}

					if (!user.isVerified) {
						throw new Error("Not Verified! Please verify your account first.");
					}

					const isPasswordCorrect = await bcrypt.compare(
						credentials?.password,
						user.password
					);

					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Invalid username or password");
					}
				} catch (err: unknown) {
					const msg = err instanceof Error ? err.message : String(err);
					throw new Error(msg);
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.isVerified = user.isVerfied;
				token.isAcceptingMessage = user.isAcceptingMessage;
				token.username = user.username;
			}
			return token;
		},

		async session({ session, token }) {
			if (token) {
				session.user._id = token._id;
				session.user.isVerfied = token.isVerfied;
				session.user.isAcceptingMessage = token.isAcceptingMessage;
				session.user.username = token.username;
			}

			return session;
		},
	},
	pages: {
		signIn: "/sign-in",
	},
	session: {
		strategy: "jwt",
	},
	secret: process.env.NEXTAUTH_SECRET,
};
