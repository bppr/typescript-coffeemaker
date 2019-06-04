export default interface HardwareAPI {
    getWarmerPlateStatus(): number; // coffee pot - there or not or full or not
    getBoilerStatus(): number;      // boiler - on/off/empty
    getBrewButtonStatus(): number;  // button was pushed or not

    setBoilerState(state: number): void;
    setIndicatorLightState(state: number): void;
    setValveState(state: number): void;
}

// [CoffeeMaker] -> [HardwareAdapter] <- [HardwareAPI]
// only mock what you own

// ISP
// the interface-segregation principle (ISP) states that no client 
// should be forced to depend on methods it does not use.[1] 
// ISP splits interfaces that are very large into smaller and more 
// specific ones so that clients will only have to know about the methods
// that are of interest to them. Such shrunken interfaces are also called role
// interfaces.[2] ISP is intended to keep a system decoupled and thus easier to refactor, 
// change, and redeploy

// MK II: tank/reservoir
// MK III: wall
// MK IV: vending machine / lattes
