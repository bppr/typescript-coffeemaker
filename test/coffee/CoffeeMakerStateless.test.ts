import { IdleCoffeeMaker, BrewingCoffeeMaker, PausedCoffeeMaker } 
  from '../../src/coffee/CoffeeMakerStateless';
import { IHardwareAdapter } from '../../src/coffee/HardwareAdapter';

type AdapterQueries = { wasStartRequested: boolean, isReadyToBrew: boolean, shouldPause: boolean, shouldStop: boolean };
function createAdapter(params: Partial<AdapterQueries> = {}): IHardwareAdapter {
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
    start: jest.fn().mockReturnThis(),
    stop: jest.fn().mockReturnThis(),
    pause: jest.fn().mockReturnThis(),
    ...functionifiedParams
  }
}


describe('CoffeeMaker', () => {
  describe('idle coffee maker', () => {
    it('idle coffee maker starts when start is requested and hardware is ready', () => {
      const hardwareAdapter = createAdapter({
        wasStartRequested: true,
        isReadyToBrew: true
      });
      
      const idle = new IdleCoffeeMaker(hardwareAdapter);
      
      const result = idle.tick();
      
      expect(hardwareAdapter.start).toBeCalled();
      expect(result.isBrewing).toBe(true);
    });
    
    it('idle coffee maker does not start when start is not requested', () => {
      const hardwareAdapter = createAdapter({ wasStartRequested: false });
      
      const idle = new IdleCoffeeMaker(hardwareAdapter);
      
      const result = idle.tick();
      
      expect(hardwareAdapter.start).not.toBeCalled();
      expect(result.isBrewing).toBe(false);
      
    });
    
    it('idle coffee maker does not start when start is requested but hardware is not ready', () => {
      const hardwareAdapter = createAdapter({
        wasStartRequested: true,
        isReadyToBrew: false
      });
      
      const idle = new IdleCoffeeMaker(hardwareAdapter);
      const result = idle.tick();
      
      expect(hardwareAdapter.start).not.toBeCalled();
      expect(result.isBrewing).toBe(false);
    });
  });
  
  describe('Brewing CoffeeMaker', () => {
    it('stops brewing when shouldStop is true', () => {
      const hardwareAdapter = createAdapter({
        shouldStop: true
      });
      
      const brewing = new BrewingCoffeeMaker(hardwareAdapter);
      const result = brewing.tick();
      
      expect(hardwareAdapter.stop).toBeCalled();
    });
    
    it('pauses brewing when shouldPause is true', () => {
      const hardwareAdapter = createAdapter({
        shouldPause: true
      });
      
      const brewing = new BrewingCoffeeMaker(hardwareAdapter);
      const result = brewing.tick();
      
      expect(hardwareAdapter.pause).toBeCalled();
    });
    
  });

  describe('Paused CoffeeMaker', () => {
    it('resumes brewing when isReadyToBrew is true', () => {
      const hardwareAdapter = createAdapter({
        isReadyToBrew: true
      });
      
      const paused = new PausedCoffeeMaker(hardwareAdapter);
      const result = paused.tick();

      expect(hardwareAdapter.start).toBeCalled();
    });

    it('does not resume and decrements timeout when isReadyToBrew is false', () => {
      const hardwareAdapter = createAdapter({
        isReadyToBrew: false
      });
      
      const paused = new PausedCoffeeMaker(hardwareAdapter);
      const result = paused.tick() as PausedCoffeeMaker;

      expect(hardwareAdapter.start).not.toBeCalled();
      expect(result.timeoutRemaining).toEqual(paused.timeoutRemaining - 1);
    });

    it('becomes an IdleCoffeeMaker if timeoutRemaining is 0', () => {
      const hardwareAdapter = createAdapter({
        isReadyToBrew: false
      });
          
      const paused = new PausedCoffeeMaker(hardwareAdapter, 1);
      const result = paused.tick().tick();

      expect(result.isIdle).toBe(true);
    });

  });
  
});	