import {
  DEMO_ACTION,
} from './Types'

export function demoAct ({ params }) {

  return {
    type: DEMO_ACTION,
    params
  }
}
