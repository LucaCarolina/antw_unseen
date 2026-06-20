import { put } from '@vercel/blob';

export const config = { runtime: 'edge' };

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const path = formData.get('path') as string | null;

    if (!file || !path) {
        return new Response('Missing file or path', { status: 400 });
    }

    const blob = await put(path, file, { access: 'public' });

    return Response.json({ url: blob.url });
}
