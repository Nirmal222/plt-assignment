import { UserProfile } from '../shared/interfaces';
import { saveUserProfile, updateUserProfile } from '../utils/db';
const crudCrudBase = 'https://crudcrud.com/api/20a41b65ebd149c4a64b9c0fc1e9d5c2/userprofiles';

export async function saveUserProfileToDB(profile: UserProfile): Promise<void> {
  await saveUserProfile(profile);
}


export async function updateUserProfileInDB(email: string, updates: Partial<UserProfile>): Promise<boolean> {
  return await updateUserProfile(email, updates);
}


export async function createCrudCrud(profile: UserProfile): Promise<void> {
  const res = await fetch(crudCrudBase);
  if (!res.ok) throw new Error('Failed to fetch users from CrudCrud');
  const users: UserProfile[] = await res.json();
  const exists = users.some(u => u.email === profile.email);
  if (exists) throw new Error('User with this email already exists in CrudCrud');

  await fetch(crudCrudBase, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
}

export async function updateCrudCrud(email: string, profile: UserProfile): Promise<void> {
  const res = await fetch(crudCrudBase);
  if (!res.ok) throw new Error('Failed to fetch users from CrudCrud');
  const users: any[] = await res.json();
  const user = users.find(u => u.email === email);
  if (!user || !user._id) throw new Error('User not found in CrudCrud');
  
  await fetch(`${crudCrudBase}/${user._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profile),
  });
}

export async function getUserFromCrudCrud(email: string): Promise<UserProfile | null> {
  console.log(`Fetching users from CrudCrud to find user with email: ${email}`);
  const res = await fetch(crudCrudBase);
  if (!res.ok) {
    console.error('Failed to fetch users from CrudCrud');
    return null;
  }
  const users: UserProfile[] = await res.json();
  const user = users.find(u => u.email === email) || null;
  if (user) {
    console.log(`User found: ${JSON.stringify(user)}`);
  } else {
    console.log(`No user found with email: ${email}`);
  }
  return user;
}

export async function updateUserInCrudCrud(email: string, updates: Partial<UserProfile>): Promise<boolean> {
  const res = await fetch(crudCrudBase);
  if (!res.ok) return false;
  const users: any[] = await res.json();
  const user = users.find(u => u.email === email);
  if (!user || !user._id) return false;
  const updateRes = await fetch(`${crudCrudBase}/${user._id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...user, ...updates }),
  });
  return updateRes.ok;
}
 
export async function deleteUserFromCrudCrud(id: string): Promise<boolean> {
  const res = await fetch(`${crudCrudBase}/${id}`, {
    method: 'DELETE',
  });
  return res.ok;
}