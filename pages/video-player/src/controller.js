export default class Controller {
  #view
  #service
  #worker

  constructor({ view, service, worker }) {
    this.#view = view
    this.#service = service
    this.#worker = this.#configureWorker(worker)

    this.#view.configureOnBtnClick(this.onBtnStart.bind(this))
  }

  static async initialize(deps) {
    const controller = new Controller(deps)
    controller.log('Not yet detecting eye blink! click in the button to start')
    return controller.init()
  }

  #configureWorker(worker) {
    worker.onmessage = (msg) => {
      console.log("recebi", msg)

      if (msg.data === "READY") {
        this.#view.enableButton()
        return;
      }
    }

    return worker
  }

  async init() {
    console.log('Controller initialized')
  }

  log(text) {
    this.#view.log(`log: ${text}`)
  }

  onBtnStart() {
    this.log('initializing detection...')
  }
}