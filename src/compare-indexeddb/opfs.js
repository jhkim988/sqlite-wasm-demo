export const opfsTest = () => {
  const worker = new Worker(new URL("./opfs.worker.js", import.meta.url));
  worker.postMessage({ type: "save" });
  worker.onmessage = ({ data }) => {
    console.log(data);
  };

  const read = document.createElement("button");
  read.innerHTML = "read";
  read.onclick = (event) => {
    worker.postMessage({ type: "read" });
  };

  return read;
};
