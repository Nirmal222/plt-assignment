export async function updateUserProfile(email: string, updates: Partial<UserProfile>): Promise<boolean> {
  await connectDB();
  if (!collection) throw new Error('DB not initialized');
  const result = await collection.updateOne({ email }, { $set: updates });
  return result.modifiedCount > 0;
}


import type { UserProfile } from '../shared/interfaces';
import { MongoClient, Db, Collection } from 'mongodb';

const uri = 'mongodb+srv://nirmal:o6PphTnRCakO0ZBz@cluster0.mblw2g3.mongodb.net/?tlsAllowInvalidCertificates=true';
const dbName = 'plt';
const collectionName = 'userprofiles';

let client: MongoClient | null = null;
let db: Db | null = null;
let collection: Collection<UserProfile> | null = null;

async function connectDB() {
  if (!client) {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    collection = db.collection<UserProfile>(collectionName);
  }
}

function validateUserProfile(profile: any): profile is UserProfile {
  return (
    typeof profile === 'object' &&
    typeof profile.firstName === 'string' &&
    typeof profile.lastName === 'string' &&
    typeof profile.phone === 'string' &&
    typeof profile.city === 'string' &&
    typeof profile.pincode === 'string'
  );
}

export async function saveUserProfile(profile: any) {
  if (!validateUserProfile(profile)) {
    throw new Error('Invalid user profile data');
  }
  await connectDB();
  if (!collection) throw new Error('DB not initialized');
  const existing = await collection.findOne({ email: profile.email });
  if (existing) {
    throw new Error('User profile with this email already exists');
  }
  await collection.insertOne(profile);
  return true;
}



export async function getUserProfile(query: Partial<UserProfile>) {
  await connectDB();
  if (!collection) throw new Error('DB not initialized');
  return await collection.findOne(query);
}
