import Dexie from "dexie";
import data from "./data.json";

/* use Dexie */
const db = new Dexie("sample-data");
db.version(1).stores({
  information: "[store]",
  dgns: "[dgns_cd+stdy]",
  prsc: "[prsc_cd+suga_apdy], prsc_cd",
});

export const indexedDBTest = async () => {
  const startTime = new Date();
  const promises = [];
  for (let store in data) {
    promises.push(db[store].bulkAdd(data[store]));
  }
  return Promise.all(promises).then(() => {
    const endTime = new Date();
    return endTime - startTime;
  });
};
