import { IHardwareAdapter } from './HardwareAdapter';

type CoffeeMaker {
  nextTick(): CoffeeMaker
  & { isPaused: true, brewingTimeoutRemaining: number }
  & { isBrewing: true, hardwareObservable: Observable<HardwareAPI> }
}

const BREW_PAUSE_TIMEOUT = 60 * 1000

export default class CoffeeMaker {
  isBrewing: boolean;
  brewingTimeoutRemaining: number | undefined;
  
  constructor(private hardware: IHardwareAdapter, isBrewing: boolean = false) {
    this.isBrewing = isBrewing;
  }
  
  nextTick() {
    // are we paused?
    if (this.brewingTimeoutRemaining !== undefined && this.brewingTimeoutRemaining > 0) {
      if (this.hardware.isReadyToBrew) {
        this.hardware.start();
        this.brewingTimeoutRemaining = undefined;
        return
      }

      this.brewingTimeoutRemaining -= 1;
      return
    }
    
    if (this.brewingTimeoutRemaining === 0) {
      this.hardware.stop();
      this.isBrewing = false;
      this.brewingTimeoutRemaining = undefined;
      return
    }

    // are we brewing
    if (this.isBrewing) {
      if (this.hardware.shouldStop()) {
        this.hardware.stop();
        this.isBrewing = false;
        return
      }

      if (this.hardware.shouldPause()) {
        this.hardware.pause();
        this.brewingTimeoutRemaining = BREW_PAUSE_TIMEOUT;
        return
      }
    } else {
      // otherwise we do this loop for button query
      if(this.hardware.wasStartRequested() && this.hardware.isReadyToBrew()) {
        this.hardware.start();
        this.isBrewing = true;
      }
    }
  }
}