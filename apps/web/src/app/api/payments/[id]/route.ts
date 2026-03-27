import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("payments");
export const PUT = handler.PUT;
export const DELETE = handler.DELETE;
