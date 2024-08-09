import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

const Searching = () => {
  const [algorithm, setAlgorithm] = useState("Linear Search");
  const [arraySize, setArraySize] = useState(50);
  const [array, setArray] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [foundIndex, setFoundIndex] = useState(-1);
  const [visitedIndexes, setVisitedIndexes] = useState([]);
  const stopSearchingRef = useRef(false);

  const algorithms = ["Linear Search", "Binary Search"];

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, (_, index) => index + 1);
    setArray(newArray);
    setVisitedIndexes([]);
    setFoundIndex(-1);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleArraySizeChange = (e) => {
    setArraySize(e.target.value);
    generateArray();
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const startSearching = async () => {
    setIsSearching(true);
    setFoundIndex(-1);
    setVisitedIndexes([]);
    stopSearchingRef.current = false;

    switch (algorithm) {
      case "Linear Search":
        await linearSearch();
        break;
      case "Binary Search":
        await binarySearch();
        break;
      default:
        break;
    }

    setIsSearching(false);
  };

  const stopSearching = () => {
    stopSearchingRef.current = true;
  };

  const linearSearch = async () => {
    for (let i = 0; i < array.length; i++) {
      if (stopSearchingRef.current) return;

      setVisitedIndexes((prev) => [...prev, i]);
      if (array[i] === parseInt(searchValue)) {
        setFoundIndex(i);
        return;
      }
      await sleep(200);
    }
  };

  const binarySearch = async () => {
    let left = 0;
    let right = array.length - 1;

    while (left <= right) {
      if (stopSearchingRef.current) return;

      const mid = Math.floor((left + right) / 2);
      setVisitedIndexes((prev) => [...prev, mid]);

      if (array[mid] === parseInt(searchValue)) {
        setFoundIndex(mid);
        return;
      } else if (array[mid] < parseInt(searchValue)) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }

      await sleep(1000);
    }
  };

  return (
    <div className="searching-container">
      <header>
        <h1>Searching Algorithm Visualizer</h1>
      </header>

      <div className="controls">
        <div className="algorithms">
          {algorithms.map((algo, idx) => (
            <button
              key={idx}
              className={algorithm === algo ? "active" : ""}
              onClick={() => setAlgorithm(algo)}
              disabled={isSearching}
            >
              {algo}
            </button>
          ))}
        </div>

        <div className="array-size-slider">
          <label htmlFor="arraySize">Array Size:</label>
          <input
            type="range"
            id="arraySize"
            min="10"
            max="100"
            value={arraySize}
            onChange={handleArraySizeChange}
            disabled={isSearching}
          />
          <span>{arraySize}</span>
        </div>

        <div className="search-input">
          <label htmlFor="searchValue">Search Value:</label>
          <input
            type="number"
            id="searchValue"
            value={searchValue}
            onChange={handleSearchValueChange}
            disabled={isSearching}
          />
        </div>

        <div className="searching-buttons">
          <button onClick={startSearching} disabled={isSearching}>
            Start
          </button>
          <button
            className="stop-button"
            onClick={stopSearching}
            disabled={!isSearching}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="array-container">
        {array.map((value, index) => {
          let className = "array-bar";
          if (visitedIndexes.includes(index)) className += " visited";
          if (foundIndex === index) className += " found";
          if (
            index === visitedIndexes[visitedIndexes.length - 1] &&
            !stopSearchingRef.current
          )
            className += " highlight";
          if (algorithm === "Binary Search" && foundIndex === index)
            className += " final-answer";

          return (
            <div
              key={index}
              className={className}
              style={{ width: "50px", height: "50px" }}
            >
              {value}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Searching;
