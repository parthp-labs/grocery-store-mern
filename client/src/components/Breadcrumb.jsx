import React, { useEffect } from "react";

import breadcrumbImage from "../assets/breadcrumb.jpg";

import $ from "jquery";
import { Link } from "react-router-dom";

function Breadcrumb({
  destination,
  parentDestination = "Home",
  parentDestinationLink = "/",
}) {
  useEffect(() => {
    $(".set-bg").each(function () {
      var bg = $(this).data("setbg");
      $(this).css("background-image", "url(" + bg + ")");
    });
  }, []);
  return (
    <>
      {/* <!-- Breadcrumb Section Begin --> */}
      <section
        className="breadcrumb-section set-bg"
        data-setbg={breadcrumbImage}
      >
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="breadcrumb__text">
                <h2>{destination}</h2>
                <div className="breadcrumb__option">
                  <Link to={parentDestinationLink}>{parentDestination}</Link>
                  <span>{destination}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Breadcrumb Section End --> */}
    </>
  );
}

export default Breadcrumb;
