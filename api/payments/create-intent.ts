// Vercel Serverless Function: Create Stripe Payment Intent without bundling server SDK
// NOTE: Set STRIPE_SECRET_KEY in your Vercel project environment variables.

export default async function handler(req: any, res: any) {
  try {
    if (req.method !== 'POST') {
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    // Parse JSON body (support both automatically parsed and raw stream)
    const body = await (async () => {
      if (req.body && typeof req.body === 'object') return req.body;
      try {
        const chunks: Buffer[] = [];
        for await (const chunk of req) chunks.push(Buffer.from(chunk));
        const raw = Buffer.concat(chunks).toString('utf8');
        return JSON.parse(raw || '{}');
      } catch {
        return {} as any;
      }
    })();

    const amount = Number(body.amount);
    const description = typeof body.description === 'string' ? body.description : undefined;

    if (!Number.isFinite(amount) || amount <= 0) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Invalid amount' }));
      return;
    }

    const apiKey = process.env.STRIPE_SECRET_KEY;
    if (!apiKey) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Stripe secret key not configured' }));
      return;
    }

    const params = new URLSearchParams();
    params.set('amount', String(amount));
    params.set('currency', 'usd');
    if (description) params.set('description', description);

    const stripeResp = await fetch('https://api.stripe.com/v1/payment_intents', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params,
    });

    const text = await stripeResp.text();
    if (!stripeResp.ok) {
      res.statusCode = stripeResp.status;
      res.setHeader('Content-Type', 'application/json');
      // Do not leak full Stripe error details in production
      try {
        const parsed = JSON.parse(text);
        res.end(JSON.stringify({ error: 'Stripe error', status: stripeResp.status, type: parsed?.error?.type }));
      } catch {
        res.end(JSON.stringify({ error: 'Stripe error', status: stripeResp.status }));
      }
      return;
    }

    const intent = JSON.parse(text);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({
      paymentIntentId: intent.id,
      clientSecret: intent.client_secret,
      status: intent.status,
    }));
  } catch (err: any) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Internal error' }));
  }
}

