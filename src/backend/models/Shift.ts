import { Realm } from "@realm/react";

class Shift extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  start!: Date;
  end?: Date;
  year!: number;
  month!: number;
  edited!: boolean;
  notes?: string;

  static generate(
    notes?: string,
    end?: Date,
  ) {
    const now = new Date();
    return {
      _id: new Realm.BSON.ObjectId(),
      start: now,
      end,
      year: now.getFullYear(),
      month: now.getMonth(),
      edited: false,
      notes,
    };
  }

  static schema = {
    name: "Shift",
    primaryKey: "_id",
    properties: {
      "_id": "objectId",
      "start": "date",
      "end": "date?",
      "year": "int",
      "month": "int",
      "edited": "bool",
      "notes": "string?",
    },
  };
}

export default Shift;
