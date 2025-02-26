/*

  Implement a radix sort in a function called radixSort.

  You'll probably need several functions
  
  You can implement it using a binary or decimal based bucketing but I'd recommend the decimal based buckets because
  it ends up being a lot more simple to implement.

*/

// Ejemplo de la funcion getDigit:
// number = 1301, 0, 4;
// returns 1
// El numero es 1301, en la posicion 0, tiene 4 numeros de longitud

const { isString } = require("lodash");

function getDigit(number, place, longestNumber) {
  const string = number.toString();
  const size = string.length;

  const mod = longestNumber - size;
  return string[place - mod] || 0;
}

function findLongestNumber(array) {
  // I could use Reduce
  let longest = 0;
  for (let i = 0; i < array.length; i++) {
    const currentLength = array[i].toString().length; // 3000 devolveria 4
    // Si el currentLength es mayor retornalo, sino retorname longest
    longest = currentLength > longest ? currentLength : longest;
  }
  return longest;
}

function radixSort(array) {
  // find longest number
  const longestNumber = findLongestNumber(array);
  // create how many buckets you need
  // an array of 10 arrays
  const buckets = new Array(10).fill().map(() => []);

  // for loops for how many iterations you need to do
  for (let i = longestNumber - 1; i >= 0; i--) {
    // while loop
    while (array.length) {
      // enqueue the numbers into their buckets (push())
      const current = array.shift();
      // Si tenemos el numero 1244, el ultimo 4 va al bucket 4
      buckets[getDigit(current, i, longestNumber)].push(current);
    }
    // for loop for each bucket
    for (let j = 0; j < 10; j++) {
      while (buckets[j].length) {
        // dequeue all of the result (shift())
        array.push(buckets[j].shift());
      }
    }
  }
  return array;
}

// unit tests
// do not modify the below code
describe("radix sort", function () {
  it("should sort correctly", () => {
    const nums = [
      20, 51, 3, 801, 415, 62, 4, 17, 19, 11, 1, 100, 1244, 104, 944, 854, 34,
      3000, 3001, 1200, 633,
    ];
    const ans = radixSort(nums);
    expect(ans).toEqual([
      1, 3, 4, 11, 17, 19, 20, 34, 51, 62, 100, 104, 415, 633, 801, 854, 944,
      1200, 1244, 3000, 3001,
    ]);
  });
  it("should sort 99 random numbers correctly", () => {
    const fill = 99;
    const nums = new Array(fill)
      .fill()
      .map(() => Math.floor(Math.random() * 500000));
    const ans = radixSort(nums);
    expect(ans).toEqual(nums.sort());
  });
});
