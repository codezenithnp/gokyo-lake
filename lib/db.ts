import mongoose from "mongoose";

const { MONGODB_URI, NODE_ENV } = process.env;

if (!MONGODB_URI) {
  const message = "Missing MONGODB_URI environment variable.";
  if (NODE_ENV === "production") {
    throw new Error(message);
  }
  console.warn(message);
}

const normalizedUri = MONGODB_URI
  ? MONGODB_URI.trim()
      .replace(/^MONGODB_URI=/i, "")
      .replace(/^['"]|['"]$/g, "")
  : "";

if (normalizedUri) {
  if (
    !normalizedUri.startsWith("mongodb://") &&
    !normalizedUri.startsWith("mongodb+srv://")
  ) {
    throw new Error(
      'Invalid MONGODB_URI scheme. Expected "mongodb://" or "mongodb+srv://".'
    );
  }
}

type MongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  uri?: string;
};

const globalForMongoose = globalThis as unknown as {
  mongooseCache?: MongooseCache;
};

const cached = globalForMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
  uri: undefined,
};

globalForMongoose.mongooseCache = cached;

export async function connectDB() {
  if (!MONGODB_URI) {
    throw new Error("Missing MONGODB_URI environment variable.");
  }

  if (cached.uri && cached.uri !== normalizedUri) {
    cached.conn = null;
    cached.promise = null;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.uri = normalizedUri;
    cached.promise = mongoose
      .connect(normalizedUri, { bufferCommands: false })
      .catch((error) => {
        cached.promise = null;
        throw error;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
