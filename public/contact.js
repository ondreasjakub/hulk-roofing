const form = document.querySelector('form');
const button = form.querySelector('button');
const status = document.querySelector('#status');
const preview = document.body.dataset.preview === 'true';

if (!preview) button.textContent = 'Send estimate request ↗';
button.disabled = false;

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (preview) {
    status.textContent = 'Test complete. No email was sent.';
    return;
  }

  button.disabled = true;
  status.textContent = 'Sending your request…';
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(Object.fromEntries(new FormData(form))),
    });
    if (!response.ok) throw new Error('Submission failed');
    form.reset();
    status.textContent = 'Your request was sent.';
  } catch {
    status.textContent = 'We couldn’t send your request. Please try again or call us.';
  } finally {
    button.disabled = false;
  }
});
