import { put } from '@vercel/blob';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function readBody(req: VercelRequest): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const chunks: Buffer[] = [];
        req.on('data', (chunk: Buffer) => chunks.push(chunk));
        req.on('end', () => resolve(Buffer.concat(chunks)));
        req.on('error', reject);
    });
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const path = req.query.path as string;
    const contentType = (req.headers['content-type'] as string) ?? 'application/octet-stream';

    if (!path) return res.status(400).json({ error: 'Missing path' });

    const body = await readBody(req);
    const blob = await put(path, body, { access: 'public', contentType });

    return res.json({ url: blob.url });
}
