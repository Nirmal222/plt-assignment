import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import {
  runGetUserFromCrudCrud, 
  runDeleteUserFromCrudCrud,
  runCreateUserProfile,
  runUpdateUserProfile
} from '../client';
import { UserProfile } from '../shared/interfaces';

const app = express();
app.use(cors());
app.use(bodyParser.json());


app.get('/api/profile/email/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log(`Received request to fetch user with email: ${email}`);
    const user = await runGetUserFromCrudCrud(email);
    if (!user) {
      console.warn(`User not found for email: ${email}`);
      return res.status(404).json({ error: 'User not found' });
    }
    console.log(`User fetched successfully for email: ${email}`);
    res.json(user);
  } catch (err) {
    console.error('Failed to fetch user:', err);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

app.post('/api/profile', async (req, res) => {
  try {
    const createProfile = req.body as UserProfile;
    console.log('Received request to create/update profile:', createProfile);
    await runCreateUserProfile(createProfile);
    console.log('Profile workflow started successfully for:', createProfile.email);
    res.json({ message: 'Profile updated, workflow started.' });
  } catch (err) {
    console.error('Failed to update profile:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Update user profile by email (expects full profile in body)
app.post('/api/update-profile', async (req, res) => {
  try {
    const updatedProfile = req.body as UserProfile;
    const email = updatedProfile.email;
    if (!email) {
      return res.status(400).json({ error: 'Email is required to update profile' });
    }
    console.log('Received request to update profile:', updatedProfile);
    await runUpdateUserProfile(email, updatedProfile);
    console.log('Profile updated successfully for:', email);
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to update user profile:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete user in crudcrud by id
app.delete('/api/profile/:id', async (req, res) => {
  try {
    const result = await runDeleteUserFromCrudCrud(req.params.id);
    res.json({ success: result });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));
