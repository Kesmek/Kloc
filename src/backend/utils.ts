import Shift from 'src/backend/models/Shift';
import Employer from 'src/backend/models/Employer';
import { createRealmContext } from '@realm/react';

const realmConfig = {
  schema: [Employer, Shift],
  schemaVersion: 5,
};

export const { useObject, useQuery, useRealm, RealmProvider } = createRealmContext(realmConfig);
