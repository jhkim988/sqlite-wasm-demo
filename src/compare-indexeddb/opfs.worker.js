import data from "./data.json";

/* data.json -> opfs save */
const save = async () => {
  const root = await navigator.storage.getDirectory();
  const dataHandle = await root.getFileHandle("data.json", { create: true });
  const accessHandle = await dataHandle.createSyncAccessHandle();

  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(JSON.stringify(data));
  accessHandle.write(encodedMessage, { at: 0 });
  accessHandle.flush();
  accessHandle.close();
};

/* opfs data.json -> read */
const read = async () => {
  const root = await navigator.storage.getDirectory();
  const dataHandle = await root.getFileHandle("data.json", { create: true });
  const accessHandle = await dataHandle.createSyncAccessHandle();

  const fileSize = accessHandle.getSize();
  const buffer = new DataView(new ArrayBuffer(fileSize));
  accessHandle.read(buffer, { at: 0 });

  const decoder = new TextDecoder("utf-8");
  const jsonString = decoder.decode(buffer);
  const json = JSON.parse(jsonString);
  accessHandle.flush();
  accessHandle.close();

  return json;
};

onmessage = async ({ data: action }) => {
  console.log("opfs.worker.js receive message: ", action);
  const startTime = new Date();
  switch (action.type) {
    case "save": {
      await save();
      break;
    }
    case "read": {
      postMessage(await read());
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
