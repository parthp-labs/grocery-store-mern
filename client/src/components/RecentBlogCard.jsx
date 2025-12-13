import React from "react";
import { Link } from "react-router-dom";

import { formatDate } from "./utils/utilityFunctions";

function RecentBlogCard({ link, blogImage, blogTitle, postedOn }) {
  return (
    <>
      <Link to={link} className="blog__sidebar__recent__item">
        <div className="blog__sidebar__recent__item__pic">
          <img src={blogImage} alt="" />
        </div>
        <div className="blog__sidebar__recent__item__text">
          <h6>{blogTitle}</h6>
          <span>{formatDate(postedOn)}</span>
        </div>
      </Link>
    </>
  );
}

export default RecentBlogCard;
