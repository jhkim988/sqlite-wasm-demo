import sqlite3InitModule from "@sqlite.org/sqlite-wasm";

let db;

const init = () => {
  sqlite3InitModule({
    print: console.log,
    printErr: console.error,
  }).then((sqlite3) => {
    try {
      db = new sqlite3.oo1.OpfsDb("/mydb.sqlite3");
      /* Data Insert */
      // db.exec([
      //   "CREATE TABLE student(id integer primary key, name text not null, email text unique);",
      //   "INSERT INTO student(name, email) values ('jhkim', 'my@gmail.com');",
      //   "INSERT INTO student(name, email) values ('john', 'stjh@gmail.com');",
      // ]);
    } catch (err) {
      console.error(err.name, err.message);
    }
  });
};

const select = (db) => {
  return db.selectObjects("SELECT * from student");
};

onmessage = ({ data }) => {
  console.log("Web Worker receive message", data);
  switch (data.type) {
    case "init": {
      init();
      break;
    }
    case "select": {
      postMessage(select(db));
      break;
    }
    default: {
      console.error(
        "Web Worker Error - Unsupported Operation Exception",
        data.type
      );
    }
  }
};
