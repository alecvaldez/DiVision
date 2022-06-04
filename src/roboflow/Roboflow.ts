const font = "16px Segoe UI";

interface RoboflowProps {
  videoRef: HTMLVideoElement;
  canvasRef: HTMLCanvasElement;
  loadingCallback: (bool: boolean) => void;
  streamStartedCallback: (bool: boolean) => void;
  predictionCallback: (num: number) => void;
}

class Roboflow {
  private videoRef: HTMLVideoElement | undefined;
  private canvasRef: HTMLCanvasElement | undefined;
  private model: any;
  private publishable_key: string | undefined;
  private ctx: CanvasRenderingContext2D | null | undefined;
  private loadingCallback: ((bool: boolean) => void) | undefined;
  private predictionCallback: ((num: number) => void) | undefined;
  private streamStartedCallback: ((bool: boolean) => void) | undefined;
  private primaryColor: string;

  private stopped: boolean | undefined;
  private stream: any;

  constructor(primaryColor: string) {
    this.primaryColor = primaryColor;
  }

  public initialize(props: RoboflowProps) {
    this.videoRef = props.videoRef;
    this.stopped = false;
    this.canvasRef = props.canvasRef;
    this.model = "d20---d6";
    this.ctx = this.canvasRef.getContext("2d");
    this.publishable_key = "rf_LX8il3vrbRdnPZvIwLpCQ6fYSIe2";

    this.loadingCallback = props.loadingCallback;
    this.streamStartedCallback = props.streamStartedCallback;
    this.predictionCallback = props.predictionCallback;

    const toLoad = {
      model: "d20---d6",
      version: 3,
    };

    const cameraMode = "environment";

    if (this.videoRef) {
      const startVideoStreamPromise = navigator.mediaDevices
        .getUserMedia({
          audio: false,
          video: {
            facingMode: cameraMode,
          },
        })
        .then((stream) => {
          this.stream = stream;
          return new Promise<void>((resolve) => {
            if (this.videoRef) {
              this.videoRef.srcObject = this.stream;
              this.videoRef.onloadeddata = () => {
                this.videoRef?.play();
                if (this.streamStartedCallback) {
                  this.streamStartedCallback(true);
                }
                resolve();
              };
            }
          });
        });

      const loadModelPromise = new Promise<void>((resolve, reject) => {
        roboflow
          .auth({
            publishable_key: this.publishable_key,
          })
          .load(toLoad)
          .then((m: any) => {
            this.model = m;
            resolve();
          });
      });

      Promise.all([startVideoStreamPromise, loadModelPromise]).then(() => {
        if (this.loadingCallback) this.loadingCallback(false);
        this.detectFrame();
      });
    }
  }

  public stop() {
    if (this.videoRef) {
      this.videoRef.pause();
      this.videoRef.srcObject = null;
    }
    this.stopped = true;
  }

  public start() {
    if (this.videoRef) {
      this.videoRef.play();
    }
    this.stopped = false;
  }

  public pause() {
    console.log(this.videoRef);
    if (this.videoRef) {
      this.videoRef.pause();
      this.stopped = true;
    }
  }

  private videoDimensions(videoRef: HTMLVideoElement) {
    // Ratio of the video's intrisic dimensions
    const videoRatio = videoRef.videoWidth / videoRef.videoHeight;

    // The width and height of the video element
    let width = videoRef.offsetWidth,
      height = videoRef.offsetHeight;

    // The ratio of the element's width to its height
    const elementRatio = width / height;

    // If the video element is short and wide
    if (elementRatio > videoRatio) {
      width = height * videoRatio;
    } else {
      // It must be tall and thin, or exactly equal to the original ratio
      height = width / videoRatio;
    }

    return {
      width: width,
      height: height,
    };
  }

  private renderPredictions(predictions: Array<any>) {
    const scale = 1;
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

      predictions.forEach((prediction) => {
        if (this.ctx) {
          const x = prediction.bbox.x;
          const y = prediction.bbox.y;

          const width = prediction.bbox.width;
          const height = prediction.bbox.height;
          // Draw the bounding box.
          this.ctx.strokeStyle = this.primaryColor;
          this.ctx.lineWidth = 1;

          this.ctx.strokeRect(
            (x - width) / 2 + 0.5,
            (y - height) / 2 + 0.5,
            width / scale,
            height / scale
          );

          //   // Draw the label background.
          //   this.ctx.fillStyle = prediction.color;
          //   const textWidth = this.ctx.measureText(prediction.class).width;
          //   const textHeight = parseInt(font, 10); // base 10
          //   this.ctx.fillRect(
          //     (x - width) / 2,
          //     (y - height) / 2,
          //     textWidth + 8,
          //     textHeight + 4
          //   );
        }
      });

      //   predictions.forEach((prediction) => {
      //     if (this.ctx) {
      //       const x = prediction.bbox.x;
      //       const y = prediction.bbox.y;

      //       const width = prediction.bbox.width;
      //       const height = prediction.bbox.height;

      //       // Draw the text last to ensure it's on top.
      //       this.ctx.font = "bold 8px Roboto";
      //       this.ctx.textBaseline = "top";
      //       this.ctx.fillStyle = "#000000";
      //       this.ctx.fillText(
      //         prediction.class,
      //         (x - width) / 2 + 4,
      //         (y - height) / 2 + 2
      //       );
      //     }
      //   });

      const prediction = predictions[0];
      if (
        prediction &&
        prediction.class &&
        prediction.confidence > 0.65 &&
        this.predictionCallback
      ) {
        this.predictionCallback(prediction.class);
      }
    }
  }

  private detectFrame(): any {
    if (!this.model) return requestAnimationFrame(this.detectFrame.bind(this));

    this.model
      .detect(this.videoRef)
      .then((predictions: Array<any>) => {
        setTimeout(() => {
          if (!this.stopped) {
            requestAnimationFrame(this.detectFrame.bind(this));
            this.renderPredictions(predictions);
          }
        }, 100);
      })
      .catch((error: any) => {
        setTimeout(() => {
          if (!this.stopped) {
            requestAnimationFrame(this.detectFrame.bind(this));
          }
        }, 100);
      });
  }
}

export default Roboflow;
