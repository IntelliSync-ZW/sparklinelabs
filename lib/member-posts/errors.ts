/** Friendly text for the error codes the dashboard's actions and upload route return. */
const MESSAGES: Record<string, string> = {
  UNAUTHENTICATED: "Your session has ended. Sign in again to keep working.",
  FORBIDDEN: "Your account does not have author access.",
  NO_AUTHOR_PROFILE:
    "Your account is not linked to an author profile yet. Ask an editor to link it.",
  NOT_FOUND: "This post could not be found.",
  LOCKED: "This post is locked because it is in review or already published.",
  CONFLICT: "This post changed while saving. Try again.",
  INVALID_INPUT:
    "Some fields are not valid. Check the title (3 to 120 characters) and that every image has alt text.",
  INVALID_MARK: "Some formatting is not supported here. Remove it and try again.",
  RATE_LIMITED: "You have started 10 posts in the last 24 hours. Try again tomorrow.",
  INCOMPLETE: "Write something in the body before submitting the post.",
  INVALID_TABLE: "A table could not be read. Open it and check the STL.",
  UNSAFE_TABLE_LINK:
    "A table has a link that is not allowed. Use https://, mailto: or a path on this site such as /services.",
  NO_FILE: "Choose an image to upload.",
  BAD_TYPE: "Use a JPEG, PNG, WebP or GIF image.",
  TOO_LARGE: "Images must be 4 MB or smaller.",
  UPLOAD_RATE_LIMITED: "You have uploaded 30 images in the last hour. Try again later.",
  UPLOAD_FAILED: "The image could not be uploaded. Try again.",
  SERVER_ERROR: "Something went wrong. Try again.",
};

export const errorMessage = (code: string) => MESSAGES[code] ?? MESSAGES.SERVER_ERROR;
