import { IAction } from '../../types/actions';
import { IUser } from '../../types/user';
import { RESET_USER, SET_USER } from '../actions/user';

interface IUserReducer {
  user: IUser | undefined;
}

const initialState: IUserReducer = {
  user: undefined,
};

const userReducer = (
  state: IUserReducer = initialState,
  action: IAction,
): IUserReducer => {
  switch (action.type) {
    case SET_USER:
      // Check if the payload is defined and of the correct type
      if (action.payload && typeof action.payload === 'object') {
        return { ...state, user: action.payload as IUser };
      } else {
        // Keep the state unchanged if payload is undefined or not of the correct type
        return state;
      }
    case RESET_USER:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
