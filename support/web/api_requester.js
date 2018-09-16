require('isomorphic-fetch')

const api_requester = {}

api_requester.send = async (request) => {
  const info = {
    method: request.method,
    body: request.method === 'GET' ? undefined : JSON.stringify(request.payload),
    headers: {
      'Content-Type': 'application/json',
      'is-test': 'true',
    },
  }
  let responseText
  try {
    const res = await fetch(request.uri + '/' + request.path, info)
    responseText = await res.text()

    return Promise.resolve({
      ...JSON.parse(responseText)
    })
  } catch (err) {
    console.log(responseText, request.uri + '/' + request.path, info)
    throw err
  }
}

module.exports = api_requester
