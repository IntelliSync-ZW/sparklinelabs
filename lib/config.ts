export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
export const WHATSAPP_PROJECT_MESSAGE = encodeURIComponent(
  "Hi Sparkline, I'd like to discuss a project"
);
export const WHATSAPP_BETA_MESSAGE = encodeURIComponent(
  "Hi Sparkline, I'd like to request beta access to the Agency CRM"
);
export const WHATSAPP_NOTIFY_MESSAGE = encodeURIComponent(
  "Hi Sparkline, please notify me when WhatsApp Lead Router launches"
);

export const waLink = (message: string) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

export const WA_PROJECT_LINK = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_PROJECT_MESSAGE}`;
