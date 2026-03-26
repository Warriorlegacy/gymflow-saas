import { ZodIssue, ZodTypeAny } from "zod";

export function parseWithSchema(schema: ZodTypeAny, input: unknown) {
  const result = schema.safeParse(input);
  if (!result.success) {
    const message = result.error.issues.map((issue: ZodIssue) => issue.message).join(", ");
    throw new Error(message || "Validation failed");
  }

  return result.data;
}
