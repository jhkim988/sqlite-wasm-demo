export function sqliteWasmComponent() {
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
