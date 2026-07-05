import { configureStore } from "@reduxjs/toolkit";
import { MenuSliceReducer } from "./slice/Menu";

export const store = configureStore({
  reducer: {
    menu: MenuSliceReducer,
  },
});
