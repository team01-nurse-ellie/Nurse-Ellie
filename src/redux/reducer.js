export const ADD_DRUG = 'ADD_DRUG'

export const addItem = drugDoc => ({
  type: ADD_DRUG,
  payload: drugDoc
});

const initialState = {
    drugDoc: 'no doc id'
}

const rootReducer = (state = initialState, action) => {
      switch (action.type) {
        case ADD_DRUG:
          return {
            drugDoc: action.payload
          }
        default:
          return state
      }
    }
export default rootReducer