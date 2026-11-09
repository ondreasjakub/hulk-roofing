import {onRequestPost} from './functions/api/contact.js';

export default {
  fetch(request, env) {
    if (new URL(request.url).pathname !== '/api/contact') {
      return env.ASSETS.fetch(request);
    }
    if (request.method !== 'POST') {
      return Response.json({message: 'Method not allowed.'}, {
        status: 405,
        headers: {Allow: 'POST', 'Cache-Control': 'no-store'},
      });
    }
    return onRequestPost({request, env});
  },
};
