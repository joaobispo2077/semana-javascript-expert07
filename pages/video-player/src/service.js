export default class Service {
  #model = null
  #faceLandmarksDetection
  constructor({ faceLandmarksDetection }) {
    this.#faceLandmarksDetection = faceLandmarksDetection
  }

  async loadModel() {
    this.#model = await this.#faceLandmarksDetection.load(
      faceLandmarksDetection.SupportedPackages.mediapipeFacemesh,
      { maxFaces: 1 }
    )
  }

  async handBlinked(video) {
    const prections = await this.#estimateFaces(video)
    console.log({ prections })
  }

  #estimateFaces(video) {
    return this.#model.estimateFaces({
      input: video,
      returnTensors: false,
      flipHorizontal: true,
      predictIrises: true
    })
  }
}