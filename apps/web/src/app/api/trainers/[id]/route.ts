import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("trainers");
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
