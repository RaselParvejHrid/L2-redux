import { configureStore } from "@reduxjs/toolkit";
import { libraryAPI } from "./features/api/apiSlice/apiSlice";

export const store = configureStore({
  reducer: {
    [libraryAPI.reducerPath]: libraryAPI.reducer, // Add libraryAPI reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(libraryAPI.middleware), // Add RTK Query middleware
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
