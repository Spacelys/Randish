# Randish

## Basic Overview

Generate random values... Sorta...  Randish provides the ability to generate random values in a predictable manner.  While this sounds like an oximoron, this allows us to create functions that benefit from randomness without worrying about side effects.

## Installation and Usage

`npm install @spacelys/randish --save`

### Seeds

We use randish by generating a seed.  The value of the seed determines the sequence of values we will pull out of it.

```typescript
import { Seed } from '@spacelys/randish'

const seed = new Seed(12345);
```

### Basic Functions

```typescript
const seed = new Seed(12345);
// returns random Integer between 0 and 100
seed.randInt(0, 100);

// returns random Float between 0 and 100
seed.randFloat(0, 100);

// returns boolean, 50% of it being true
seed.randBool();

// returns boolean, 90% of it being true
seed.randBool(.9);
```

### Operations

The Nth operation since the creation of your seed is always guaranteed to give you the same value.  This implies that any subsequent runs of your applications will always return the same sequence of values.

```typescript
const seed1 = new Seed(54321);
seed1.randInt(0, 32);
seed1.randInt(0, 32);
const thirdOp = seed1.randInt(0, 32);

const seed2 = new Seed(54321);
seed2.randBool();
seed2.randBool();
console.log(thirdOp === seed2.randInt(0, 32)); // true
```

### Random Arrays

Use randArray to create an array of predefined length with random elements.  All the basic functions work with randArray.

```typescript
// an array creator that will create an array of 16 elements
const seedArray = seed.randArray(16);

// returns a new array of size 16 with integer elements between 5 and 10
seedArray.randInt(5, 10);
```

### Random Object

Use randObject to create an object that leverages some of the basic functions.  We have to extract some of the basic functions made accessible from the package in order to leverage their functionality.

```typescript
import { Seed, randInt } from '@spacelys/randish'

const seed = new Seed(12345);
const myNewObj = seed.randObject({
  name: 'blue-blob',
  hp: randInt(50, 100)
}); // myNewObj = { name: 'blue-blob', hp: 64 }
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure the changes in the Pull Request pass the cloud build checks setup.  Merges to master will automatically publish NPM package.  Ensure that the version number is correct before merging your PR into master as that is the version number the package will be published with.