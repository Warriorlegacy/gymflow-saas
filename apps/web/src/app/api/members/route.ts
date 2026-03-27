import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("members");
export const GET = handler.GET;
export const POST = handler.POST;
