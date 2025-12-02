import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { Journey } from '../../types';
import { generateJourney } from './geminiService';

type JourneyError = {
  status: string;
  message: string;
};

export const journeyApi = createApi({
  reducerPath: 'journeyApi',
  baseQuery: fakeBaseQuery<JourneyError>(),
  endpoints: (builder) => ({
    generateJourney: builder.mutation<Journey, string>({
      async queryFn(topic) {
        try {
          const data = await generateJourney(topic);
          return { data };
        } catch (error) {
          const message = error instanceof Error ? error.message : 'Unknown error';
          return { error: { status: 'GEN_AI_ERROR', message } };
        }
      },
    }),
  }),
});

export const { useGenerateJourneyMutation } = journeyApi;
