import * as z from "zod"

export const formSchema = z.object({
  prompt: z.string().min(1, "Please enter a message"),
  images: z.array(z.instanceof(File)).optional(),
})

export type FormValues = z.infer<typeof formSchema>
