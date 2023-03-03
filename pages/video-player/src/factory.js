import Camera from "../../shared/lib/camera.js";
import { supportsWorkerType } from "../../shared/lib/util.js";
import Controller from "./controller.js";
import Service from "./service.js";
import View from "./view.js";

async function getWorker() {
  if (supportsWorkerType()) {
    console.log("Worker type supported")
    const worker = new Worker('./src/worker.js', { type: 'module' })
    return worker;
  }

  const workerMock = {
    postMessage: (data) => {
      console.log('workerMock', data)
    },
    onmessage: (data) => {
      console.log('workerMock', data)
    }
  }

  console.log("Worker type not supported")
  return workerMock
}

const worker = await getWorker()
const camera = await Camera.init()
const [rootPath] = window.location.href.split('/pages/')

const factory = {
  async initialize() {
    return Controller.initialize({
      service: new Service({}),
      view: new View(),
      worker
    })
  }
}

export default factory