// you work for a professional social network. in this social network, a professional
// can follow other people to see their updates (think Twitter for professionals.)
// write a function that finds the job `title` that shows up most frequently given
// a set of degree of separation from you. count the initial id's own job title in the total

/*
  parameters:
  myId                - number    - the id of the user who is the root node
  
  degreesOfSeparation - number   - how many degrees of separation away to look on the graph
*/

/*
  getUser  - function - a function that returns a user's object given an ID

  example
  getUser(id)
  getUser(308)

  Retorna el object:

  {
    id: 308,
    name: "Beatrisa Lalor",
    company: "Youtags",
    title: "Office Assistant II",
    connections: [687, 997, 437]
  }
*/
/*

interface Set<T> {
    add(value: T): this;
    clear(): void;
    delete(value: T): boolean;
    forEach(callbackfn: (value: T, value2: T, set: Set<T>) => void, thisArg?: any): void;
    has(value: T): boolean;
    readonly size: number;
}

*/

const { getUser } = require("./jobs");

const findMostCommonTitle = (myId, degreesOfSeparation) => {
  // create a queue
  let queue = [myId];
  // Los objetos Set son colecciones de valores. Se puede iterar sus elementos en el orden de su inserción. Un valor en un Set sólo puede estar UNA VEZ; éste es único en la colección Set. Me sirve para no Requeue el ID
  const seen = new Set(queue);
  const jobs = {}; // para trackear los jobs que veo

  for (let i = 0; i <= degreesOfSeparation; i++) {
    // is the same as the Breadth-First solution (more or less...)
    const newQueue = [];
    while (queue.length) {
      const user = getUser(queue.shift()); // saco el primer user

      // queue up next iteration of connections
      // loop only over the connections
      for (let j = 0; j < user.connections.length; j++) {
        const connection = user.connections[j];
        // si ya vi este ID antes, no quiero adherirlo a mi newQueue:
        if (!seen.has(connection)) {
          newQueue.push(connection);
          seen.add(connection);
        }
      }

      // Dentro del while loop, si nunca vi este title de jobs, entonces empiezo con 1
      // si ya lo vi, sumo 1
      jobs[user.title] = jobs[user.title] ? jobs[user.title] + 1 : 1;
    }
    queue = newQueue;
  }

  //  console.log("objectjobs",jobs);

  /* recibo de mi jobs ={} una lista NO ORDENADA que es esta:

{
  'Developer IV': 2,
  'Payment Adjustment Coordinator': 2,
  'Desktop Support Technician': 2,
  'Mechanical Systems Engineer': 2,
  'Media Manager IV': 1,
  'Business Systems Development Analyst': 2,
  'Nurse Practicioner': 2,
  'Financial Advisor': 1,
  'Research Associate': 2,
  'Quality Engineer': 2,
  'Graphic Designer': 5,
  'Marketing Manager': 4,
  'Administrative Officer': 3,
  'Analyst Programmer': 4,
  'VP Marketing': 2,
  'Tax Accountant': 3,
.....
} */

  // find key with the biggest number
  // Object.keys devuelve un array cuyos elementos son strings correspondientes a las propiedades enumerables Keys que se encuentran directamente en el object.
  // Va a devolverme entonces un array con todas las keys que tengo en mi objeto jobs

  const jobKeys = Object.keys(jobs);
  // (82) ["Developer IV", "Payment Adjustment Coordinator", "Desktop Support Technician", "Mechanical Systems Engineer", "Media Manager IV", "Business Systems Development Analyst", ......]

  // Declaro la key y el nombre del primer item para trackearlo y luego hacer el loop
  let biggestNumber = jobs[jobKeys[0]]; // 2
  let jobName = jobKeys[0]; // Developer IV

  // y luego voy a hacer un for loop sobre esto y tratar de encontrar el que tiene el mayor número
  // Es un linear search, miro en cada item individual del array
  for (let i = 0; i < jobKeys.length; i++) {
    const currentJob = jobKeys[i];
    if (jobs[currentJob] > biggestNumber) {
      jobName = currentJob;
      biggestNumber = jobs[currentJob];
    }
  }
  // Podria haber usado un _.max() !!!!!!

  // see all job titles, sorted
  // jobKeys
  //   .map((id) => [id, jobs[id]])
  //   .sort((a, b) => b[1] - a[1])
  //   .slice(0, 10)
  //   .forEach(([job, num]) => console.log(`${num} – ${job}`));

  // console.log("======");

  /* Para el caso (findMostCommonTitle(11, 3):
  '5 – Graphic Designer'
  '4 – Marketing Manager'
  '4 – Analyst Programmer'
  '4 – Geological Engineer'
  '4 – Internal Auditor'
  '3 – Administrative Officer'
  '3 – Tax Accountant'
  '3 – Chief Design Engineer'
  '2 – Developer IV'
  '2 – Payment Adjustment Coordinator'
*/

  return jobName; // 'Graphic Designer'  (tiene 5)
};

// unit tests
// do not modify the below code
describe("findMostCommonTitle", function () {
  test("user 30 with 2 degrees of separation", () => {
    expect(findMostCommonTitle(30, 2)).toBe("Librarian");
  });

  test("user 11 with 3 degrees of separation", () => {
    expect(findMostCommonTitle(11, 3)).toBe("Graphic Designer");
  });

  test("user 307 with 4 degrees of separation", () => {
    // if you're failing here with "Clinical Specialist, you're probably not filtering users who
    // appear more than once in people's connections
    expect(findMostCommonTitle(306, 4)).toBe("Pharmacist");
  });
});

describe("extra credit", function () {
  test("user 1 with 7 degrees of separation – this will traverse every user that's followed by someone else. five users are unfollowed", () => {
    expect(findMostCommonTitle(1, 7)).toBe("Geological Engineer");
  });
});
