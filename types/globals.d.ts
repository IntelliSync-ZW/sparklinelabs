export {};

export type Role = "author" | "admin";

declare global {
  // Clerk public metadata, as read on the client through useUser()
  interface UserPublicMetadata {
    roles?: Role[];
    sanityAuthorId?: string;
  }

  // Clerk session token claims. Requires the session token template
  // `{"metadata": "{{user.public_metadata}}"}` in the Clerk Dashboard.
  interface CustomJwtSessionClaims {
    metadata?: {
      roles?: Role[];
      sanityAuthorId?: string;
    };
  }
}
