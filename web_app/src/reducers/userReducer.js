import {
  DEMO_ACTION,
} from '../actions/Types'

function user (state = {}, action) {

  switch (action.type) {

    case DEMO_ACTION :

      return {
        ...state,
        params: action.params,
      }
      
    default :
      return state
  }
}

export default user
