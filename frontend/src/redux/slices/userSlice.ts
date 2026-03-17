import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the shape of your user state
interface UserState {
  profile: any | null;
  loading: boolean;
}

const initialState: UserState = {
  profile: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Explicitly type 'state' and 'action'
    setUser: (state: UserState, action: PayloadAction<any>) => {
      state.profile = action.payload;
    },
    clearUser: (state: UserState) => {
      state.profile = null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;