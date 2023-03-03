export default class Controller {
  #view
  #worker
  #camera
  #blinkCounter = 0
  constructor({ view, worker, camera }) {
    this.#view = view
    this.#camera = camera
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('Not yet detecting eye blink! click in the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    let isReady = false;

    worker.onmessage = ({ data }) => {

      if (data === "READY") {
        console.log("worker ready")
        this.#view.enableButton()
        isReady = true;
        return;
      }
      const blinked = data.blinked
      this.#blinkCounter += blinked
      console.log("blinked", blinked)
    }

    return {
      send(msg) {
        if (!isReady) {
          return;
        }
        worker.postMessage(msg)
      }
    }
  }

  async init() {
    console.log('Controller initialized')
  }

  loop() {
    const video = this.#camera.video
    const img = this.#view.getVideoFrame(video)
    this.#worker.send(img)
    this.log(`detecting eye blink... ${this.#blinkCounter}`)

    setTimeout(this.loop.bind(this), 100)
  }

  log(text) {
    this.#view.log(`log: ${text}`)
  }

  onBtnStart() {
    this.log('initializing detection...')
    this.#blinkCounter = 0
    this.loop()
  }
}