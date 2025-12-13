import React from "react";
import { Link } from "react-router-dom";

import {
  faArrowRight,
  faCalendar,
  faComment,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";

function BlogCard({
  blogId,
  image = "",
  title = "",
  description = "",
  postedOn,
  commentsCount = 0,
}) {
  return (
    <div className="blog__item">
      <div className="blog__item__pic">
        <img src={image} alt="" />
      </div>
      <div className="blog__item__text">
        <ul>
          <li>
            <i>
              <FontAwesomeIcon icon={faCalendar} />
            </i>
            {new Date(postedOn).toLocaleDateString()}
          </li>
          <li>
            <i>
              <FontAwesomeIcon icon={faComment} />
            </i>
            {commentsCount}
          </li>
        </ul>
        <h5>
          <a href="#">{title}</a>
        </h5>
        <div className="blog__item__body">
          {parse(description.slice(0, 130) + "...")}
        </div>

        <Link to={`/blogs/${blogId}`} className="blog__btn">
          READ MORE
          <span>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default BlogCard;
