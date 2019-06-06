import { IHardwareAdapter } from './HardwareAdapter';

const BREW_PAUSE_TIMEOUT = 60 * 1000

export default class CoffeeMaker {
  isBrewing: boolean;
  brewingTimeoutRemaining: number | undefined;
  
  constructor(private hardware: IHardwareAdapter, isBrewing: boolean = false) {
    this.isBrewing = isBrewing;

    this.hardware.onStartRequested(this.startBrew.bind(this));
    this.hardware.onPauseRequested(() => {
      this.pauseBrew();
    })
  }

  startBrew() {
    if(this.hardware.isReadyToBrew()) {
      this.hardware.start();
      this.isBrewing = true;
    }
  }

  pauseBrew() {
    this.hardware.pause();
    this.brewingTimeoutRemaining = BREW_PAUSE_TIMEOUT;
  }

  nextTick() {
   this.hardware.tick();
  }
}