/* file system access api */
/* File Access */
async function getFile() {
  const pickerOpts = {
    types: [
      {
        description: "Images",
        accept: {
          "image/*": [".png", ".gif", ".jpeg", ".jpg"],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const file = await fileHandle.getFile();
  return file;
}

function fileSystemAPIComponent() {
  const btn = document.createElement("button");
  btn.innerHTML = "click";

  const div = document.createElement("div");
  div.appendChild(btn);

  btn.onclick = async (event) => {
    const file = await getFile();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    div.appendChild(img);
  };

  return div;
}

document.body.appendChild(fileSystemAPIComponent());

/* Directory Access */
async function directoryAccess() {
  const dirName = "directoryToGetName";
  const opts = { writeable: true, mode: "sandbox" };
  const handle = await window.showDirectoryPicker(opts);
  const subDir = handle.getDirectoryHandle(dirName, {
    create: true,
  });

  for await (const entry of subDir.values()) {
    console.log(entry.name);
  }
}

async function returnPathDirectories(directoryHandle) {
  const [handle] = await self.showOpenFilePicker();
  if (!handle) {
    // User cancelled, or fail
    return;
  }

  const relativePaths = await directoryHandle.resolve(handle);

  if (relativePaths === null) {
    // Not inside directory handle
  } else {
    for (const name of relativePaths) {
      console.log(name);
    }
  }
}

/* Write File */
async function saveFile(imgBlob) {
  const newHandle = await window.showSsaveFilePicker();
  const writableStream = await newHandle.createWritable();
  /**
   * write options:
   * { type: "write", position, data }
   * { type: "seek", position }
   * { type: "truncate", size }
   */
  await writableStream.write(imgBlob);
  await writableStream.close();
}
