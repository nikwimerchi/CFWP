import { createStore, applyMiddleware, Store, AnyAction } from 'redux';
import { thunk } from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import rootReducer from './reducers';
import { REDUX_KEY } from '../utils/constants';

// Explicitly define the State type
export type RootState = ReturnType<typeof rootReducer>;

const persistConfig = {
  key: REDUX_KEY,
  storage,
  whitelist: ['user'], 
};

// We use AnyAction to bridge your custom IAction with Redux's internal expectations
const persistedReducer = persistReducer<RootState, AnyAction>(persistConfig, rootReducer);

export const store: Store<RootState, AnyAction> = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

export const persistor = persistStore(store);

// Default export is required for the import in main.tsx
export default store;