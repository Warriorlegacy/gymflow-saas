import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("diet-plans");
export const GET = handler.GET;
export const POST = handler.POST;
