/* sqlite-wasm component */
/*
function component() {
  const worker = new Worker(new URL("./worker.js", import.meta.url), {
    type: "module",
  });

  worker.postMessage({ type: "init" });

  const btn = document.createElement("button");
  btn.innerHTML = "button";
  btn.onclick = (event) => {
    console.log("button click");
    worker.postMessage({ type: "select" });
  };

  const div = document.createElement("div");
  div.appendChild(btn);

  worker.onmessage = ({ data }) => {
    console.log("index.js message receive", div.innerHTML);
    data.forEach((rowData) => {
      const row = document.createElement("div");
      row.innerHTML = `${rowData.name} ${rowData.email}`;
      div.appendChild(row);
    });
  };

  return div;
}
document.body.appendChild(component());
*/

/* opfs worker */
function component() {
  const worker = new Worker(new URL("./opfs.worker.js", import.meta.url), {
    type: "module",
  });

  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = "save";
  saveBtn.onclick = (event) => {
    worker.postMessage({ type: "save", message: "HERE~" });
  };

  const readBtn = document.createElement("button");
  readBtn.innerHTML = "read";
  readBtn.onclick = (event) => {
    worker.postMessage({ type: "read" });
  };

  const div = document.createElement("div");
  div.appendChild(saveBtn);
  div.appendChild(readBtn);

  worker.onmessage = ({ data: action }) => {
    console.log("index.js receive message: ", action);
    switch (action.type) {
      case "read": {
        const p = document.createElement("p");
        p.innerHTML = action.message;
        div.appendChild(p);
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

  return div;
}
document.body.appendChild(component());
