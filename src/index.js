import { Opfscomponent } from "./opfs/opfs-component";
import { sqliteWasmComponent } from "./sqlite-wasm/sqlite-wasm-component";
import {
  fileAccessToImgComponent,
  directoryAccessComponent,
} from "./file-system-access/fileSystemAccess";
import { indexedDBTest } from "./compare-indexeddb/indexedDB";
import { opfsTest } from "./compare-indexeddb/opfs";
import { sqliteTest } from "./compare-indexeddb/sqlite";
/*
document.body.appendChild(Opfscomponent());
document.body.appendChild(sqliteWasmComponent());
document.body.appendChild(fileAccessToImgComponent());
document.body.appendChild(directoryAccessComponent());
indexedDBTest().then((time) => {
  console.log("indexeddb test time", time);
});
document.body.appendChild(opfsTest());
*/
document.body.appendChild(sqliteTest());
