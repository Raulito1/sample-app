import { configureStore } from "@reduxjs/toolkit";

import { journeyApi } from "./services/api";

export const store = configureStore({
  reducer: {
    [journeyApi.reducerPath]: journeyApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(journeyApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
