import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("plans");
export const GET = handler.GET;
export const POST = handler.POST;
