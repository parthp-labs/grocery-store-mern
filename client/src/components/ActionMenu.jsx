import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";

function ActionMenu({ menuItems = [] }) {
  const menuRef = useRef();

  const showMenu = () => {
    menuRef.current.classList.add("active");

    document.addEventListener("mousedown", (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        menuRef.current.classList.remove("active");
      }
    });
  };

  return (
    <div className="admin__action__menu__container">
      <button className="admin__action__button" onClick={showMenu}>
        <FontAwesomeIcon icon={faBars} />
      </button>
      <div className="admin__action__menu" ref={menuRef}>
        {menuItems.map((item) => (
          <button
            className="admin__action__menu__item"
            key={Math.random() * 1000}
            onClick={item.onClickHandler}
          >
            <i>
              <FontAwesomeIcon icon={item.icon} />
            </i>
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ActionMenu;
