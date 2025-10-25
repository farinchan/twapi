// src/lib/server-auth.ts
import { headers } from 'next/headers';

/**
 * Get current authenticated user from middleware headers
 * Only works in Server Components and Route Handlers
 */
export async function getCurrentUserFromHeaders() {
  const headersList = await headers();
  const userId = headersList.get('x-user-id');
  const userEmail = headersList.get('x-user-email');

  if (!userId || !userEmail) {
    return null;
  }

  return {
    userId: parseInt(userId),
    email: userEmail,
  };
}

/**
 * Require authentication in Server Component
 * Throws error if user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUserFromHeaders();
  
  if (!user) {
    throw new Error('Unauthorized: No user found in request headers');
  }

  return user;
}
