import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";

type JourneyError = {
  status: string;
  message: string;
};

export const journeyApi = createApi({
  reducerPath: "journeyApi",
  baseQuery: fakeBaseQuery<JourneyError>(),
  endpoints: () => ({}),
});
