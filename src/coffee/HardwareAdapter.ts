import HardwareAPI from "./HardwareAPI";

export interface IHardwareAdapter {
  start(): IHardwareAdapter
  stop(): IHardwareAdapter
  pause(): IHardwareAdapter
  wasStartRequested(): boolean
  isReadyToBrew(): boolean
  shouldStop(): boolean
  shouldPause(): boolean

  tick(): void
  onStartRequested(handler: StartHandler): void
}

export const START_WAS_NOT_REQUESTED = 0;
export const START_WAS_REQUESTED = 1;
export const RECEPTACLE_IS_NOT_PRESENT = 2;
export const RECEPTACLE_IS_FULL = 1;
export const RECEPTACLE_IS_NOT_FULL = 0;
export const VALVE_OPEN = 1;
export const VALVE_CLOSED = 0;
export const BOILER_EMPTY = 2;
export const BOILER_ON = 1;
export const BOILER_OFF = 0;
export const LIGHT_ON = 1;
export const LIGHT_OFF = 0;

type StartHandler = () => void;

export default class HardwareAdapter implements IHardwareAdapter {
  onStartRequestedHandlers: StartHandler[]
  
  constructor(private api: HardwareAPI) {
    this.onStartRequestedHandlers = [];
  }

  start() {
    this.api.setBoilerState(BOILER_ON);
    this.api.setValveState(VALVE_CLOSED);

    return this;
  }

  pause() {
    this.api.setValveState(VALVE_OPEN);

    return this;
  }

  stop() {
    this.api.setBoilerState(BOILER_OFF);
    this.api.setValveState(VALVE_OPEN);
    
    return this;
  }

  wasStartRequested() {
    return this.api.getBrewButtonStatus() === START_WAS_REQUESTED;
  }

  isReadyToBrew() {
    const warmerStatus = this.api.getWarmerPlateStatus(),
      boilerStatus = this.api.getBoilerStatus();

    return !(warmerStatus === RECEPTACLE_IS_NOT_PRESENT 
      || warmerStatus === RECEPTACLE_IS_FULL 
      || boilerStatus === BOILER_EMPTY);
  }

  shouldPause(): boolean {
    return this.api.getWarmerPlateStatus() === RECEPTACLE_IS_NOT_PRESENT 
  }

  shouldStop(): boolean {
    return this.api.getWarmerPlateStatus() === RECEPTACLE_IS_FULL 
      || this.api.getBoilerStatus() === BOILER_EMPTY;
  }

  onStartRequested(handler: StartHandler): void {
    this.onStartRequestedHandlers.push(handler);
  }

  tick() {
    if(this.wasStartRequested) {
      this.onStartRequestedHandlers.forEach(handler => handler());
    }
  }

}