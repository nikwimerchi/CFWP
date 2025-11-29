import axios from 'axios';
import { IAction } from '../../types/actions';
import { INotification } from '../../types/notifications';
import { BACKEND_URL } from '../../utils/constants';
import { setAuthHeaders } from '../../utils/helpers';
import { errorHandler } from '../../utils/toast';

export const SET_NOTIFICATIONS = 'SET_NOTIFICATIONS';
export const SET_IS_LOADING_NOTIFICATIONS = 'SET_IS_LOADING_NOTIFICATIONS';
export const RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS';

export const setIsLoadingNotifications = (bool: boolean): IAction => ({
  type: SET_IS_LOADING_NOTIFICATIONS,
  payload: bool,
});

export const setNotifications = (notifications: INotification[]): IAction => ({
  type: SET_NOTIFICATIONS,
  payload: notifications,
});

export const resetNotifications = () => ({ type: RESET_NOTIFICATIONS });

export const fetchNotifications = (): any => (dispatch: any, getState: any) => {
  const { user } = getState();
  dispatch(setIsLoadingNotifications(true));
  axios
    .get(BACKEND_URL + '/notifications', setAuthHeaders(user.user?.token))
    .then((res) => {
      dispatch(setIsLoadingNotifications(false));
      dispatch({
        type: SET_NOTIFICATIONS,
        payload: res.data.notifications,
      });
    })
    .catch((error) => {
      errorHandler(error);
      dispatch(setIsLoadingNotifications(false));
    });
};
