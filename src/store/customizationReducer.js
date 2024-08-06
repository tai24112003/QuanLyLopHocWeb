// project imports
import config from 'config';

// action - state management
import * as actionTypes from './actions';

export const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: config.fontFamily,
  borderRadius: config.borderRadius,
  opened: true,
  listQuestion: [],
  editing: null,
  trigger: 1,
  exam: {
    code: '',
    subject_id: '',
    time: 60,
    name: '',
    count: 50,
    questions: []
  },
  user: {}
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action) => {
  let id;
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      id = action.id;
      return {
        ...state,
        isOpen: [id]
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened
      };
    case actionTypes.SET_FONT_FAMILY:
      return {
        ...state,
        fontFamily: action.fontFamily
      };
    case actionTypes.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius
      };
    case actionTypes.SET_LIST_QUESTION:
      return {
        ...state,
        listQuestion: action.listQuestion
      };
    case actionTypes.SET_OBJ_EDITING:
      return {
        ...state,
        editing: action.editing
      };
    case actionTypes.SET_COMMON_DATA:
      return {
        ...state,
        commonData: action.commonData
      };
    case actionTypes.SET_EXAM:
      return {
        ...state,
        exam: action.exam
      };
    case actionTypes.SET_USER:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

export default customizationReducer;
