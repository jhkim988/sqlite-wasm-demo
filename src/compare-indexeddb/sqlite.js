const worker = new Worker(new URL("./sqlite.worker.js", import.meta.url));
worker.onmessage = ({ data }) => {
  console.log(data);
};

export const sqliteTest = () => {
  const div = document.createElement("div");

  const save = document.createElement("button");
  save.innerHTML = "save";
  save.onclick = (event) => {
    worker.postMessage({ type: "save" });
  };

  const read = document.createElement("button");
  read.innerHTML = "read";
  read.onclick = (event) => {
    worker.postMessage({ type: "read" });
  };

  div.appendChild(save);
  div.appendChild(read);
  div.appendChild(hasTableComponent());

  return div;
};

const hasTableComponent = () => {
  const hasTable = document.createElement("div");
  const hasTableInput = document.createElement("input");
  const hasTableBtn = document.createElement("button");
  hasTableBtn.innerHTML = "hasTable";
  hasTable.appendChild(hasTableInput);
  hasTable.appendChild(hasTableBtn);

  let inputText = "";
  hasTableInput.onchange = (event) => {
    inputText = event.target.value;
    hasTableInput.value = inputText;
  };
  hasTableBtn.onclick = () => {
    worker.postMessage({ type: "hasTable", table: inputText });
  };

  return hasTable;
};
