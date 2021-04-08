import { LCGParams, numberToParams } from './lcg';

interface IArrayCreator {
	randInt: (min: number, max: number) => Array<number>;
	randFloat: (min: number, max: number) => Array<number>;
	randBool: (percentTrue?: number) => Array<boolean>;
}

// These utitlity functions are to be used to delay creation till a future time
export const randInt = (min: number, max: number) => (seed: Seed): number => seed.randInt(min, max);
export const randFloat = (min: number, max: number) => (seed: Seed): number => seed.randFloat(min, max);
export const randBool = (percentTrue?: number) => (seed: Seed): boolean => seed.randBool(percentTrue);

export class Seed {
	protected params: LCGParams;
	protected xn: number;
	protected x0: number; // keeps track of its initial starting value
	public constructor(params: LCGParams | number) {
		if (typeof params === 'number') {
			const lcgParams = numberToParams(params);
			this.params = lcgParams;
			this.x0 = lcgParams.x0;
			this.xn = lcgParams.x0;
		} else {
			this.params = params;
			this.xn = params.x0;
			this.x0 = params.x0;
		}
	}

	/**
	 * Resets seed to its starting state
	 *
	 * @memberof Seed
	 */
	public reset(): void {
		this.xn = this.x0;
	}
	/**
	 * Returns a fork of your current seed, guaranteed to give you the same
	 * subsequent values of its parent
	 *
	 * @returns {Seed}
	 * @memberof Seed
	 */
	public fork(): Seed {
		const myParams = this.params;
		return new Seed({
			...myParams,
			x0: this.xn,
		});
	}
	/**
	 * Returns an integer within the range provided
	 * up to (but not including) the max value
	 *
	 * @param {number} min
	 * @param {number} max
	 * @returns
	 * @memberof Seed
	 */
	public randInt(min: number, max: number): number {
		const delta = max - min;
		const p = this.randFloat(0, 1);
		return min + Math.floor(p * delta);
	}

	/**
	 * Returns a float | decimal number within the range provided
	 * up to (but not including) the max value
	 *
	 * @param {number} min
	 * @param {number} max
	 * @returns {number}
	 * @memberof Seed
	 */
	public randFloat(min: number, max: number): number {
		const n = this.nextRaw();
		const p = n / this.getUpperBound();
		return min + (max - min) * p;
	}

	/**
	 * Returns a random boolean with equal chances of being true or false no parameter passed in
	 *
	 * @param {*} [percentTrue=.5] changes the percentage of times true values get returned
	 * @returns {boolean}
	 * @memberof Seed
	 */
	public randBool(percentTrue = .5): boolean {
		const f = this.randFloat(0, 1);
		return f < percentTrue;
	}

	/**
	 * Create a random array of size N, and use the creator methods to fill it with values
	 *
	 * @template T
	 * @param {number} size
	 * @returns {IArrayCreator}
	 * @memberof Seed
	 */
	public randArray(size: number): IArrayCreator {
		const ary = new Array(size).fill(0);
		return {
			randInt: (min: number, max: number) =>
				ary.map(() => this.randInt(min, max)),
			randFloat: (min: number, max: number) =>
				ary.map(() => this.randFloat(min, max)),
			randBool: (percentTrue?: number) =>
				ary.map(() => this.randBool(percentTrue)),
		};
	}

	public randObject(recipe: Record<string, unknown>): Record<string, unknown> {
		const obj: Record<string, unknown> = {};
		Object.keys(recipe).forEach(key => {
			const v = recipe[key];
			if (typeof v === 'function') {
				obj[key] = v(this);
			} else if (typeof v === 'object') {
				obj[key] = this.randObject(v as Record<string, unknown>);
			} else {
				obj[key] = v;
			}
		});
		return obj;
	}
	/**
	 * Gets the maximum possible value nextRaw() can return
	 *
	 * @protected
	 * @returns {number}
	 * @memberof Seed
	 */
	protected maxRaw(): number {
		return this.params.m - 1;
	}

	/**
	 * Gets the upper bound set by our LCG params
	 *
	 * @protected
	 * @returns {number}
	 * @memberof Seed
	 */
	 protected getUpperBound(): number {
		return this.params.m;
	 }

	/**
	 * Get the next raw value from the LCG sequence defined by our params
	 *
	 * @private
	 * @returns {number}
	 * @memberof Seed
	 */
	private nextRaw(): number {
		const {a, c, m} = this.params;
		const nextValue = ( a * this.xn + c ) % m;
		this.xn = nextValue;
		return nextValue;
	}
}
