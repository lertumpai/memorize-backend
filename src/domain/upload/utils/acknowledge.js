import fetch from 'node-fetch'

export function acknowledge(image) {
  const url = `${process.env.SERVER_UPLOAD_URL}/upload/acknowledge`
  return fetch(url, {
    method: 'post',
    body: JSON.stringify(image),
    headers: { 'Content-Type': 'application/json' },
  })
}
