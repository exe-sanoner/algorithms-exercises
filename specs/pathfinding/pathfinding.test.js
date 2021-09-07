// write in a function thats a X by X array of arrays of numbers
// as well two x/y combinations and have it return the shortest
// length (you don't need to track the actual path) from point A
// to point B.
//
// the numbers in the maze array represent as follows:
// 0 – open space
// 1 - closed space, cannot pass through. a wall
// 2 - one of the two origination points
//
// you will almost certainly need to transform the maze into your own
// data structure to keep track of all the meta data

// this is a little tool I wrote to log out the maze to the console.
// it is opinionated of how to do that and you do not have to do it
// the way I did. however feel free to use it if you'd like

// MAZE = laberinto
// NEIGHBORS = vecinos

const logMaze = require("./logger");
const NO_ONE = 0;
const BY_A = 1;
const BY_B = 2;

// trackeo con mi propia data structure:
function generateVisited(maze) {
  const visited = [];
  for (let y = 0; y < maze.length; y++) {
    const yAxis = [];
    for (let x = 0; x < maze[y].length; x++) {
      const coordinate = {
        closed: maze[y][x] === 1,
        length: 0,
        openedBy: NO_ONE,
        x, // x: x
        y, // y: y
      };
      yAxis.push(coordinate);
    }
    visited.push(yAxis);
  }
  return visited;
}

// Por ej, para el sixbysix retorna:
/*
[
  [
    { closed: false, length: 0, openedBy: 0 },
    { closed: false, length: 0, openedBy: 0 },
    { closed: false, length: 0, openedBy: 0 },
.......
    { closed: false, length: 0, openedBy: 0 }
  ],
  [
    { closed: false, length: 0, openedBy: 0 },
    { closed: true, length: 0, openedBy: 0 },           <-  ME MUESTRA CON 1 LOS CERRADOS!!
    { closed: true, length: 0, openedBy: 0 },
    { closed: true, length: 0, openedBy: 0 },
    { closed: true, length: 0, openedBy: 0 },
    { closed: true, length: 0, openedBy: 0 }
  ],
  [
    { closed: false, length: 0, openedBy: 0 },
    { closed: false, length: 0, openedBy: 0 },
.......
    { closed: false, length: 0, openedBy: 0 },
    { closed: false, length: 0, openedBy: 0 }
  ]
]
*/

const findShortestPathLength = (maze, [xA, yA], [xB, yB]) => {
  // OTRA FORMA DE ESCRIBIR LO ANTERIOR, USANDO MAP!!!!!!
  // const visited = maze.map((row, y) =>
  //   row.map((origin, x) => ({
  //     closed: origin === 1,
  //     length: 0,
  //     openedBy: NO_ONE,
  //     x,
  //     y,
  //   }))
  // );

  // RETORNA ESTO:
  /*

  [
  [
    {
      closed: false,
      length: 0,
      openedBy: 0,
      x: 0,
      y: 0
    },
    {
      closed: false,
      length: 0,
      openedBy: 0,
      x: 1,
      y: 0
    },
    {
      closed: false,
      length: 0,
      openedBy: 0,
      x: 2,
      y: 0
    },
    {
      closed: false,
      length: 0,
      openedBy: 0,
      x: 3,
      y: 0
  */
  const visited = generateVisited(maze); // de lo anterior, si uso map NO VA
  visited[yA][xA].openedBy = BY_A;
  visited[yB][xB].openedBy = BY_B; // donde estan los numeros 2 ubicados (viene del parametro cuando llamo a la funcion findShortestPathLength)
  // logMaze(visited);

  let aQueue = [visited[yA][xA]]; // [ { closed: false, length: 0, openedBy: 1 } ]
  let bQueue = [visited[yB][xB]]; // [ { closed: false, length: 0, openedBy: 2 } ]
  let iteration = 0;

  // if one runs out, there's no path
  while (aQueue.length && bQueue.length) {
    iteration++;
    // gather (reunir) "a" neighbors
    const aNeighbors = aQueue.reduce(
      (acc, neighbor) =>
        acc.concat(getNeighbors(visited, neighbor.x, neighbor.y)),
      []
    );
    aQueue = [];

    // La idea del Reduce es: voy a traves de todo lo que esta en el queue y enqueue todos sus vecinos válidos, que son todos los que tomo de mi funcion getNeighbors
    /* otra forma en vez de usar el Reduce:
    
    let aNeighbors = [];
    while (aQueue.length) {
      const coordinate = aQueue.shift();
      aNeigbors = aNeigbors.concat(getNeighbors(visited, coordinate.x, coordinate.y))
    }
    */

    // aNeighbors  ===> va a tener todos los vecinos válidos allí.  Así que vamos a tener que ir y modificar todos estos para ser openedBy A con todas sus longitudes correctas:

    // process a neighbors
    for (let i = 0; i < aNeighbors.length; i++) {
      const neighbor = aNeighbors[i];
      // si girando encuentro la siguiente cosa que ha sido openedby B cuando lo hago en A, entonces lo encontre!!!!!!!
      if (neighbor.openedBy === BY_B) {
        return neighbor.length + iteration;
      } else if (neighbor.openedBy === NO_ONE) {
        neighbor.length = iteration; // si nunca fue visitado, consideremoslo visitado
        neighbor.openedBy = BY_A; // visitado por A
        aQueue.push(neighbor);
      }
    }

    // the same thing for b neighbors
    const bNeighbors = bQueue.reduce(
      (acc, neighbor) =>
        acc.concat(getNeighbors(visited, neighbor.x, neighbor.y)),
      []
    );
    bQueue = [];
    for (let i = 0; i < bNeighbors.length; i++) {
      const neighbor = bNeighbors[i];
      if (neighbor.openedBy === BY_A) {
        return neighbor.length + iteration;
      } else if (neighbor.openedBy === NO_ONE) {
        neighbor.length = iteration;
        neighbor.openedBy = BY_B;
        bQueue.push(neighbor);
      }
    }
    // logMaze(visited);
  }
  return -1; // no hubo path entre los 2
};

// si te doy las coordenadas x & y de un visited array, dame todos los vecinos para este item particular:
const getNeighbors = (visited, x, y) => {
  const neighbors = [];

  if (y - 1 >= 0 && !visited[y - 1][x].closed) {
    // left
    neighbors.push(visited[y - 1][x]);
  }

  if (y + 1 < visited[0].length && !visited[y + 1][x].closed) {
    // right
    neighbors.push(visited[y + 1][x]);
  }

  if (x - 1 >= 0 && !visited[y][x - 1].closed) {
    // up
    neighbors.push(visited[y][x - 1]);
  }

  if (x + 1 < visited.length && !visited[y][x + 1].closed) {
    // down
    neighbors.push(visited[y][x + 1]);
  }

  return neighbors;
};

// there is a visualization tool in the completed exercise
// it requires you to shape your objects like I did
// see the notes there if you want to use it

// unit tests
// do not modify the below code
describe("pathfinding – happy path", function () {
  const fourByFour = [
    [2, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 2],
  ];
  it("should solve a 4x4 maze", () => {
    expect(findShortestPathLength(fourByFour, [0, 0], [3, 3])).toEqual(6);
  });

  const sixBySix = [
    [0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0],
    [0, 0, 2, 0, 0, 0],
  ];
  it("should solve a 6x6 maze", () => {
    expect(findShortestPathLength(sixBySix, [1, 1], [2, 5])).toEqual(7);
  });

  const eightByEight = [
    [0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 0, 0, 1, 0, 0],
    [0, 0, 0, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 0],
    [0, 2, 0, 0, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 1, 2],
  ];
  it("should solve a 8x8 maze", () => {
    expect(findShortestPathLength(eightByEight, [1, 7], [7, 7])).toEqual(16);
  });

  const fifteenByFifteen = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0],
    [0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 1, 1, 2, 1, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 1, 0, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
    [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  it("should solve a 15x15 maze", () => {
    expect(findShortestPathLength(fifteenByFifteen, [1, 1], [8, 8])).toEqual(
      78
    );
  });
});

// I care far less if you solve these
// nonetheless, if you're having fun, solve some of the edge cases too!
// just remove the .skip from describe.skip
describe("pathfinding – edge cases", function () {
  const byEachOther = [
    [0, 0, 0, 0, 0],
    [0, 2, 2, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 0, 0, 0, 0],
  ];
  it("should solve the maze if they're next to each other", () => {
    expect(findShortestPathLength(byEachOther, [1, 1], [2, 1])).toEqual(1);
  });

  const impossible = [
    [0, 0, 0, 0, 0],
    [0, 2, 0, 0, 0],
    [0, 0, 1, 1, 1],
    [1, 1, 1, 0, 0],
    [0, 0, 0, 0, 2],
  ];
  it("should return -1 when there's no possible path", () => {
    expect(findShortestPathLength(impossible, [1, 1], [4, 4])).toEqual(-1);
  });
});
