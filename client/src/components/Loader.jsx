import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Loader({ isLoading, darkBg = true }) {
  return (
    <>
      <div
        id="preloader"
        className={`${isLoading ? "show" : "hide"} ${
          darkBg ? "darkloaderbg" : ""
        }`}
      >
        <div className="loader"></div>
      </div>
    </>
  );
}

export default Loader;
