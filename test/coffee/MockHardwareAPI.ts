import HardwareAPI from '../../src/coffee/HardwareAPI';

export type HardwareState = { 
  brewButton: number, 
  valve: number, 
  boiler: number, 
  warmerPlate: number,
  light: number
};

export default class MockHardwareAPI implements HardwareAPI {
  public state: HardwareState;
  
  constructor(initialState: HardwareState) {
    this.state = initialState;
  }
  
  getWarmerPlateStatus(): number { 
    return this.state.warmerPlate;
  }
  
  getBoilerStatus(): number {
    return this.state.boiler;
  }
  
  getBrewButtonStatus(): number { 
    return this.state.brewButton;
  }
  
  setBoilerState(state: number) {
    this.state.boiler = state;
  }
  
  setIndicatorLightState(state: number) {
    this.state.light = state;
  }
  
  setValveState(state: number) {
    this.state.valve = state
  }
}
