import readline from 'readline';
// import fs from 'fs';
// const  readline=  require('readline');

// const rl = readline.createInterface({
//     input: process.stdin,
//     output: process.stdout
//   });

// rl.question('Enter the elements separated by commas: ', (input) => {
    
//   ////////////////////////////////
//   // const array = [5,3,9,14,2,6,4,1,8,2,3,2];
//   const array = input.split(',').map(Number);
//   const track= new Map();

//   let currentIndex = 0;
//   let numRows = 0;
//   const rows = [];

//   while (currentIndex < array.length) {
//     numRows++;
//     const row = [];

//     for (let j = 0; j < numRows; j++) {
//       //  console.log(`For Index: ${currentIndex} is Row Number: ${numRows}`)
//       track.set(currentIndex, numRows);
//       row.push(array[currentIndex++]);    
//     }
//   }

//   function createAdjacencyMatrix(arr) {
//     const n = array.length;
//     const matrix = [];

//     for (let i = 0; i < n; i++) {
//       matrix[i] = Array(n).fill(0);
//     }
//     // console.log(`getting  index 0 leftChildIndex is ${track.get(0)}`)
//     for (let i = 0; i < n; i++) {
//       let leftChildIndex = track.get(i) + i;
//       // console.log(`When index ${i} leftChildIndex is ${leftChildIndex}`)
//       let rightChildIndex = leftChildIndex + 1;
//       // console.log(`When index ${i} rightChildIndex is ${rightChildIndex}`)

//       if (leftChildIndex < n) {
//         matrix[i][leftChildIndex] = 1;
//         // matrix[leftChildIndex][i] = 1;
//       }

//       if (rightChildIndex < n) {
//         matrix[i][rightChildIndex] = 1;
//         // matrix[rightChildIndex][i] = 1;
//       }
//       // console.log("For Index:", i);
//       // console.log("matrix:", matrix[i]);

//     }

//     return matrix;
//   }

//   const adjMatrix = createAdjacencyMatrix(array);
//   console.log(adjMatrix);
//   //  for (let i = 0; i < adjMatrix.length; i++) {
//   //   let rowString = '';
    
//   //   for (let j = 0; j < adjMatrix[i].length; j++) {
//   //     rowString += adjMatrix[i][j] + ' ';
//   //   }

//   //   console.log(rowString.trim());

//   //  }

//   //////////////////////

//   // const array1 = [0, 1, 2, 3, 4, 5];
//   // const matrix = [
//   //   [0, 1, 1, 0, 0, 0],
//   //   [0, 0, 0, 1, 1, 0],
//   //   [0, 0, 0, 0, 1, 1],
//   //   [0, 0, 0, 0, 0, 0],
//   //   [0, 0, 0, 0, 0, 0],
//   //   [0, 0, 0, 0, 0, 0]
//   // ];
//   const array1= array;
//   const matrix= adjMatrix;

//   const maxPathSum = findLargestSumPath(array1, matrix);
//   console.log("Largest sum of the path:", maxPathSum);

//   function findLargestSumPath(array1, matrix) {
//     const visited = Array(array1.length).fill(false);
//     let maxSum = 0;

//     function dfs(node, currentSum) {
//       visited[node] = true;
//       currentSum += array1[node];

//       if (currentSum > maxSum) {
//         maxSum = currentSum;
//       }

//       for (let neighbor = 0; neighbor < array1.length; neighbor++) {
//         if (matrix[node][neighbor] === 1 && !visited[neighbor]) {
//           dfs(neighbor, currentSum);
//         }
//       }

//       visited[node] = false; // Backtrack to explore other paths
//     }

//     for (let i = 0; i < array1.length; i++) {
//       dfs(i, 0);
//     }

//     return maxSum;
//   }

//   /////////////////////////////////
//     rl.question('Do you want to exit? (yes/no): ', (answer) => {
//       if (answer.toLowerCase() === 'yes') {
//         rl.close();
//       } else {
//         rl.close();
//       }
//     });
// });



/////////////////////////////.......... From The Static Data Generate The Matrix.................

// const array = [5,3,9,14,2,6];
// const track= new Map();

// let currentIndex = 0;
// let numRows = 0;
// const rows = [];

// while (currentIndex < array.length) {
//   numRows++;
//   const row = [];

//   for (let j = 0; j < numRows; j++) {
//     //  console.log(`For Index: ${currentIndex} is Row Number: ${numRows}`)
//      track.set(currentIndex, numRows);
//      row.push(array[currentIndex++]);    
//   }
// }

// function createAdjacencyMatrix(arr) {
//   const n = array.length;
//   const matrix = [];

//   for (let i = 0; i < n; i++) {
//     matrix[i] = Array(n).fill(0);
//   }
//   // console.log(`getting  index 0 leftChildIndex is ${track.get(0)}`)
//   for (let i = 0; i < n; i++) {
//     let leftChildIndex = track.get(i) + i;
//     // console.log(`When index ${i} leftChildIndex is ${leftChildIndex}`)
//     let rightChildIndex = leftChildIndex + 1;
//     // console.log(`When index ${i} rightChildIndex is ${rightChildIndex}`)

//     if (leftChildIndex < n) {
//       matrix[i][leftChildIndex] = 1;
//       // matrix[leftChildIndex][i] = 1;
//     }

//     if (rightChildIndex < n) {
//       matrix[i][rightChildIndex] = 1;
//       // matrix[rightChildIndex][i] = 1;
//     }
//     // console.log("For Index:", i);
//     // console.log("matrix:", matrix[i]);

//   }

//   return matrix;
// }

// const adjMatrix = createAdjacencyMatrix(array);
//  console.log(adjMatrix);
// //  for (let i = 0; i < adjMatrix.length; i++) {
// //   let rowString = '';
  
// //   for (let j = 0; j < adjMatrix[i].length; j++) {
// //     rowString += adjMatrix[i][j] + ' ';
// //   }

// //   console.log(rowString.trim());

// //  }

// ////////////////////// Finding the Largest Sum Value ///////////////

const array1 = [1, 2, 3, -4,-5,-6];
const matrix = [
  [0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]
];
// // const array1= array;
// // const matrix= adjMatrix;

const maxPathSum = findLargestSumPath(array1, matrix);
console.log("Largest sum of the path:", maxPathSum);

function findLargestSumPath(array1, matrix) {
  const visited = Array(array1.length).fill(false);
  let maxSum = 0;

  function dfs(node, currentSum) {
    visited[node] = true;
    currentSum += array1[node];

    if (currentSum > maxSum) {
      maxSum = currentSum;
    }

    for (let neighbor = 0; neighbor < array1.length; neighbor++) {
      if (matrix[node][neighbor] === 1 && !visited[neighbor]) {
        dfs(neighbor, currentSum);
      }
    }

    visited[node] = false; // Backtrack to explore other paths
  }

  for (let i = 0; i < array1.length; i++) {
    dfs(i, 0);
  }

  return maxSum;
}

///////////////// Finding the largest SUM path ////////////

// const array1 = [5,3,9,14,2,6];
// const matrix = [
//   [0, 1, 1, 0, 0, 0],
//   [0, 0, 0, 1, 1, 0],
//   [0, 0, 0, 0, 1, 1],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0]
// ];

// const result = findLargestSumPath(array1, matrix);
// console.log("Largest sum of the path:", result.sum);
// console.log("Largest sum path:", result.path);

// function findLargestSumPath(array1, matrix) {
//   const visited = Array(array1.length).fill(false);
//   let maxSum = 0;
//   let currentPath = [];
//   let maxPath = [];

//   function dfs(node, currentSum, path) {
//     visited[node] = true;
//     currentSum += array1[node];
//     path.push(node);

//     if (currentSum > maxSum) {
//       maxSum = currentSum;
//       maxPath = path.slice(); // Copy the current path
//     }

//     for (let neighbor = 0; neighbor < array1.length; neighbor++) {
//       if (matrix[node][neighbor] === 1 && !visited[neighbor]) {
//         dfs(neighbor, currentSum, path);
//       }
//     }

//     visited[node] = false; // Backtrack to explore other paths
//     path.pop(); // Remove the current node from the path
//   }

//   for (let i = 0; i < array1.length; i++) {
//     dfs(i, 0, []);
//   }

//   return { sum: maxSum, path: maxPath };
// }


