export interface WaterSource {
  isReady(): boolean;
  start(): void;
  stop(): void;
}

export interface Receptacle {
  isReady(): boolean;
}

export interface UserInterface {
  requestedStart(): boolean;
}

export default class CoffeeMaker {
  constructor(
    private watersource: WaterSource,
    private receptacle: Receptacle,
    private brewButton: UserInterface
  ) {}

  tick() {
    this.watersource.start();
  }
}

// identify integration points (hardwareAPI)
// mock 'em out & drive policy
// address code smells

// - if obvious, fix it
// - if not, add more use-cases until obvious