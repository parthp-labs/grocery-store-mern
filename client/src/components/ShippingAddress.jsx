import { event } from "jquery";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

function ShippingAddress({
  houseNumber,
  streetInfo,
  city,
  state,
  pinCode,
  onClickHandler = () => {},
  selectable,
  deletable,
  isActive,
  onDeleteHandler = () => {},
}) {
  return (
    <div className="delivery__address__item">
      <div className="shipping__address" onClick={onClickHandler}>
        {selectable && (
          <input
            type="radio"
            checked={isActive && true}
            name="selected-address"
            readOnly
          />
        )}

        <p>{houseNumber}</p>
        <p>{streetInfo}</p>
        <p>
          {city}, {pinCode}
        </p>
        <p>{state}</p>
      </div>
      {deletable && (
        <button
          className="shipping__address__delete__btn"
          onClick={onDeleteHandler}
          type="button"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      )}
    </div>
  );
}

export default ShippingAddress;
