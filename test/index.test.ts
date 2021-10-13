import { Seed, randBool, randInt, randFloat } from '../src/index';

describe('Raddish', () => {
	const defaultLcg = {
		c: 3,
		a: 9,
		m: 16, // with these params the lcg cycle will be 16 long
		x0: 3,
	};

	it('creates new Seed with just a number', () => {
		const s = new Seed(1);
		expect(typeof s).toBe('object');
	});

	it('creates new Seed with LCG params', () => {
		const s = new Seed(defaultLcg);
		expect(typeof s).toBe('object');
	});

	describe('fork', () => {
		const s1 = new Seed(defaultLcg);
		it('should return same value as original fork', () => {
			s1.randInt(0, 16);
			const s2 = s1.fork();
			expect(s1.randInt(0, 16)).toEqual(s2.randInt(0, 16));
		});
	});

	describe('reset', () => {
		const s = new Seed(defaultLcg);
		it('should return the first value after reset', () => {
			const v0 = s.randInt(0, 16);
			s.randInt(0, 16);
			s.reset();
			const vReset = s.randInt(0, 16);
			expect(v0).toBe(vReset);
		});
	});

	describe('randInt', () => {
		const s = new Seed(defaultLcg);
		it('should return an integer', () => {
			const val = s.randInt(0, 10);
			expect(val % 1).toBe(0);
		});
	});

	describe('randArray', () => {
		const s = new Seed(defaultLcg);
		it('should have methods for creating bools ints and floats', () => {
			const aryCreator = s.randArray(16);
			expect(aryCreator.randBool).toBeDefined();
			expect(aryCreator.randInt).toBeDefined();
			expect(aryCreator.randFloat).toBeDefined();
		});

		it('should return an array of size n', () => {
			const ary = s.randArray(16).randInt(0, 10);
			expect(ary.length).toEqual(16);
		});

		describe('randInt', () => {
			it('should return only integers', () => {
				const ary = s.randArray(16).randInt(0, 10);
				ary.forEach(val => {
					expect(val % 1).toEqual(0);
				});
			});
		});

		describe('randBool', () => {
			it('should return only booleans', () => {
				const ary = s.randArray(16).randBool(0);
				ary.forEach(val => {
					expect(typeof val).toEqual('boolean');
				});
			});
		});

		describe('randFloat', () => {
			it('should return only numbers', () => {
				const ary = s.randArray(16).randFloat(0, 10);
				ary.forEach(val => {
					expect(typeof val).toEqual('number');
				});
			});
		});
	});

	describe('randGrid', () => {
		const s = new Seed(defaultLcg);
		it('should have methods for creating bools ints and floats', () => {
			const gridCreator = s.randGrid(16, 16);
			expect(gridCreator.randBool).toBeDefined();
			expect(gridCreator.randInt).toBeDefined();
			expect(gridCreator.randFloat).toBeDefined();
		});

		it('should return an 2d array of size mxn', () => {
			const grid = s.randGrid(16, 8).randInt(0, 10);
			expect(grid.length).toEqual(8);
			expect(grid[0].length).toEqual(16);
		});

		describe('randInt', () => {
			it('should return only integers', () => {
				const grid = s.randGrid(16, 8).randInt(0, 10);
				grid.forEach(line => {
					line.forEach(val => {
						expect(val % 1).toEqual(0);
					})
				});
			});
		});

		describe('randFloat', () => {
			it('should return only floats', () => {
				const grid = s.randGrid(16, 8).randFloat(0, 10);
				grid.forEach(line => {
					line.forEach(val => {
						expect(typeof val).toEqual('number');
					})
				});
			});
		});

		describe('randBoolean', () => {
			it('should return only bools', () => {
				const grid = s.randGrid(16, 8).randBool();
				grid.forEach(line => {
					line.forEach(val => {
						expect(typeof val).toEqual('boolean');
					})
				});
			});
		});
	});

	describe('randFloat', () => {
		const s = new Seed(defaultLcg);
		it('should return a float', () => {
			const val = s.randFloat(1.1, 1.9);
			expect(val % 1).toBeGreaterThan(0);
		});
	});

	describe('randBool', () => {
		const s = new Seed(defaultLcg);
		it('should return a boolean', () => {
			expect(typeof s.randBool()).toBe('boolean');
		});

		it('should return true more frequently with high param', () => {
			const truesDefault = s.randArray(16).randBool().filter(v => v);
			const truesHigh = s.randArray(16).randBool(.9).filter(v => v);
			expect(truesHigh.length).toBeGreaterThan(truesDefault.length);
		});
	});

	describe('randObject', () => {
		const s = new Seed(defaultLcg);
		const recipe = {
			name: 'bobloblaw',
			type: 'lawyer',
			price: 1000000,
			hp: randInt(10, 16),
			stats: {
				score: randFloat(65, 100),
				likesCoffee: randBool(),
			},
		};
		it('should return an object', () => {
			const obj = s.randObject(recipe);
			expect(typeof obj).toEqual('object');
		});
		it('should respect recipe details', () => {
			const obj = s.randObject(recipe);
			expect(obj.name).toEqual('bobloblaw');
			expect(obj.price).toEqual(1000000);
			expect(obj.hp).toBeGreaterThanOrEqual(10);
			expect(obj.hp).toBeLessThanOrEqual(16);
			expect(typeof obj.stats).toEqual('object');
		});
	});
});
