"use client";

import { FC, useEffect, useState } from "react";
import * as z from "zod";
import axios, { AxiosError } from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useDebounceCallback } from "usehooks-ts";
import Link from "next/link";
import { toast } from "sonner";
import { signUpSchema } from "@/schemas/signUpSchema";
import { ApiResponse } from "@/types/ApiResponse";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface pageProps {}

const page: FC<pageProps> = ({}) => {
	const [username, setUsername] = useState("");
	const [usernameMessage, setUsernameMessage] = useState("");
	const [isCheckingUsername, setIsCheckingUsername] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const debounced = useDebounceCallback(setUsername, 500);
	const router = useRouter();

	// Zod schema for form validation
	const form = useForm<z.infer<typeof signUpSchema>>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const checkUsernameUniqueness = async () => {
			if (username) {
				setIsCheckingUsername(true);
				setUsernameMessage("");

				try {
					const response = await axios.get(
						`/api/check-username-unique/?username=${username}`
					);
					setUsernameMessage(response.data.message);
				} catch (error) {
					const axiosError = error as AxiosError<ApiResponse>;
					setUsernameMessage(
						axiosError.response?.data.message ?? "An error occurred"
					);
				} finally {
					setIsCheckingUsername(false);
				}
			}
		};

		checkUsernameUniqueness();
	}, [username]);

	const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
		setIsSubmitting(true);

		try {
			const response = await axios.post<ApiResponse>("/api/sign-up", data);
			toast.success("Success", {
				description: response.data.message,
				duration: 2000,
				style: {
					backgroundColor: "green",
					color: "white",
				},
			});
			router.replace(`/verify/${username}`);
			setIsSubmitting(false);
		} catch (error) {
			console.error("Error in sign-up:", error);
			const axiosError = error as AxiosError<ApiResponse>;
			let errorMessage =
				axiosError.response?.data.message ?? "An error occurred";
			toast.error("Error", {
				description: errorMessage,
				duration: 2000,
				style: {
					backgroundColor: "red",
					color: "white",
				},
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
				{/* Intro */}
				<div className="text-center">
					<h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
						Join Silent Feedback
					</h1>
					<p className="text-gray-600 mb-4">
						Sign up to start sharing your feedback with the world.
					</p>
				</div>

				{/* Form */}
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						{/* Username */}
						<FormField
							name="username"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Username</FormLabel>
									<FormControl>
										<Input
											placeholder="Username"
											{...field}
											onChange={(e) => {
												field.onChange(e);
												debounced(e.target.value);
											}}
										/>
									</FormControl>
									{isCheckingUsername && <Loader2 className="animate-spin" />}
									<p
										className={`text-sm ${usernameMessage === "Username is unique" ? "text-green-500" : "text-red-500"}`}
									>
										<>
											{usernameMessage === "Username is unique" ? (
												<Check className="inline" />
											) : (
												usernameMessage.length > 0 && "X"
											)}{" "}
											{usernameMessage}
										</>
									</p>
									<FormDescription className="hidden">
										This is the name that will be displayed to others.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Email */}
						<FormField
							name="email"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											type="email"
											placeholder="Email address"
											{...field}
										/>
									</FormControl>
									<FormDescription className="hidden">
										We will send you a verification email to this address.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						{/* Password */}
						<FormField
							name="password"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input type="password" placeholder="Password" {...field} />
									</FormControl>
									<FormDescription className="hidden">
										Your password must be at least 8 characters long.
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="submit"
							disabled={isSubmitting}
							className="cursor-pointer"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
								</>
							) : (
								"Sign Up"
							)}
						</Button>
					</form>
				</Form>
				{/* Footer */}
				<div className="mt-4 text-center">
					<p className="text-sm text-gray-600">
						Already have an account?{" "}
						<Link
							href="/sign-in"
							className="text-blue-500 hover:underline hover:text-blue-700"
						>
							Sign In
						</Link>
					</p>
				</div>
			</div>
		</div>
	);
};

export default page;
