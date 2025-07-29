
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"

async function saveUserToDB(profile: any) {
  // Map Google profile to your UserProfile type as needed
  const userProfile = {
    firstName: profile.given_name || profile.name?.split(' ')[0] || '',
    lastName: profile.family_name || profile.name?.split(' ')[1] || '',
    phone: '', // Google profile may not provide phone
    city: '',
    pincode: '',
    email: profile.email || '',
    image: profile.picture || '',
  };
  console.log('Saving user to DB:', userProfile);
  try {
    const response = await fetch('http://localhost:4000/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userProfile),
    });
    if (!response.ok) {
      console.error('Failed to save user to DB:', response.status, response.statusText);
    } else {
      console.log('User saved to DB successfully');
    }
  } catch (e) {
    console.error('Error saving user to DB:', e);
  }
}

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/",
  },
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, account, profile }) {
      // Save user to DB only on first login (when profile is present)
      if (profile) {
        await saveUserToDB(profile);
      }
      return token;
    },
  },
})

export { handler as GET, handler as POST }
