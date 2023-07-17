onmessage = async ({ data: action }) => {
  console.log("opfs.worker.js receive message: ", action);
  switch (action.type) {
    case "save": {
      save(action.message);
      break;
    }
    case "read": {
      read();
      break;
    }
    default: {
      console.log(
        "opfs.worker.js Error: Unsupported Operation Exception",
        action.type
      );
    }
  }
};

const save = async (message) => {
  /* Get handle to draft file in OPFS */
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("draft.txt", { create: true });
  const accessHandle = await draftHandle.createSyncAccessHandle();

  /* Read file content to a buffer */
  const fileSize = accessHandle.getSize();
  const buffer = new DataView(new ArrayBuffer(fileSize));
  const readBuffer = accessHandle.read(buffer, { at: 0 });

  /* Write the message to the end of the file */
  const encoder = new TextEncoder();
  const encodedMessage = encoder.encode(message);
  const writerBufer = accessHandle.write(encodedMessage, { at: readBuffer });

  accessHandle.flush();
  accessHandle.close();
};

const read = async () => {
  const root = await navigator.storage.getDirectory();
  const draftHandle = await root.getFileHandle("draft.txt", { create: true });
  const accessHandle = await draftHandle.createSyncAccessHandle();

  const fileSize = accessHandle.getSize();
  const buffer = new DataView(new ArrayBuffer(fileSize));
  const readBuffer = accessHandle.read(buffer, { at: 0 });

  let message = "";
  for (let i = 0; i < buffer.byteLength; i++) {
    message += String.fromCharCode(buffer.getUint8(i));
  }
  postMessage({ type: "read", message });
  accessHandle.flush();
  accessHandle.close();
};
