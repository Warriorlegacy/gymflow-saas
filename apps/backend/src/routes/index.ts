import type { FastifyInstance } from "fastify";
import { onboardingGymSchema, resourceSchemas } from "@gymflow/lib";
import { createDemoSubscription } from "../services/billing-service";
import { generateAIResponse } from "../services/ai-service";
import {
  getDashboardSnapshot,
  getResourceCollection,
} from "../services/dashboard-service";
import { getGymIdFromRequest } from "../lib/tenant";
import { parseWithSchema } from "../lib/validation";
import { createGymOnboarding } from "../services/onboarding-service";
import {
  createResource,
  deleteResource,
  updateResource,
} from "../services/resource-service";
import { sendWhatsAppMessage } from "../services/whatsapp-service";
import { registerWebhookRoutes } from "./webhooks";
import { registerMemberRoutes } from "./member-auth";
import { registerGymOwnerRoutes } from "./owner-auth";

function requireGymId(
  headers: Record<string, string | string[] | undefined>,
): string {
  const gymId = getGymIdFromRequest(headers);
  if (!gymId) {
    throw new Error("Missing x-gym-id header");
  }
  return gymId;
}

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true }));

  await registerWebhookRoutes(app);
  await registerMemberRoutes(app);
  await registerGymOwnerRoutes(app);

  // Dashboard
  app.get("/api/dashboard", async (request, reply) => {
    try {
      const gymId = requireGymId(request.headers);
      return getDashboardSnapshot(gymId);
    } catch (error) {
      reply.code(401);
      return { error: error instanceof Error ? error.message : "Unauthorized" };
    }
  });

  // Resource GET endpoints
  for (const resource of [
    "members",
    "plans",
    "payments",
    "attendance",
    "trainers",
    "workouts",
    "diet-plans",
  ] as const) {
    app.get(`/api/${resource}`, async (request, reply) => {
      try {
        const gymId = requireGymId(request.headers);
        return getResourceCollection(resource, gymId);
      } catch (error) {
        reply.code(401);
        return {
          error: error instanceof Error ? error.message : "Unauthorized",
        };
      }
    });

    // Resource POST endpoints
    app.post(`/api/${resource}`, async (request, reply) => {
      try {
        const gymId = requireGymId(request.headers);
        const payload = parseWithSchema(
          resourceSchemas[resource],
          request.body,
        );
        return createResource(
          resource,
          gymId,
          payload as Record<string, unknown>,
        );
      } catch (error) {
        reply.code(400);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Invalid request",
        };
      }
    });

    // Resource PUT endpoints
    app.put(`/api/${resource}/:id`, async (request, reply) => {
      try {
        const gymId = requireGymId(request.headers);
        const payload = parseWithSchema(
          resourceSchemas[resource],
          request.body,
        );
        return updateResource(
          resource,
          gymId,
          (request.params as { id: string }).id,
          payload as Record<string, unknown>,
        );
      } catch (error) {
        reply.code(400);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Invalid request",
        };
      }
    });

    // Resource DELETE endpoints
    app.delete(`/api/${resource}/:id`, async (request, reply) => {
      try {
        const gymId = requireGymId(request.headers);
        return deleteResource(
          resource,
          gymId,
          (request.params as { id: string }).id,
        );
      } catch (error) {
        reply.code(400);
        return {
          success: false,
          error: error instanceof Error ? error.message : "Invalid request",
        };
      }
    });
  }

  // AI generation
  app.post("/api/ai/generate", async (request, reply) => {
    try {
      const body = request.body as { feature: string; prompt: string };
      return {
        output: await generateAIResponse(body.feature, body.prompt),
      };
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : "AI generation failed",
      };
    }
  });

  // WhatsApp
  app.post("/api/whatsapp/send", async (request, reply) => {
    try {
      const body = request.body as { to: string; message: string };
      return sendWhatsAppMessage(body.to, body.message);
    } catch (error) {
      reply.code(500);
      return {
        success: false,
        error: error instanceof Error ? error.message : "WhatsApp send failed",
      };
    }
  });

  // Billing
  app.post("/api/billing/demo-subscribe", async (request, reply) => {
    try {
      const body = request.body as { tier: string };
      return createDemoSubscription(body.tier);
    } catch (error) {
      reply.code(400);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Subscription failed",
      };
    }
  });

  // Onboarding
  app.post("/api/onboarding/gym", async (request, reply) => {
    try {
      const payload = parseWithSchema(onboardingGymSchema, request.body);
      return createGymOnboarding(payload);
    } catch (error) {
      reply.code(400);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Invalid onboarding request",
      };
    }
  });
}
