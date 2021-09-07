import { combineReducers, createSlice } from "@reduxjs/toolkit";

const isLoading = createSlice({
  name: "isLoading",
  initialState: false,
  reducers: {
    setIsLoading: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const popup = createSlice({
  name: "popup",
  initialState: {
    isOpen: false,
    content: "",
    title: "Notification",
  },
  reducers: {
    setPopup: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const reducer = combineReducers({
  isLoading: isLoading.reducer,
  popup: popup.reducer,
});

export const { setIsLoading } = isLoading.actions;
export const { setPopup } = popup.actions;
export default reducer;
