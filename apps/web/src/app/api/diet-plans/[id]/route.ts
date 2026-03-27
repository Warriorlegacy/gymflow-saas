import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("diet-plans");
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
