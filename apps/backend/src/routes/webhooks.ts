import type { FastifyInstance } from "fastify";
import * as crypto from "crypto";

export async function registerWebhookRoutes(app: FastifyInstance) {
  app.post("/api/webhooks/razorpay", async (request, reply) => {
    const secret = process.env.RAZORPAY_KEY_SECRET ?? "";
    const signature = (request.headers["x-razorpay-signature"] as string) ?? "";

    if (secret && signature) {
      const body = JSON.stringify(request.body);
      const expected = crypto
        .createHmac("sha256", secret)
        .update(body)
        .digest("hex");
      if (expected !== signature) {
        reply.code(400);
        return { success: false, error: "Invalid signature" };
      }
    }

    const payload = request.body as {
      event?: string;
      payload?: {
        payment?: { entity?: Record<string, unknown> };
        subscription?: { entity?: Record<string, unknown> };
      };
    };

    const event = payload.event ?? "unknown";
    app.log.info(`Razorpay webhook: ${event}`);

    switch (event) {
      case "payment.captured":
      case "payment.failed":
        app.log.info(
          `Payment event: ${JSON.stringify(payload.payload?.payment?.entity ?? {})}`,
        );
        break;
      case "subscription.charged":
      case "subscription.cancelled":
      case "subscription.completed":
        app.log.info(
          `Subscription event: ${JSON.stringify(payload.payload?.subscription?.entity ?? {})}`,
        );
        break;
      default:
        app.log.info(`Unhandled webhook event: ${event}`);
    }

    return { success: true, event };
  });
}
