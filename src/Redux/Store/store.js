import { configureStore } from "@reduxjs/toolkit";
import CategoryReducer from "./CategorySlice";
import productReducer from "./productSlice";
import subcatSlice from "./subcatSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: {
    Category: CategoryReducer,
    Products: productReducer,
    subCategory: subcatSlice,
    Users: userSlice,
  },
});

export default store;
