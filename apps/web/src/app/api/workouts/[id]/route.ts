import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("workouts");
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
