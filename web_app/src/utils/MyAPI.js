import { API_KEY } from './Settings'

const headers = {
  'Accept': 'application/json',
  'Authorization': API_KEY,
}

// getPythonMFCC
export const getPythonMFCC = (params) =>
  fetch(`http://127.0.0.1:5000/prediction_python_mfcc`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())

// getMeydaCliMFCC
export const getMeydaCliMFCC = (params) =>
  fetch(`http://127.0.0.1:5000/prediction_meyda_cli_mfcc`, {
    method: 'POST',
    headers: {
      ...headers,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify( params )
  }).then(res => res.json())
