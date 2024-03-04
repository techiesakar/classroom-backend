import { z } from "zod"

export const CustomUser = z.object({
    id: z.string(),
    name: z.string(),
})

export const CustomRoom = z.object({
    id: z.string(),
    name: z.string(),
    subject: z.string().optional(),
    inviteCode: z.string().optional(),
    teacher: CustomUser.optional(),
})