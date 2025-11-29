import { IAction } from '../../types/actions';
import { INotification } from '../../types/notifications';
import {
  RESET_NOTIFICATIONS,
  SET_NOTIFICATIONS,
} from '../actions/notifications';

interface INotificatationsReducer {
  notifications: INotification[];
  isLoading: boolean;
}

const initialState: INotificatationsReducer = {
  notifications: [],
  isLoading: false,
};

const userReducer = (
  state: INotificatationsReducer = initialState,
  action: IAction,
): INotificatationsReducer => {
  switch (action.type) {
    case SET_NOTIFICATIONS:
      if (action.payload) {
        return { ...state, notifications: action.payload };
      }
      return state;

    case RESET_NOTIFICATIONS:
      return initialState;

    case RESET_NOTIFICATIONS:
      return initialState;
    default:
      return state;
  }
};

export default userReducer;
