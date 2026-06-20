import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export default async function handler(req: Request): Promise<Response> {
    if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

    const body = await req.json() as HandleUploadBody;

    const json = await handleUpload({
        body,
        request: req,
        onBeforeGenerateToken: async () => ({
            allowedContentTypes: ['image/*', 'video/*', 'audio/*', 'application/octet-stream'],
            maximumSizeInBytes: 200 * 1024 * 1024,
        }),
        onUploadCompleted: async () => {},
    });

    return Response.json(json);
}
