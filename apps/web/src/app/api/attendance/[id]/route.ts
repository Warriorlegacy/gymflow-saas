import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("attendance");
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
