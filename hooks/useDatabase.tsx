import { db } from "@/db/drizzle";

export const useDatabase = () => {
  // return useContext(DatabaseContext);
  return { db };
};
