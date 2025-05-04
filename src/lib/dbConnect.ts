import mongoose from "mongoose";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	console.log("Connecting to Database...");
	if (connection.isConnected) {
		console.log("Already connected to Database");
		return;
	}

	try {
		const db = await mongoose.connect(process.env.MONGODB_URI || "", {});
		connection.isConnected = db.connections[0].readyState;
		console.log("Connected to Database successfully");
	} catch (error) {
		console.error("Error connecting to database:", error);
		process.exit(1);
	}
}

export default dbConnect;
