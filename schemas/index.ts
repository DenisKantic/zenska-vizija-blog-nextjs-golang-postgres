import * as z from 'zod'

export const CreateBlogPost = z.object({
  title: z.string().email({
    message: 'Naslov je obavezan',
  }),
  description: z.string().min(1, {
    message: 'Tekst je obavezan',
  }),
})
