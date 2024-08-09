import React from "react";
import { useNavigate } from "react-router-dom";
import "./style.scss";

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="header">
      <div
        className="title"
        onClick={() => {
          navigate("/");
        }}
      >
        Algo Visualiser
      </div>
      <div className="sections">
        <button onClick={() => navigate("/searching")}>Searching</button>
        <button onClick={() => navigate("/sorting")}>Sorting</button>
        {/* <button onClick={() => navigate("/tree-traversal")}>Tree</button> */}
        <button onClick={() => navigate("/graph-traversal")}>Graphs</button>
      </div>
    </div>
  );
};

export default Header;
