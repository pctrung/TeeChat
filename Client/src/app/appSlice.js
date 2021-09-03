import { combineReducers, createSlice } from "@reduxjs/toolkit";

const isLoading = createSlice({
  name: "isLoading",
  initialState: true,
  reducers: {
    setIsLoading: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const isOpenPopup = createSlice({
  name: "isOpenPopup",
  initialState: false,
  reducers: {
    setIsOpenPopup: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
const popupContent = createSlice({
  name: "popupContent",
  initialState: "",
  reducers: {
    setPopupContent: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});
const popupTitle = createSlice({
  name: "popupTitle",
  initialState: "",
  reducers: {
    setPopupTitle: (state, action) => {
      state = action.payload;
      return state;
    },
  },
});

const reducer = combineReducers({
  isOpenPopup: isOpenPopup.reducer,
  isLoading: isLoading.reducer,
  popupContent: popupContent.reducer,
  popupTitle: popupTitle.reducer,
});

export const { setIsLoading } = isLoading.actions;
export const { setIsOpenPopup } = isOpenPopup.actions;
export const { setPopupContent } = popupContent.actions;
export const { setPopupTitle } = popupTitle.actions;
export default reducer;
