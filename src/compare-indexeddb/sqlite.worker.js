import sqlite3InitModule from "@sqlite.org/sqlite-wasm";
import data from "./data.json";

let db;

const init = () => {
  sqlite3InitModule({ print: console.log, printErr: console.error }).then(
    (sqlite3) => {
      try {
        db = new sqlite3.oo1.OpfsDb("/sample-data");
        initCreateTable();
      } catch (err) {
        console.error(err.name, err.message);
      }
    }
  );
};
init();

const hasTable = (table) => {
  return !!db.selectValue(
    `SELECT name FROM sqlite_master where type='table' and name='${table}'`
  );
};

const initCreateTable = () => {
  const config = {
    information:
      "CREATE TABLE information(store text primary key, lastUpdateDateTime datetime)",
    dgns: "CREATE TABLE dgns(dgns_cd text, stdy date, dgns_nm text, dgns_enm text, endy date, primary key(dgns_cd, stdy))",
    prsc: "CREATE TABLE prsc(prsc_cd text, prsc_nm text, ingr_nm text, suga_apdy date, suga_endy date, primary key(prsc_cd, suga_apdy))",
  };
  for (let table in config) {
    if (!hasTable(table)) {
      db.exec(config[table]);
    }
  }
};

const save = async () => {
  console.log(
    data.information
      .map((obj) => `(${obj.store}, ${obj.lastUpdateDateTime})`)
      .join(",")
  );
  const mutation = {
    information: `insert into information (store, lastUpdateDateTime) values ${data.information
      .map((obj) => `(${obj.store}, ${obj.lastUpdateDateTime})`)
      .join(",")}`,
    dgns: `insert into dgns (dgns_cd, stdy, dgns_nm, dgns_enm, endy) values ${data.dgns
      .map(
        (obj) =>
          `(${obj.dgns_cd}, ${obj.stdy}, ${obj.dgns_nm}, ${obj.dgns_enm}, ${obj.endy})`
      )
      .join(",")}`,
    prsc: `insert into prsc (prsc_cd, suga_apdy, prsc_nm, ingr_nm, suga_endy) values ${data.prsc.map(
      (obj) =>
        `(${obj.prsc_cd}, ${obj.suga_apdy}, ${obj.prsc_nm}, ${obj.ingr_nm}, ${obj.suga_endy})`
    )}`,
  };
  for (let table in mutation) {
    console.log("mutation", table, mutation[table]);
    db.exec(mutation[table]);
  }
};

/* opfs data.json -> read */
const read = async () => {
  const query = {
    information: `select * from information`,
    dgns: `select * from dgns`,
    prsc: `select * from prsc`,
  };

  const ret = {};
  for (let table in query) {
    ret[table] = db.selectObjects(query[table]);
  }

  return ret;
};

onmessage = async ({ data: action }) => {
  console.log("opfs.worker.js receive", action.type);
  const startTime = new Date();
  switch (action.type) {
    case "save": {
      await save();
      break;
    }
    case "read": {
      postMessage(read());
      break;
    }
    case "hasTable": {
      console.log(hasTable(action.table));
      break;
    }
    default: {
      console.log(
        "opfs.worker.js Error: Unsupported Operation Exception",
        action.type
      );
    }
  }
  const endTime = new Date();
  console.log("opfs.worker.js time", action.type, endTime - startTime);
};
