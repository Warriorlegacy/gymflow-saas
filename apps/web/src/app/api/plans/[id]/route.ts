import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("plans");
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
