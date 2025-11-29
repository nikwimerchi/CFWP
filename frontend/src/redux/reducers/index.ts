import { combineReducers } from 'redux';
import user from './user';
import notificationsReducer from './notifications';
const rootReducer = combineReducers({
  user,
  notificationsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
