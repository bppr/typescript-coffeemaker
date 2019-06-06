// Coffee Maker!
//  - Brew Button
//  - Light
//  - Pressure Valve
//  - Pot
//  - Heater
//  - Warmer Plate / Sensor

// Brew Button is pushed. Heaters are turned on. Pressure valve is closed.
// Coffee Pot is pulled away. Pressure Valve is opened to stop flow of coffee.
// Coffee Pot is returned. Pressure valve is closed.
// Pot is full, brew indicator light is turned on. Pressure valve is opened. Warmer turned on. Heater turned off.
// Pot is empty. Brew indicator light turns off. Warmer turned off.

import CoffeeMaker from '../../src/coffee/CoffeeMaker';
import { IHardwareAdapter } from '../../src/coffee/HardwareAdapter';

type AdapterQueries = { wasStartRequested: boolean, isReadyToBrew: boolean, shouldPause: boolean, shouldStop: boolean };
function createAdapter(params: Partial<AdapterQueries>): IHardwareAdapter {
  const results = {
    wasStartRequested: false, 
    isReadyToBrew: false, 
    shouldPause: false, 
    shouldStop: false,
    ...params
  };

  const functionifiedParams = {
    wasStartRequested: () => results.wasStartRequested,
    isReadyToBrew: () => results.isReadyToBrew, 
    shouldPause: () => results.shouldPause, 
    shouldStop: () => results.shouldStop
  };

  return { 
    start: jest.fn(),
    stop: jest.fn(),
    pause: jest.fn(),
    ...functionifiedParams
  }
}

describe('CoffeeMaker', ()  => {
  it('starts brewing when start is requested and hardware is ready for brew', () => {
    const mockAdapter = createAdapter({ wasStartRequested: true, isReadyToBrew: true })
    const maker = new CoffeeMaker(mockAdapter);

    maker.nextTick();

    expect(mockAdapter.start).toBeCalled();
    expect(maker.isBrewing).toEqual(true);
  });

  it('does not brew when start is requested but hardware is not ready for brew', () => {
    const mockAdapter = createAdapter({ wasStartRequested: true, isReadyToBrew: false });
    const maker = new CoffeeMaker(mockAdapter);

    maker.nextTick();

    expect(mockAdapter.start).not.toBeCalled();
    expect(maker.isBrewing).toEqual(false);
  });

  it('does not brew when start is not requested', () => {
    const mockAdapter = createAdapter({ isReadyToBrew: true });
    const maker = new CoffeeMaker(mockAdapter);

    maker.nextTick();

    expect(mockAdapter.start).not.toBeCalled()
    expect(maker.isBrewing).toEqual(false);
  });

  it('stops brewing when shouldStop is true', () => {
    const mockAdapter = createAdapter({ shouldStop: true });
    const maker = new CoffeeMaker(mockAdapter, true);

    maker.nextTick();

    expect(mockAdapter.stop).toBeCalled();
  });
});