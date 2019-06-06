class Walrus {
  stomach: string[];
  name: string;

  constructor(name: string, stomach: string[] = []) {
    this.name = name;
    this.stomach = stomach;
  }

  eat(food: string): Walrus {
    return new Walrus(name, this.stomach.concat([food]));
  }
}


describe('walruses', () => {
  it('adds eaten food contents to its stomach', () => {
    let walrus = new Walrus('walter');

    walrus = walrus
      .eat('shoes');

    expect(walrus.stomach).toEqual(['shoes']);
  })
});