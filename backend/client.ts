

import {  
  getUserFromCrudCrudWorkflow,
  deleteUserFromCrudCrudWorkflow,
  createUserProfile,
  updateUserProfile
} from './workflows';
import type { UserProfile } from './shared/interfaces';
import { Client, Connection } from '@temporalio/client';
import { TASK_QUEUE_NAME } from './shared';
import { nanoid } from 'nanoid';

async function getClient() {
  const connection = await Connection.connect({ address: 'localhost:7233' });
  return new Client({ connection });
}

export async function runCreateUserProfile(profile: UserProfile) {
  const client = await getClient();
  const handle = await client.workflow.start(createUserProfile, {
    taskQueue: TASK_QUEUE_NAME,
    args: [profile],
    workflowId: 'createUserProfile-' + nanoid(),
  });
  await handle.result();
  console.log('User profile creation workflow completed.');
}

export async function runUpdateUserProfile(email: string, profile: UserProfile) {
  const client = await getClient();
  const handle = await client.workflow.start(updateUserProfile, {
    taskQueue: TASK_QUEUE_NAME,
    args: [email, profile],
    workflowId: 'updateUserProfile-' + nanoid(),
  });
  await handle.result();
  console.log('User profile update workflow completed.');
}
export async function runGetUserFromCrudCrud(email: string) {
  const client = await getClient();
  const handle = await client.workflow.start(getUserFromCrudCrudWorkflow, {
    taskQueue: TASK_QUEUE_NAME,
    args: [email],
    workflowId: 'getUserFromCrudCrud-' + nanoid(),
  });
  const user = await handle.result();
  console.log('Fetched user from CrudCrud:', user);
  return user;
}

export async function runDeleteUserFromCrudCrud(id: string) {
  const client = await getClient();
  const handle = await client.workflow.start(deleteUserFromCrudCrudWorkflow, {
    taskQueue: TASK_QUEUE_NAME,
    args: [id],
    workflowId: 'deleteUserFromCrudCrud-' + nanoid(),
  });
  const result = await handle.result();
  console.log('Delete from crudcrud result:', result);
  return result;
}