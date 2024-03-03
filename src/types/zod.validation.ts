import { z } from "zod"

export const CustomUser = z.object({
    id: z.string(),
    name: z.string(),
})

export const CustomRoom = z.object({
    id: z.string(),
    name: z.string(),
    inviteCode: z.string(),
    teacher: CustomUser,
    // students: z.array(CustomUser).optional()
})