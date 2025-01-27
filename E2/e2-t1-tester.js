const path = require("path");
const fs = require("fs");
const scriptsPath = path.resolve(process.argv[2] || "task1.js");

// Check if the path exists
if (!fs.existsSync(scriptsPath)) {
  console.error(`Error: The file "${scriptsPath}" does not exist.`);
  console.error(`Unable to run tests`);
  process.exit(1); // Exit the script with an error code
}

const {
  flattenArray,
  groupBy,
  memoize,
  sumNestedValues,
  paginateArray,
  EventEmitter,
  firstNonRepeatingChar,
} = require(scriptsPath);

let passed = 0;
let failed = 0;

function assertEquals(description, actual, expected) {
  if (JSON.stringify(actual) === JSON.stringify(expected)) {
    console.log(`âœ… ${description}: PASS`);
    passed++;
  } else {
    console.log(
      `${description}: FAIL - Expected: ${JSON.stringify(
        expected
      )}, but got: ${JSON.stringify(actual)}`
    );
    failed++;
  }
}

function testFlattenArray() {
  console.log("Testing flattenArray...");
  if (typeof flattenArray !== "function") {
    console.log(
      "flattenArray is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 3;
    return;
  }
  assertEquals(
    "Flatten [1, [2, 3], [4, [5, 6]]]",
    flattenArray([1, [2, 3], [4, [5, 6]]]),
    [1, 2, 3, 4, 5, 6]
  );
  assertEquals(
    "Flatten [1, [2, [3, [4]], 5]]",
    flattenArray([1, [2, [3, [4]], 5]]),
    [1, 2, 3, 4, 5]
  );
  assertEquals("Flatten [[[[[[]]]]]]", flattenArray([[[[[[]]]]]]), []);
}

function testGroupBy() {
  console.log("Testing groupBy...");
  if (typeof groupBy !== "function") {
    console.log(
      "groupBy is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 2;
    return;
  }
  const people = [
    { name: "Alice", age: 21 },
    { name: "Bob", age: 21 },
    { name: "Charlie", age: 22 },
  ];
  assertEquals("Group by age", groupBy(people, "age"), {
    21: [
      { name: "Alice", age: 21 },
      { name: "Bob", age: 21 },
    ],
    22: [{ name: "Charlie", age: 22 }],
  });

  const cars = [
    { make: "Toyota", model: "Camry" },
    { make: "Honda", model: "Accord" },
    { make: "Toyota", model: undefined, year: 2000 },
    { make: "Toyota", model: "Corolla" },
  ];
  assertEquals("Group by make", groupBy(cars, "make"), {
    Toyota: [
      { make: "Toyota", model: "Camry" },
      { make: "Toyota", year: 2000 },
      { make: "Toyota", model: "Corolla" },
    ],
    Honda: [{ make: "Honda", model: "Accord" }],
  });
}

function testMemoize() {
  console.log("Testing memoize...");
  if (typeof memoize !== "function") {
    console.log(
      "memoize is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 3;
    return;
  }
  const slowFunction = (num) => num * 2;
  const memoizedFunction = memoize(slowFunction);
  assertEquals("Memoize 5", memoizedFunction(5), 10);
  assertEquals("Memoize 5 again (from cache)", memoizedFunction(5), 10);
  assertEquals("Memoize 10", memoizedFunction(10), 20);
}

function testSumNestedValues() {
  console.log("Testing sumNestedValues...");
  if (typeof sumNestedValues !== "function") {
    console.log(
      "sumNestedValues is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 3;
    return;
  }
  const data = {
    a: 1,
    b: { c: 2, d: 3 },
    e: { f: { g: 4 } },
  };
  assertEquals("Sum of nested values", sumNestedValues(data), 10);

  const moreData = {
    x: 5,
    y: { z: { w: 6 }, u: 2 },
    v: 7,
  };
  assertEquals("Sum of more nested values", sumNestedValues(moreData), 20);

  const emptyData = {};
  assertEquals("Sum of empty values", sumNestedValues(emptyData), 0);
}

function testPaginateArray() {
  console.log("Testing paginateArray...");
  if (typeof paginateArray !== "function") {
    console.log(
      "paginateArray is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 5;
    return;
  }
  const items = ["a", "b", "c", "d", "e", "f"];
  assertEquals("Paginate page 1", paginateArray(items, 2, 1), ["a", "b"]);
  assertEquals("Paginate page 2", paginateArray(items, 2, 2), ["c", "d"]);
  assertEquals("Paginate page 3", paginateArray(items, 2, 3), ["e", "f"]);
  assertEquals(
    "Paginate page 4 (out of bounds)",
    paginateArray(items, 2, 4),
    []
  );
  assertEquals("Paginate page 1 of empty", paginateArray([], 1, 1), []);
}

function testEventEmitter() {
  console.log("Testing EventEmitter...");
  if (typeof EventEmitter !== "function") {
    console.log(
      "EventEmitter is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 1;
    return;
  }
  const emitter = new EventEmitter();
  let result = "";
  emitter.on("greet", (name) => (result += `Hello, ${name}!`));
  emitter.emit("greet", "Alice");
  assertEquals('Emit "greet" event', result, "Hello, Alice!");
}

function testFirstNonRepeatingChar() {
  console.log("Testing firstNonRepeatingChar...");
  if (typeof firstNonRepeatingChar !== "function") {
    console.log(
      "firstNonRepeatingChar is not defined. Did you forget to export it? Read the exercises instructions on how to export."
    );
    failed += 5;
    return;
  }
  assertEquals(
    'First non-repeating character in "swiss"',
    firstNonRepeatingChar("swiss"),
    "w"
  );
  assertEquals(
    'First non-repeating character in "racecar"',
    firstNonRepeatingChar("racecar"),
    "e"
  );
  assertEquals(
    'First non-repeating character in "q"',
    firstNonRepeatingChar("q"),
    "q"
  );
  assertEquals(
    'First non-repeating character in "ppppppppppppp"',
    firstNonRepeatingChar("ppppppppppppp"),
    null
  );
  assertEquals(
    'First non-repeating character in ""',
    firstNonRepeatingChar(""),
    null
  );
}

function runTests() {
  testFlattenArray();
  testGroupBy();
  testMemoize();
  testSumNestedValues();
  testPaginateArray();
  testEventEmitter();
  testFirstNonRepeatingChar();

  console.log(`\nTotal tests passed: ${passed}`);
  console.log(`Total tests failed: ${failed}`);
  return { passed, failed };
}

runTests();