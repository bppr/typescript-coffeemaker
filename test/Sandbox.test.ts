// each
//  - pass it a list
//  - execute a block of code for every value on this list
//  each([1, 2], (n) => blah(n))

function each(
  list: number[], 
  block: (n: number) => void
): void {

}

describe('each', () => {
  it('executes the given fn for every value on the list', () => {
    const list = [1, 2];
    let results = [];

    each(list, (n) => results.push(n));
    
    expect(results).toEqual([1, 2]);
  });

});