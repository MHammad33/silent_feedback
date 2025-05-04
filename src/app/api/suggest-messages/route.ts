import { openai } from "@ai-sdk/openai";
import { APICallError, streamText } from "ai";
import { NextResponse } from "next/server";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST() {
	try {
		const prompt =
			"Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform where users can ask and answer questions. The questions should be thought-provoking and encourage discussion. For example, 'What is the most interesting thing you've learned recently?' || 'If you could have dinner with any historical figure, who would it be and why?' || 'What is a book that has significantly influenced your life?'. Avoid using the words 'question' or 'questions' in the output. Do not include any additional text or explanations. The questions should be relevant to a wide audience and suitable for a social messaging platform. Avoid using overly complex or technical language. The questions should be engaging and thought-provoking, encouraging users to share their thoughts and experiences. The output should be a single string with the questions separated by '||'. Do not include any additional text or explanations. The questions should be relevant to a wide audience and suitable for a social messaging platform. Ensure the questions are intriguing and encourage users to share their thoughts and experiences. The output should be a single string with the questions separated by '||'. Do not include any additional text or explanations. The questions should be relevant to a wide audience and suitable for a social messaging platform. Ensure the questions are intriguing and encourage users to share their thoughts and experiences.";

		const result = streamText({
			model: openai("gpt-4o"),
			prompt,
		});

		return result.toDataStreamResponse();
	} catch (error) {
		if (APICallError.isInstance(error)) {
			const { name, message, responseHeaders, statusCode } = error;
			return NextResponse.json(
				{
					name,
					headers: responseHeaders,
					message,
					status: statusCode,
				},
				{ status: statusCode }
			);
		}
	}
}
