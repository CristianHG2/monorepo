import client from './client';
import {
  PageObjectResponse,
  PeoplePropertyItemObjectResponse,
  PersonUserObjectResponse,
} from '@notionhq/client/build/src/api-endpoints';

export const getUsers = () => client.users.list({});

export const getDatabase = (databaseId: string) =>
  client.databases.query({database_id: databaseId}) as unknown as Promise<{
    results: PageObjectResponse[];
  }>;

export const getSprints = async () => {
  return (await getDatabase('cc9e6b9086bd47b9b629ad55f97db823')).results.map(
    sprint => {
      return {
        name: (sprint.properties.Name as {title: {plain_text: string}[]})
          .title[0].plain_text,
        id: sprint.id,
      };
    },
  );
};

export const isDeveloper = (person: PersonUserObjectResponse) =>
  [
    'camilo@lifespikes.com',
    'cristian@lifespikes.com',
    'guerrero.santiago@correounivalle.edu.co',
    'amilkar0711@gmail.com',
    'cdvillada6@misena.edu.co',
    'juan.valencia.ramirez@correounivalle.edu.co',
    'kevin@ocmiwc.com',
    'raimir@ocmiwc.com',
    'jstorres0211@gmail.com',
  ].includes(person.person.email ?? '');

export const getAssignments = async (sprint: string) => {
  const assignees: Record<string, {name: string; tasks: number}> = {};

  (await getUsers()).results.forEach(user => {
    if (user.type !== 'person' || !isDeveloper(user)) {
      return;
    }

    assignees[user.id] = {
      name: user.name ?? '',
      tasks: 0,
    };
  });

  const databases = await client.databases.query({
    database_id: 'ffd4397865a94d0786ad63ab724344bc',
    filter: {
      property: '☄️ Sprint',
      type: 'relation',
      relation: {
        contains: sprint,
      },
    },
  });

  databases.results.forEach(r => {
    if (r.hasOwnProperty('properties')) {
      const result = r as PageObjectResponse;

      const assignee = result.properties.Assignee as unknown as {
        people: PersonUserObjectResponse[];
      };

      assignee.people.forEach(p => {
        if (assignees.hasOwnProperty(p.id)) {
          assignees[p.id].tasks++;
        }
      });
    }
  });

  return Object.values(assignees);
};
