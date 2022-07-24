import Shift from "../backend/models/Shift";
import Employer from "../backend/models/Employer";
import { createRealmContext } from "@realm/react";

const realmConfig = {
  schema: [Employer, Shift],
  schemaVersion: 6,
};

export const {
  useObject, useQuery, useRealm, RealmProvider,
} = createRealmContext(realmConfig);
