import { z } from "zod"

export const loginFormSchema = z.object({
  email: z.string().email("يرجى إدخال بريد إلكتروني صحيح."),
  password: z.string().min(8, "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل."),
  role: z.enum(["admin", "teacher", "parent"]),
})

export type LoginFormValues = z.infer<typeof loginFormSchema>
