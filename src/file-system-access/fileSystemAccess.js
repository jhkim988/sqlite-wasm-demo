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

/* file Access -> img tag -> save */
export function fileAccessToImgComponent() {
  const div = document.createElement("div");

  const upload = document.createElement("button");
  upload.innerHTML = "upload";

  div.appendChild(upload);
  upload.onclick = async (event) => {
    const file = await getFile();
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    div.appendChild(img);

    const ext = file.name.slice(file.name.lastIndexOf(".") + 1);
    /* image click -> save */
    img.onclick = async (event) => {
      saveFile(file, { suggestedName: `무제.${ext}` });
    };
  };

  return div;
}

// document.body.appendChild(fileAccessToImgComponent());

/* Directory Access */
async function directoryAccess() {
  const dirName = "node_modules";
  const opts = { writeable: true, mode: "read" }; // mode: read/readwrite
  const handle = await window.showDirectoryPicker(opts); // directoryHandle
  const subDir = handle.getDirectoryHandle(dirName, {
    create: true,
  });
  return subDir;
}

async function returnPathDirectories(directoryHandle) {
  const [handle] = await self.showOpenFilePicker();
  if (!handle) {
    // User cancelled, or fail
    return;
  }

  const relativePaths = await directoryHandle.resolve(handle);

  if (relativePaths === null) {
    console.log("Not inside directory handle");
  } else {
    for (const name of relativePaths) {
      console.log(name);
    }
  }
}

export function directoryAccessComponent() {
  const btn = document.createElement("button");
  btn.innerHTML = "directory access";
  btn.onclick = async (event) => {
    returnPathDirectories(await directoryAccess());
  };
  return btn;
}

// document.body.appendChild(directoryAccessComponent());

/* Write File */
async function saveFile(imgBlob, opts) {
  const newHandle = await window.showSaveFilePicker(opts);
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
