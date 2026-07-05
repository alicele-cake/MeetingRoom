import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  menu: [],
  access: [],
};

export const MenuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuData: (state, action) => {
      state.menu = action.payload;
    },
    setLogout(state) {
      state.menu = initialState.menu;
    },
  },
});

// export action
export const { setMenuData, setLogout } = MenuSlice.actions;

// export reducer
export const MenuSliceReducer = MenuSlice.reducer;
