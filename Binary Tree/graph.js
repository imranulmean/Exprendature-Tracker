const array1 = [1,2,3,-4,-5,-6];
const matrix = [
  [0, 1, 1, 0, 0, 0],
  [0, 0, 0, 1, 1, 0],
  [0, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]
];

const maxPathSum = findLargestSumPath(array1, matrix);
console.log("Largest sum of the path:", maxPathSum);

function findLargestSumPath(array1, matrix) {
  const visited = Array(array1.length).fill(false);
  let maxSum = -Infinity;

  function dfs(node, currentSum, path) {
    visited[node] = true;
    currentSum += array1[node];
    path.push(node);

    if (currentSum > maxSum && matrix[node].every((val) => val === 0)) {
      maxSum = currentSum;
    //   console.log("Path:", path.slice(), "Sum:", maxSum);
    }

    for (let neighbor = 0; neighbor < array1.length; neighbor++) {
      if (matrix[node][neighbor] === 1 && !visited[neighbor]) {
        dfs(neighbor, currentSum, path);
      }
    }

    visited[node] = false; // Backtrack to explore other paths
    path.pop(); // Remove the current node from the path
  }

  for (let i = 0; i < array1.length; i++) {
    dfs(i, 0, []);
  }
  return maxSum;
}