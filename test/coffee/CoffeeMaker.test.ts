// greet
// says hello world
function greet(target: string = 'world'): string {
  return `Hello, ${target}!`;
}

describe('greet()', () => {
  it('says hello to the provided target', () => {
    expect(greet('Michael')).toEqual('Hello, Michael!');
    expect(greet('Bob')).toEqual('Hello, Bob!');
  });

  it('defaults to saying hello world if no target provided', () => {
    const result = greet();
    expect(result).toEqual('Hello, world!');
  });
});

// npm init (wizard)
// npm install --save-dev @types/jest @types/node jest typescript

// Brew Button is pushed. Heaters are turned on. Pressure valve is closed.
// Coffee Pot is pulled away. Pressure Valve is opened to stop flow of coffee.
// Coffee Pot is returned. Pressure valve is closed.
// Pot is full, brew indicator light is turned on. Pressure valve is opened. Warmer turned on. Heater turned off.
// Pot is empty. Brew indicator light turns off. Warmer turned off.
