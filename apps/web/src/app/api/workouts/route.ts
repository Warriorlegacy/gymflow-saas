import { createResourceHandler } from "@/lib/crud-handler";

const handler = createResourceHandler("workouts");
export const GET = handler.GET;
export const POST = handler.POST;
