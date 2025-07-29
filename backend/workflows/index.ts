
import * as workflow from '@temporalio/workflow';
import type * as activities from '../activities';
import { UserProfile } from '../shared/interfaces';

const {
  saveUserProfileToDB,
  createCrudCrud,
  updateUserProfileInDB,
  getUserFromCrudCrud,
  updateUserInCrudCrud,
  deleteUserFromCrudCrud,
  updateCrudCrud
} = workflow.proxyActivities<typeof activities>({ 
  retry: {
    initialInterval: '1 second',
    maximumInterval: '1 minute',
    backoffCoefficient: 2,
  },
  startToCloseTimeout: '1 minute',
});


export async function createUserProfile(profile: UserProfile): Promise<void> {
  await saveUserProfileToDB(profile);
  await workflow.sleep(10000);
  await createCrudCrud(profile);
}

export async function updateUserProfile(email: string, profile: UserProfile): Promise<void> {
  await updateUserProfileInDB(email, profile);
  await workflow.sleep(10000);
  await updateCrudCrud(email, profile);
} 

export async function updateUserProfileInDBWorkflow(email: string, updates: Partial<UserProfile>): Promise<boolean> {
  return await updateUserProfileInDB(email, updates);
} 

export async function getUserFromCrudCrudWorkflow(email: string): Promise<UserProfile | null> {
  workflow.log.info(`Fetching user from CrudCrud with email: ${email}`);
  const user = await getUserFromCrudCrud(email);
  if (user) {
    workflow.log.info(`User found for email: ${email}`);
  } else {
    workflow.log.warn(`No user found for email: ${email}`); 
  }
  return user;
}

export async function updateUserInCrudCrudWorkflow(email: string, updates: Partial<UserProfile>): Promise<boolean> {
  return await updateUserInCrudCrud(email, updates);
}

export async function deleteUserFromCrudCrudWorkflow(id: string): Promise<boolean> {
  return await deleteUserFromCrudCrud(id);
}