export default interface HardwareAPI {
  getWarmerPlateStatus(): number; // 0: pot is empty, 1: pot is full, 2: pot is not present
  getBoilerStatus(): number;      // boiler - 0: on / 1: off / 2: empty
  getBrewButtonStatus(): number;  // button was pushed (1) or not (0)
  
  setBoilerState(state: number): void;
  setIndicatorLightState(state: number): void;
  setValveState(state: number): void;
}

// MK II: tank/reservoir
// MK III: wall
// MK IV: vending machine / lattes
