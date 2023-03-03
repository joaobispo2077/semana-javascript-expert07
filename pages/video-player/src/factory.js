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

  console.warn(`Your browser doesn't support es modules on workers!`)
  console.warn(`Importing libraries...`)

  await import("https://unpkg.com/@tensorflow/tfjs-core@2.4.0/dist/tf-core.js")
  await import("https://unpkg.com/@tensorflow/tfjs-converter@2.4.0/dist/tf-converter.js")
  await import("https://unpkg.com/@tensorflow/tfjs-backend-webgl@2.4.0/dist/tf-backend-webgl.js")
  await import("https://unpkg.com/@tensorflow-models/face-landmarks-detection@0.0.1/dist/face-landmarks-detection.js")

  console.warn(`Using worker mock instead!`)
  const service = new Service({ faceLandmarksDetection: window.faceLandmarksDetection })

  const workerMock = {
    onmessage: (data) => {
      // will be overriden
      console.log('workerMock', data)
    },
    postMessage: async (video) => {
      const blinked = await service.handBlinked(video)
      if (!blinked) {
        return;
      }

      workerMock.onmessage({ data: { blinked } })
    }
  }
  console.log('loading tf model...')
  await service.loadModel()
  console.log('tf model loaded')

  setTimeout(() => {
    workerMock.onmessage({ data: "READY" })
  }, 1000)
  console.log("Worker type not supported")
  return workerMock
}

const worker = await getWorker()
const camera = await Camera.init()
const [rootPath] = window.location.href.split('/pages/')

const factory = {
  async initialize() {
    return Controller.initialize({
      view: new View(),
      worker,
      camera,
    })
  }
}

export default factory