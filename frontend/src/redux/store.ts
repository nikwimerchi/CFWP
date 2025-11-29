import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { REDUX_KEY } from '../utils/constants';

const persistConfig = {
  key: REDUX_KEY,
  storage,
  devTools: true,
};

// @ts-ignore
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = createStore(persistedReducer, applyMiddleware(thunk));
// @ts-ignore
export const persistor = persistStore(store);
