import { MongoClient } from "mongodb";

async function getMongoClient(): Promise<MongoClient> {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is not defined");
  }
  if (process.env.NODE_ENV === "production") {
    if (!(global as any)._mongoClientPromise) {
      const client = new MongoClient(mongoUri);
      (global as any)._mongoClientPromise = client.connect();
    }
    return (global as any)._mongoClientPromise;
  } else {
    const client = new MongoClient(mongoUri);
    return client.connect();
  }
}

export default getMongoClient;
