import makeClient from './client';
import {Wrappers} from '@userscripters/stackexchange-api-types';
import {
  Question,
  Answer,
} from '@userscripters/stackexchange-api-types/lib/types';

type Query<T extends string = string> = {
  [key in T]?: string;
};

export const request = async <T extends object>(
  endpoint: string,
  params?: Query,
): Promise<Wrappers.CommonWrapperObject<T>> => {
  const client = await makeClient();
  return (await client.get(endpoint, {params})).data;
};

export const getQuestions = async (
  query?: Query<'tagged' | 'max' | 'sort'>,
) => {
  const questions = await request<Question>('questions', {
    order: 'desc',
    sort: 'activity',
    filter: 'withbody',
  });
  return questions.items;
};

export const searchQuestions = async (
  query?: Query<'q' | 'accepted' | 'answers'>,
) => {
  const questions = await request<Question>('search/advanced', query);
  return questions.items;
};

// unfortunately stack exchange has an awful API
export const getAnswers = async (
  query?: Query<'question_id' | 'max' | 'sort'>,
) => {
  const answers = await request<Answer>('answers', {
    order: 'desc',
    sort: 'activity',
  });

  return answers.items;
};
