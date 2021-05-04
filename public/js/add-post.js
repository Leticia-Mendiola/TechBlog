async function newFormHandler(event) {
  event.preventDefault();
  const post_title = document.querySelector('#post_title').value;
  const post_body = document.querySelector('#post_body').value;
  const username = req.session.username;

  const response = await fetch(`/`, {
    method: 'POST',
    body: JSON.stringify({
      post_title,
      username,
      post_body,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.ok) {
    document.location.replace('/');
  } else {
    alert('Failed to add post');
  }
}

document.querySelector('.new-dish-form').addEventListener('submit', newFormHandler);
  