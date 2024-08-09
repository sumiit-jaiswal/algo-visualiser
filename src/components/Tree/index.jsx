import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

// Tree Node Definition
class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Random Tree Generator
const generateRandomTree = (nodes) => {
  if (nodes === 0) return null;

  const root = new TreeNode(1);
  const queue = [root];
  let currentNode = root;

  for (let i = 2; i <= nodes; i++) {
    let node = new TreeNode(i);
    let parentNode = queue[0];

    if (!parentNode.left) {
      parentNode.left = node;
    } else if (!parentNode.right) {
      parentNode.right = node;
      queue.shift(); // Move to next parent when current parent has both children
    }

    queue.push(node);
  }

  return root;
};

// Traversal Algorithms
const inorderTraversal = (node, result = []) => {
  if (!node) return result;
  inorderTraversal(node.left, result);
  result.push(node);
  inorderTraversal(node.right, result);
  return result;
};

const preorderTraversal = (node, result = []) => {
  if (!node) return result;
  result.push(node);
  preorderTraversal(node.left, result);
  preorderTraversal(node.right, result);
  return result;
};

const postorderTraversal = (node, result = []) => {
  if (!node) return result;
  postorderTraversal(node.left, result);
  postorderTraversal(node.right, result);
  result.push(node);
  return result;
};

const levelOrderTraversal = (node) => {
  if (!node) return [];
  const result = [];
  const queue = [node];

  while (queue.length) {
    const level = [];
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const current = queue.shift();
      level.push(current);
      if (current.left) queue.push(current.left);
      if (current.right) queue.push(current.right);
    }

    result.push(level);
  }

  return result;
};

// Tree Visualization Component
const BinaryTree = () => {
  const [numNodes, setNumNodes] = useState(10);
  const [tree, setTree] = useState(null);
  const [traversalOrder, setTraversalOrder] = useState([]);
  const [traversalName, setTraversalName] = useState("Inorder");
  const [isTraversing, setIsTraversing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    const newTree = generateRandomTree(numNodes);
    setTree(newTree);
    setTraversalOrder([]);
    setCurrentIndex(0);
    clearInterval(intervalRef.current);
  }, [numNodes]);

  useEffect(() => {
    if (!tree) return;
    let traversalNodes = [];
    switch (traversalName) {
      case "Inorder":
        traversalNodes = inorderTraversal(tree);
        break;
      case "Preorder":
        traversalNodes = preorderTraversal(tree);
        break;
      case "Postorder":
        traversalNodes = postorderTraversal(tree);
        break;
      case "Level Order":
        traversalNodes = levelOrderTraversal(tree).flat();
        break;
      default:
        break;
    }
    setTraversalOrder(traversalNodes);
  }, [tree, traversalName]);

  const startTraversal = () => {
    setIsTraversing(true);
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= traversalOrder.length - 1) {
          clearInterval(intervalRef.current);
          setIsTraversing(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // Adjust speed as needed
  };

  const stopTraversal = () => {
    setIsTraversing(false);
    clearInterval(intervalRef.current);
  };

  const renderNode = (node, index) => {
    return (
      <div
        key={node.value}
        className={`node ${index === currentIndex ? "highlight" : ""}`}
      >
        {node.value}
      </div>
    );
  };

  // Function to render the tree structure visually
  const renderTree = (node, depth = 0) => {
    if (!node) return null;
    return (
      <div className="node-container">
        {renderNode(node, traversalOrder.indexOf(node))}
        <div className="children">
          {node.left && (
            <div className="child-container">
              {renderTree(node.left, depth + 1)}
            </div>
          )}
          {node.right && (
            <div className="child-container">
              {renderTree(node.right, depth + 1)}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="tree-container">
      <header>
        <h1>Binary Tree Visualization</h1>
      </header>

      <div className="controls">
        <div className="slider-container">
          <label htmlFor="numNodes">Number of Nodes:</label>
          <input
            type="range"
            id="numNodes"
            min="1"
            max="50"
            value={numNodes}
            onChange={(e) => setNumNodes(Number(e.target.value))}
          />
          <span>{numNodes}</span>
        </div>
        <div className="traversal-selector">
          <label htmlFor="traversal">Select Traversal:</label>
          <select
            id="traversal"
            value={traversalName}
            onChange={(e) => setTraversalName(e.target.value)}
          >
            <option value="Inorder">Inorder</option>
            <option value="Preorder">Preorder</option>
            <option value="Postorder">Postorder</option>
            <option value="Level Order">Level Order</option>
          </select>
        </div>
        <div className="control-buttons">
          <button onClick={startTraversal} disabled={isTraversing}>
            Start
          </button>
          <button onClick={stopTraversal} disabled={!isTraversing}>
            Stop
          </button>
        </div>
      </div>

      <div className="tree-visualization">{tree && renderTree(tree)}</div>
    </div>
  );
};

export default BinaryTree;
