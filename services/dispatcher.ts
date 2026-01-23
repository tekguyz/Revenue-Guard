import { WebhookPayloadSchema } from '../schemas/api-contract';

export const dispatchLeadToCRM = async (payload: unknown) => {
  // Validate payload structure before dispatching
  const validation = WebhookPayloadSchema.safeParse(payload);
  
  if (!validation.success) {
    console.error("Dispatcher: Invalid payload", validation.error);
    throw new Error("Invalid payload for CRM dispatch");
  }

  // Simulate Network Latency and External System Handoff
  console.log("Dispatcher: Syncing with External CRM...", validation.data);
  
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  return { success: true, timestamp: new Date().toISOString() };
};