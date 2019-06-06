import HardwareAdapter, * as Hardware from '../../src/coffee/HardwareAdapter';
import MockHardwareAPI, { HardwareState } from './MockHardwareAPI';

function createMockHardware(state: Partial<HardwareState> = {}): MockHardwareAPI {
  const defaultState = { 
    brewButton: Hardware.START_WAS_NOT_REQUESTED, 
    valve: Hardware.VALVE_OPEN, 
    warmerPlate: Hardware.RECEPTACLE_IS_NOT_FULL, 
    boiler: Hardware.BOILER_OFF, 
    light: Hardware.LIGHT_OFF
  };
  
  return new MockHardwareAPI({ ...defaultState, ...state });
}

describe('HardwareAdapter', () => {
  describe('start', () => {
    it('start() starts a brew process', () => {
      const api = createMockHardware();
      const adapter = new HardwareAdapter(api);
      
      adapter.start();
      
      expect(api.state.boiler).toEqual(Hardware.BOILER_ON);
      expect(api.state.valve).toEqual(Hardware.VALVE_CLOSED);
    });
  });

  describe('stop', () => {
    it('stop turns off the boiler and opens the valve', () => {
      const api = createMockHardware({ boiler: Hardware.BOILER_ON, valve: Hardware.VALVE_CLOSED });
      const adapter = new HardwareAdapter(api);
      
      adapter.stop();
      
      expect(api.state.boiler).toEqual(Hardware.BOILER_OFF);
      expect(api.state.valve).toEqual(Hardware.VALVE_OPEN);
    });
  });

  describe('wasStartRequested', () => {
    it('is true when the brew button was pressed', () => {
      const api = createMockHardware({ brewButton:  Hardware.START_WAS_REQUESTED});
      const adapter = new HardwareAdapter(api);

      const result = adapter.wasStartRequested();  

      expect(result).toEqual(true);
    });

    it('is false when the brew button was not pressed', () => {
      const api = createMockHardware({ brewButton: Hardware.START_WAS_NOT_REQUESTED });
      const adapter = new HardwareAdapter(api);

      const result = adapter.wasStartRequested();  

      expect(result).toEqual(false);
    });
  });

  describe('isReadyToBrew', () => {
    it('is false if the warmer plate does not detect receptacle', () => {
      const api = createMockHardware({ warmerPlate: Hardware.RECEPTACLE_IS_NOT_PRESENT });
      const adapter = new HardwareAdapter(api);

      const result = adapter.isReadyToBrew();

      expect(result).toEqual(false);
    });

    it('is false if the warmer plate detects an already-full receptacle', () => {
      const api = createMockHardware({ warmerPlate: Hardware.RECEPTACLE_IS_FULL });
      const adapter = new HardwareAdapter(api);

      const result = adapter.isReadyToBrew();

      expect(result).toEqual(false);
    });

    it('is false if the boiler sensor does not detect water supply', () => {
      const api = createMockHardware({ boiler: Hardware.BOILER_EMPTY });
      const adapter = new HardwareAdapter(api);

      const result = adapter.isReadyToBrew();

      expect(result).toEqual(false);
    });

    it('is true if receptacle is present+empty and reservoir is not empty', () => {
      const api = createMockHardware({ warmerPlate: Hardware.RECEPTACLE_IS_NOT_FULL, boiler: Hardware.BOILER_OFF });
      const adapter = new HardwareAdapter(api);

      const result = adapter.isReadyToBrew();

      expect(result).toEqual(true);
    });
  });

  describe('shouldPause', () => {
    it('returns true when the pot is removed.',() => {
      const api = createMockHardware({ warmerPlate: Hardware.RECEPTACLE_IS_NOT_PRESENT });
      const adapter = new HardwareAdapter(api);
      
      const result = adapter.shouldPause();

      expect(result).toEqual(true);
    });
  });


  describe('shouldStop', () => {
    it('is true when the pot is full.', () =>{
      const api = createMockHardware({
        warmerPlate: Hardware.RECEPTACLE_IS_FULL, 
        boiler: Hardware.BOILER_ON, 
        valve: Hardware.VALVE_CLOSED
      });
      
      const adapter = new HardwareAdapter(api);

      const result = adapter.shouldStop();
      
      expect(result).toEqual(true);
    });
    
    it('is true when the reservoir is empty', () => {
      const api = createMockHardware({
        boiler: Hardware.BOILER_EMPTY, 
        valve: Hardware.VALVE_CLOSED
      });
      
      const adapter = new HardwareAdapter(api);

      const result = adapter.shouldStop();
      
      expect(result).toEqual(true);
    });
  });

  describe('pause', () => {
    
  });
  
});