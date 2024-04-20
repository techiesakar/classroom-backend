import { put } from '@vercel/blob';

export const config = {
  runtime: 'edge',
};

export default async function upload(request) {
  const form = await request.formData();
  const file = form.get('file') as File;
  const blob = await put(file.name, file, { access: 'public' });

  return Response.json(blob);
}
