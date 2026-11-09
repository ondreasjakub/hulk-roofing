const limits = {name: 100, email: 254, phone: 40, location: 100, message: 2000, website: 200};

function reply(message, status) {
  return Response.json({message}, {status, headers: {'Cache-Control': 'no-store'}});
}

export async function onRequestPost({request, env}) {
  const origin = new URL(request.url).origin;
  if (request.headers.get('origin') !== origin) return reply('Invalid origin.', 403);
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return reply('Expected JSON.', 415);
  }

  let data;
  try {
    const reader = request.body.getReader();
    const decoder = new TextDecoder();
    let bytes = 0;
    let body = '';
    for (;;) {
      const {value, done} = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > 16000) {
        await reader.cancel();
        return reply('Request too large.', 413);
      }
      body += decoder.decode(value, {stream: true});
    }
    data = JSON.parse(body + decoder.decode());
  } catch {
    return reply('Invalid request.', 400);
  }

  const fields = {};
  for (const [field, limit] of Object.entries(limits)) {
    const value = data?.[field] ?? '';
    if (typeof value !== 'string' || value.length > limit) return reply('Invalid fields.', 400);
    fields[field] = value.trim();
  }
  const {name, email, phone, location, message, website} = fields;
  if (!name || !location || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply('Check required fields.', 400);
  }

  if (env.CONTACT_MODE !== 'live' || !env.RESEND_API_KEY || !env.BUSINESS_EMAIL || !env.FROM_EMAIL) {
    return reply('Live delivery is unavailable.', 503);
  }
  if (website) return reply('Invalid submission.', 400);

  try {
    const result = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + env.RESEND_API_KEY, 'Content-Type': 'application/json'},
      signal: AbortSignal.timeout(10000),
      body: JSON.stringify({
        from: env.FROM_EMAIL,
        to: [env.BUSINESS_EMAIL],
        reply_to: email,
        subject: 'Hulk Roofing website enquiry',
        text: ['Name: ' + name, 'Email: ' + email, 'Phone: ' + (phone || '—'), 'Location: ' + location, '', message].join('\n'),
      }),
    });
    if (!result.ok) return reply('Delivery failed.', 502);
    return reply('Request sent.', 200);
  } catch {
    return reply('Delivery failed.', 502);
  }
}
