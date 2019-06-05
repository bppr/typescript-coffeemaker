export default interface HardwareAPI {
    getWarmerPlateStatus(): number; // coffee pot - there or not or full or not
    getBoilerStatus(): number;      // boiler - on/off/empty
    getBrewButtonStatus(): number;  // button was pushed or not

    setBoilerState(state: number): void;
    setIndicatorLightState(state: number): void;
    setValveState(state: number): void;
}

// MK II: tank/reservoir
// MK III: wall
// MK IV: vending machine / lattes
