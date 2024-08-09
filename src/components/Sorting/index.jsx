import React, { useState, useEffect, useRef } from "react";
import "./style.scss";

const Sorting = () => {
  const [algorithm, setAlgorithm] = useState("Bubble Sort");
  const [arraySize, setArraySize] = useState(50);
  const [array, setArray] = useState([]);
  const [isSorting, setIsSorting] = useState(false);
  const stopSortingRef = useRef(false);

  const algorithms = [
    "Bubble Sort",
    "Selection Sort",
    "Insertion Sort",
    "Quick Sort",
    "Merge Sort",
  ];

  useEffect(() => {
    generateArray();
  }, [arraySize]);

  const generateArray = () => {
    const newArray = Array.from({ length: arraySize }, () =>
      Math.floor(Math.random() * 100)
    );
    setArray(newArray);
  };

  const handleAlgorithmChange = (e) => {
    setAlgorithm(e.target.value);
  };

  const handleArraySizeChange = (e) => {
    setArraySize(e.target.value);
    generateArray();
  };

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const startSorting = async () => {
    setIsSorting(true);
    stopSortingRef.current = false;

    switch (algorithm) {
      case "Bubble Sort":
        await bubbleSort();
        break;
      case "Selection Sort":
        await selectionSort();
        break;
      case "Insertion Sort":
        await insertionSort();
        break;
      case "Quick Sort":
        await quickSort(array, 0, array.length - 1);
        break;
      case "Merge Sort":
        await mergeSort(array, 0, array.length - 1);
        break;
      default:
        break;
    }

    setIsSorting(false);
  };

  const stopSorting = () => {
    stopSortingRef.current = true;
  };

  const bubbleSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        if (stopSortingRef.current) return;
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          setArray([...arr]);
          await sleep(50);
        }
      }
    }
  };

  const selectionSort = async () => {
    let arr = [...array];
    for (let i = 0; i < arr.length; i++) {
      let minIndex = i;
      for (let j = i + 1; j < arr.length; j++) {
        if (stopSortingRef.current) return; // Check stop flag
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        setArray([...arr]);
        await sleep(50);
      }
    }
  };

  const insertionSort = async () => {
    let arr = [...array];
    for (let i = 1; i < arr.length; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        if (stopSortingRef.current) return;
        arr[j + 1] = arr[j];
        j = j - 1;
        setArray([...arr]);
        await sleep(50);
      }
      arr[j + 1] = key;
      setArray([...arr]);
      await sleep(30);
    }
  };

  const quickSort = async (arr, low, high) => {
    if (low < high) {
      let pi = await partition(arr, low, high);
      await quickSort(arr, low, pi - 1);
      await quickSort(arr, pi + 1, high);
    }
  };

  const partition = async (arr, low, high) => {
    let pivot = arr[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
      if (stopSortingRef.current) return;

      if (arr[j] < pivot) {
        i++;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        setArray([...arr]);
        await sleep(50);
      }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    setArray([...arr]);
    await sleep(50);

    return i + 1;
  };

  const mergeSort = async (arr, l, r) => {
    if (l >= r) {
      return;
    }
    const m = l + Math.floor((r - l) / 2);
    await mergeSort(arr, l, m);
    await mergeSort(arr, m + 1, r);
    await merge(arr, l, m, r);
  };

  const merge = async (arr, l, m, r) => {
    const n1 = m - l + 1;
    const n2 = r - m;

    let L = new Array(n1);
    let R = new Array(n2);

    for (let i = 0; i < n1; i++) L[i] = arr[l + i];
    for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

    let i = 0;
    let j = 0;
    let k = l;

    while (i < n1 && j < n2) {
      if (stopSortingRef.current) return;

      if (L[i] <= R[j]) {
        arr[k] = L[i];
        i++;
      } else {
        arr[k] = R[j];
        j++;
      }
      k++;
      setArray([...arr]);
      await sleep(50);
    }

    while (i < n1) {
      if (stopSortingRef.current) return;

      arr[k] = L[i];
      i++;
      k++;
      setArray([...arr]);
      await sleep(50);
    }

    while (j < n2) {
      if (stopSortingRef.current) return;

      arr[k] = R[j];
      j++;
      k++;
      setArray([...arr]);
      await sleep(50);
    }
  };

  return (
    <div className="sorting-container">
      <header>
        <h1>Sorting Algorithm Visualizer</h1>
      </header>

      <div className="controls">
        <div className="algorithms">
          {algorithms.map((algo, idx) => (
            <button
              key={idx}
              className={algorithm === algo ? "active" : ""}
              onClick={() => setAlgorithm(algo)}
              disabled={isSorting}
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
            disabled={isSorting}
          />
          <span>{arraySize}</span>
        </div>

        <div className="sorting-buttons">
          <button
            className="start-button"
            onClick={startSorting}
            disabled={isSorting}
          >
            Start Sorting
          </button>
          <button
            className="stop-button"
            onClick={stopSorting}
            disabled={!isSorting}
          >
            Stop
          </button>
        </div>
      </div>

      <div className="array-container">
        {array.map((value, index) => (
          <div
            key={index}
            className="array-bar"
            style={{ height: `${value}%` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default Sorting;
