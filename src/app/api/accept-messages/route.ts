import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextAuth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "Not Authenticated",
			},
			{
				status: 401,
			}
		);
	}

	const userId = user._id;
	const { acceptMessages } = await request.json();

	try {
		const updatedUser = await UserModel.findByIdAndUpdate(
			userId,
			{
				isAcceptingMessage: acceptMessages,
			},
			{ new: true } // Returns updated value
		);

		if (!updatedUser) {
			return Response.json(
				{
					success: false,
					message: "Failed to update user status to accept messages",
				},
				{
					status: 401,
				}
			);
		}

		return Response.json(
			{
				success: true,
				message: "Message Acceptance status updated successfully",
				updatedUser,
			},
			{
				status: 200,
			}
		);
	} catch {
		console.log("Failed to update user status to accept messages");
		return Response.json(
			{
				success: false,
				message: "Failed to update user status to accept messages",
			},
			{
				status: 500,
			}
		);
	}
}

export async function GET() {
	await dbConnect();

	const session = await getServerSession(authOptions);
	const user: User = session?.user as User;

	if (!session || !session.user) {
		return Response.json(
			{
				success: false,
				message: "Not Authenticated",
			},
			{
				status: 401,
			}
		);
	}

	const userId = user._id;

	try {
		const foundUser = await UserModel.findById(userId);

		if (!foundUser) {
			return Response.json(
				{
					success: false,
					message: "User Not Found",
				},
				{
					status: 404,
				}
			);
		}

		return Response.json(
			{
				success: true,
				message: "User Found",
				isAcceptingMessage: foundUser.isAcceptingMessage,
			},
			{
				status: 200,
			}
		);
	} catch {
		console.log("Failed to get user status of accepting messages");
		return Response.json(
			{
				success: false,
				message: "Failed to get user status of accepting messages",
			},
			{
				status: 500,
			}
		);
	}
}
