import { IHardwareAdapter } from "./HardwareAdapter"

export interface CoffeeMaker {
  tick(): CoffeeMaker;
  isBrewing: boolean;
  isIdle: boolean;
  isPaused: boolean;
}

export class IdleCoffeeMaker implements CoffeeMaker {
  constructor(private hardware: IHardwareAdapter) {}
  
  get isBrewing() { return false }
  get isPaused() { return false }
  get isIdle() { return true }
  
  tick(): CoffeeMaker {   
    if (this.hardware.wasStartRequested() && this.hardware.isReadyToBrew())
      return new BrewingCoffeeMaker(this.hardware.start());
    
    return this; 
  }
}

export class BrewingCoffeeMaker implements CoffeeMaker {
  constructor(private hardware: IHardwareAdapter) {}
  
  get isBrewing() { return true; }
  get isIdle() { return false }
  get isPaused() { return false }
  
  tick(): CoffeeMaker {
    if(this.hardware.shouldStop())
      return new IdleCoffeeMaker(this.hardware.stop());

    if(this.hardware.shouldPause())
      return new PausedCoffeeMaker(this.hardware.pause());
    
    return this;
  }
}

export const DEFAULT_TIMEOUT = 30000;
export class PausedCoffeeMaker implements CoffeeMaker {
  
  constructor(
    private hardware: IHardwareAdapter, 
    readonly timeoutRemaining: number = DEFAULT_TIMEOUT) {}
  
  get isBrewing() { return false; }
  get isIdle() { return false; }
  get isPaused() { return true; }

  tick(): CoffeeMaker {
    if(this.timeoutRemaining <= 0)
      return new IdleCoffeeMaker(this.hardware);

    if(this.hardware.isReadyToBrew())
      return new BrewingCoffeeMaker(this.hardware.start());
    
    return new PausedCoffeeMaker(this.hardware, this.timeoutRemaining - 1);
  };
}