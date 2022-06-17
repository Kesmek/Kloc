import { Realm } from '@realm/react';

class Employer extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  name!: string;
  description?: string;

  static generate(name: string, description?: string) {
    return {
      _id: new Realm.BSON.ObjectId(),
      name,
      description,
      years: [],
    };
  }

  static schema = {
    name: 'Employer',
    primaryKey: '_id',
    properties: {
      '_id': 'objectId',
      'name': 'string',
      'description': 'string?',
    },
  };
}

export default Employer;
