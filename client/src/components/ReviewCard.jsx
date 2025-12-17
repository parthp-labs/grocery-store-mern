import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

function ReviewCard() {
  return (
    <div className="product__review">
      <div className="product__review__details">
        <div className="product__review__user">
          <img
            src="http://xsgames.co/randomusers/avatar.php?g=male"
            className="product__review__img"
          />
          <h6>John Doe</h6>
        </div>
        <div className="product__review__ratings">
          <i>
            <FontAwesomeIcon icon={faStar} />
          </i>
          <i>
            <FontAwesomeIcon icon={faStar} />
          </i>
          <i>
            <FontAwesomeIcon icon={faStar} />
          </i>
          <i>
            <FontAwesomeIcon icon={faStar} />
          </i>
          <i>
            <FontAwesomeIcon icon={faStar} />
          </i>
        </div>
      </div>
      <p className="product__review__text">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quis, neque
        dolores voluptatum recusandae sunt quibusdam culpa veniam quos, quod
        obcaecati pariatur omnis laborum cumque minima odit mollitia cupiditate!
        Eligendi, delectus.
      </p>
    </div>
  );
}

export default ReviewCard;
