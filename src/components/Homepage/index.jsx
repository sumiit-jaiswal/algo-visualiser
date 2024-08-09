import React from "react";
import { Link } from "react-router-dom";
import "./style.scss";

const Home = () => {
  return (
    <div className="home">
      <div className="intro">
        <h1>Welcome to Algo Visualiser</h1>
        <p>
          Algo Visualiser is your go-to platform for visualizing various
          algorithms. Whether you're learning or teaching algorithms, our
          interactive visualizations will help you understand complex concepts
          with ease. Explore different types of algorithms through our engaging
          and informative visualizers.
        </p>
      </div>

      <div className="sections">
        <div className="section">
          <h2>Searching Algorithms</h2>
          <p>
            Discover and visualize different searching algorithms such as Linear
            Search, Binary Search, and more. Understand how these algorithms
            operate step-by-step and compare their efficiency.
          </p>
          <Link to="/searching" className="link">
            Explore Searching Algorithms
          </Link>
        </div>

        <div className="section">
          <h2>Sorting Algorithms</h2>
          <p>
            Explore sorting algorithms like Bubble Sort, Selection Sort, and
            Insertion Sort. See how these algorithms sort data and learn about
            their performance and applications.
          </p>
          <Link to="/sorting" className="link">
            Explore Sorting Algorithms
          </Link>
        </div>

        <div className="section">
          <h2>Graphs Algorithms</h2>
          <p>
            Dive into graph algorithms including Dijkstra's Algorithm and more.
            Understand how these algorithms work on graph data structures and
            their real-world applications.
          </p>
          <Link to="/graphs" className="link">
            Explore Graphs Algorithms
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
