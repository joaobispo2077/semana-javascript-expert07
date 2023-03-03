onmessage = ({ data }) => {
  console.log('wroker', data)

  postMessage({ ok: 'ok' })
}