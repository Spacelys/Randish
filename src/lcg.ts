import { Seed } from './index';

export interface LCGParams {
	c: number;
	a: number;
	m: number;
	x0: number;
}

const defaultParams: LCGParams = {
	c: 2 * 117 + 1,
	a: 4 * 317 + 1,
	m: Math.pow(2, 16),
	x0: 0,
};

export const numberToParams = (n: number): LCGParams => {
	const seed: Seed = new Seed({
		...defaultParams,
		x0: n,
	});
	const c = 2 * seed.randInt(1, 3000) + 1;
	const a = 4 * seed.randInt(3000, 6000) + 1;
	const m = Math.pow(2, 32);
	const x0 = seed.randInt(1, m);
	return {
		c, a, m, x0,
	};
};

