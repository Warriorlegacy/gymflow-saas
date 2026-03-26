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

export async function registerRoutes(app: FastifyInstance) {
  app.get("/health", async () => ({ ok: true }));

  app.get("/api/dashboard", async (request) =>
    getDashboardSnapshot(getGymIdFromRequest(request.headers)),
  );
  app.get("/api/members", async (request) =>
    getResourceCollection("members", getGymIdFromRequest(request.headers)),
  );
  app.get("/api/plans", async (request) =>
    getResourceCollection("plans", getGymIdFromRequest(request.headers)),
  );
  app.get("/api/payments", async (request) =>
    getResourceCollection("payments", getGymIdFromRequest(request.headers)),
  );
  app.get("/api/attendance", async (request) =>
    getResourceCollection("attendance", getGymIdFromRequest(request.headers)),
  );
  app.get("/api/trainers", async (request) =>
    getResourceCollection("trainers", getGymIdFromRequest(request.headers)),
  );
  app.get("/api/workouts", async (request) =>
    getResourceCollection("workouts", getGymIdFromRequest(request.headers)),
  );
  app.get("/api/diet-plans", async (request) =>
    getResourceCollection("diet-plans", getGymIdFromRequest(request.headers)),
  );

  for (const resource of [
    "members",
    "plans",
    "payments",
    "attendance",
    "trainers",
    "workouts",
    "diet-plans",
  ] as const) {
    app.post(`/api/${resource}`, async (request, reply) => {
      try {
        const gymId = getGymIdFromRequest(request.headers);
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
    app.put(`/api/${resource}/:id`, async (request) =>
      updateResource(
        resource,
        getGymIdFromRequest(request.headers),
        (request.params as { id: string }).id,
        parseWithSchema(resourceSchemas[resource], request.body) as Record<
          string,
          unknown
        >,
      ),
    );
    app.delete(`/api/${resource}/:id`, async (request) =>
      deleteResource(
        resource,
        getGymIdFromRequest(request.headers),
        (request.params as { id: string }).id,
      ),
    );
  }

  app.post("/api/ai/generate", async (request) => {
    const body = request.body as { feature: string; prompt: string };
    return {
      output: await generateAIResponse(body.feature, body.prompt),
    };
  });

  app.post("/api/whatsapp/send", async (request) => {
    const body = request.body as { to: string; message: string };
    return sendWhatsAppMessage(body.to, body.message);
  });

  app.post("/api/billing/demo-subscribe", async (request) => {
    const body = request.body as { tier: string };
    return createDemoSubscription(body.tier);
  });

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
