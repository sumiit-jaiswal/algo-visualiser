import React, { useState } from "react";
import "./style.scss";

const numRows = 30;
const numCols = 30;

const Graph = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [isAddingBlockage, setIsAddingBlockage] = useState(false);
  const [isSettingWeight, setIsSettingWeight] = useState(false);
  const [weight, setWeight] = useState(1);
  const [shortestPath, setShortestPath] = useState([]);
  const [searchNodes, setSearchNodes] = useState([]);
  const [isSettingStart, setIsSettingStart] = useState(false);
  const [isSettingEnd, setIsSettingEnd] = useState(false);

  function createEmptyGrid() {
    return Array.from({ length: numRows }, () =>
      Array.from({ length: numCols }, () => "empty")
    );
  }

  const handleNodeClick = (row, col) => {
    const newGrid = grid.map((row) => row.slice());

    if (isAddingBlockage) {
      newGrid[row][col] =
        newGrid[row][col] === "blockage" ? "empty" : "blockage";
    } else if (isSettingWeight) {
      newGrid[row][col] = { type: "weight", value: weight };
    } else if (isSettingStart) {
      if (startNode) {
        newGrid[startNode[0]][startNode[1]] = "empty";
      }
      newGrid[row][col] = "start";
      setStartNode([row, col]);
      setIsSettingStart(false); // Stop setting start node after selecting it
    } else if (isSettingEnd) {
      if (endNode) {
        newGrid[endNode[0]][endNode[1]] = "empty";
      }
      newGrid[row][col] = "end";
      setEndNode([row, col]);
      setIsSettingEnd(false); // Stop setting end node after selecting it
    }

    setGrid(newGrid);
  };

  const handleBlockageToggle = () => setIsAddingBlockage((prev) => !prev);
  const handleWeightToggle = () => setIsSettingWeight((prev) => !prev);
  const handleStartNodeClick = () => {
    setIsSettingStart(true);
    setIsSettingEnd(false); // Disable setting end node when setting start node
  };
  const handleEndNodeClick = () => {
    setIsSettingEnd(true);
    setIsSettingStart(false); // Disable setting start node when setting end node
  };

  const runDijkstra = async () => {
    console.log("startNode:", startNode, "endNode:", endNode);
    if (!startNode || !endNode) {
      console.log("Start or end node is missing. Exiting function.");
      return;
    }
    console.log(
      "Both startNode and endNode are set. Continuing with Dijkstra..."
    );
    const { path, searchNodes } = await dijkstra(grid, startNode, endNode);
    setShortestPath(path);

    // Temporarily show the search nodes, then clear them after a short delay
    setSearchNodes(searchNodes);
    await new Promise((r) => setTimeout(r, 1000)); // Wait for 1 second to visualize the search nodes
    setSearchNodes([]); // Clear the search nodes after the visualization
  };

  const dijkstra = async (grid, start, end) => {
    const directions = [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ];
    const distances = Array.from({ length: numRows }, () =>
      Array(numCols).fill(Infinity)
    );
    const previousNodes = Array.from({ length: numRows }, () =>
      Array(numCols).fill(null)
    );
    const pq = new PriorityQueue();
    const path = [];
    const searchNodes = new Set();

    distances[start[0]][start[1]] = 0;
    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
      const {
        node: [row, col],
      } = pq.dequeue();
      searchNodes.add(`${row}-${col}`);

      if (row === end[0] && col === end[1]) {
        let current = end;
        while (current) {
          path.unshift(current);
          current = previousNodes[current[0]][current[1]];
        }
        break;
      }

      for (const [dr, dc] of directions) {
        const newRow = row + dr;
        const newCol = col + dc;
        if (isValid(newRow, newCol)) {
          const newDist = distances[row][col] + getWeight(grid[newRow][newCol]);
          if (newDist < distances[newRow][newCol]) {
            distances[newRow][newCol] = newDist;
            previousNodes[newRow][newCol] = [row, col];
            pq.enqueue([newRow, newCol], newDist);
          }
        }
      }

      setSearchNodes(Array.from(searchNodes));
      await new Promise((r) => setTimeout(r, 100)); // Delay for visualization
    }

    return { path, searchNodes: Array.from(searchNodes) };
  };
  const resetGrid = () => {
    setGrid(createEmptyGrid());
    setStartNode(null);
    setEndNode(null);
    setShortestPath([]);
    setSearchNodes([]);
    // setMode(null);
  };

  const isValid = (row, col) =>
    row >= 0 &&
    row < numRows &&
    col >= 0 &&
    col < numCols &&
    grid[row][col] !== "blockage";

  const getWeight = (node) => (node.type === "weight" ? node.value : 1);

  const renderGrid = () => {
    return grid.map((row, rowIndex) =>
      row.map((node, colIndex) => {
        const isStart = node === "start";
        const isEnd = node === "end";

        return (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`node ${
              isStart
                ? "start"
                : isEnd
                ? "end"
                : node === "blockage"
                ? "blockage"
                : node.type === "weight"
                ? "weight"
                : "empty"
            } ${
              !isStart &&
              !isEnd &&
              shortestPath.some((n) => n[0] === rowIndex && n[1] === colIndex)
                ? "path"
                : ""
            } ${
              !isStart &&
              !isEnd &&
              searchNodes.some((n) => n === `${rowIndex}-${colIndex}`)
                ? "search"
                : ""
            }`}
            onClick={() => handleNodeClick(rowIndex, colIndex)}
          >
            {node.type === "weight" ? node.value : ""}
          </div>
        );
      })
    );
  };

  return (
    <div className="graph">
      <div className="controls">
        <button onClick={handleBlockageToggle} className="blockage-btn">
          {isAddingBlockage ? "Stop Adding Blockage" : "Add Blockage"}
        </button>
        <button onClick={handleWeightToggle} className="weight-btn">
          {isSettingWeight ? "Stop Setting Weight" : "Set Weight"}
        </button>
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(Number(e.target.value))}
          disabled={!isSettingWeight}
          placeholder="Weight"
          min="0"
        />
        <button onClick={handleStartNodeClick} className="start-btn">
          {isSettingStart ? "Stop Setting Start Node" : "Set Start Node"}
        </button>
        <button onClick={handleEndNodeClick} className="end-btn">
          {isSettingEnd ? "Stop Setting End Node" : "Set End Node"}
        </button>
        <button onClick={runDijkstra} className="run-btn">
          Run Dijkstra
        </button>
        <button onClick={resetGrid} className="reset-btn">
          Reset
        </button>
      </div>
      <div className="grid">{renderGrid()}</div>
    </div>
  );
};

// Priority Queue for Dijkstra's Algorithm
class PriorityQueue {
  constructor() {
    this.nodes = [];
  }

  enqueue(node, priority) {
    this.nodes.push({ node, priority });
    this.nodes.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.nodes.shift();
  }

  isEmpty() {
    return this.nodes.length === 0;
  }
}

export default Graph;
