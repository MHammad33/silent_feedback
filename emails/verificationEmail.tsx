import {
	Html,
	Head,
	Font,
	Preview,
	Heading,
	Row,
	Section,
	Text,
	Button,
} from "@react-email/components";

interface VerificationEmailProps {
	username: string;
	otp: string;
}

export default function VerificationEmail({
	username,
	otp,
}: VerificationEmailProps) {
	return (
		<Html lang="en" dir="ltr">
			<Head>
				<title>Verification Code</title>
				<Font
					fontFamily="Roboto"
					fallbackFontFamily="Verdana"
					webFont={{
						url: "https://fonts.googleapis.com/css2?family=Roboto:wght@400&display=swap",
						format: "woff2",
					}}
					fontWeight={400}
					fontStyle="normal"
				/>
			</Head>
			<Preview>Here&apos;s your verification code: {otp}</Preview>
			<Section>
				<Row>
					<Heading as="h2">Hello {username},</Heading>
				</Row>
				<Row>
					<Text style={{ fontFamily: "Roboto, Verdana", fontSize: "16px" }}>
						Thank you for registering with us! To complete your registration,
						please verify your email address.
					</Text>
				</Row>
				<Row>
					<Text style={{ fontFamily: "Roboto, Verdana", fontSize: "16px" }}>
						Here&apos;s your verification code: <strong>{otp}</strong>
					</Text>
				</Row>
				<Row>
					<Text style={{ fontFamily: "Roboto, Verdana", fontSize: "16px" }}>
						If you did not request this code, please ignore this email.
					</Text>
				</Row>
			</Section>
		</Html>
	);
}
