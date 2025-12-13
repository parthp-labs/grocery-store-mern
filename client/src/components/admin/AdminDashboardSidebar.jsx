import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { NavLink } from "react-router-dom";

import {
  faBlog,
  faBowlFood,
  faDashboard,
  faExpand,
  faFileInvoice,
  faPenToSquare,
  faPlusSquare,
  faToggleOff,
  faToggleOn,
  faTruckFast,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";

const menuItemStyles = {
  icon: ({ level }) => {
    if (level === 0) return { color: "#249bc8", fontSize: "20px" };
  },
  label: ({ level }) => {
    if (level === 0)
      return {
        fontWeight: 600,
        fontSize: "16px",
        letterSpacing: "0.4px",
        color: "#404040",
      };
  },
  button: {
    margin: "20px 0px",
    transition: "all 0.2s",
    [`&.active`]: {
      backgroundColor: "#e1e1e1",
      borderRadius: "5px",
    },
  },
};

const menuRootStyles = {
  padding: "0px 0px",
};

function MenuHeader({ text, isCollapsed }) {
  return (
    <h3
      className={`sidebar__menu__header ${
        isCollapsed ? "toggled-on" : "toggled-off"
      }`}
    >
      {text}
    </h3>
  );
}

function AdminDashboardSidebar({
  isCollapsed,
  isToggled,
  collapseSidebar,
  toggleSidebar,
  setBroken,
}) {
  return (
    <>
      <Sidebar
        className={
          "admin__dashboard__sidebar " + (!isCollapsed && "sidebar-opened")
        }
        collapsed={isCollapsed}
        toggled={isToggled}
        onBreakPoint={setBroken}
        onBackdropClick={() => toggleSidebar(false)}
        breakPoint="md"
      >
        <MenuHeader text={"Dashboard"} isCollapsed={isCollapsed} />

        <Menu menuItemStyles={menuItemStyles} rootStyles={menuRootStyles}>
          <button
            className={`sidebar__toggle ${
              isCollapsed ? "toggled-on" : "toggled-off"
            }`}
            onClick={() => collapseSidebar(!isCollapsed)}
          >
            {isCollapsed ? (
              <FontAwesomeIcon icon={faToggleOn} />
            ) : (
              <FontAwesomeIcon icon={faToggleOff} />
            )}
          </button>
          <MenuItem
            component={<NavLink to="/admin/dashboard" />}
            icon={<FontAwesomeIcon icon={faDashboard} />}
          >
            Dashboard
          </MenuItem>
          <MenuItem
            component={<NavLink to="/admin/users" />}
            icon={<FontAwesomeIcon icon={faUserAlt} />}
          >
            Users
          </MenuItem>
          <MenuItem
            component={<NavLink to="/admin/items" />}
            icon={<FontAwesomeIcon icon={faBowlFood} />}
          >
            Items
          </MenuItem>
          <MenuItem
            component={<NavLink to="/admin/orders" />}
            icon={<FontAwesomeIcon icon={faFileInvoice} />}
          >
            Orders
          </MenuItem>
          {/* <MenuItem
            component={<NavLink to="/admin/blogs" />}
            icon={<FontAwesomeIcon icon={faBlog} />}
          >
            Blogs
          </MenuItem> */}
        </Menu>

        <MenuHeader text={"Items"} isCollapsed={isCollapsed} />
        <Menu menuItemStyles={menuItemStyles} rootStyles={menuRootStyles}>
          <MenuItem
            component={<NavLink to="/admin/items/new" />}
            icon={
              <>
                <FontAwesomeIcon icon={faPlusSquare} />
                <FontAwesomeIcon
                  icon={faBowlFood}
                  className="menu__item__icon"
                />
              </>
            }
          >
            Add New Item
          </MenuItem>
          <MenuItem
            // component={<NavLink to="/admin/items/" />}
            icon={
              <>
                <FontAwesomeIcon icon={faPenToSquare} />
                <FontAwesomeIcon
                  icon={faBowlFood}
                  className="menu__item__icon"
                />
              </>
            }
          >
            Edit Item
          </MenuItem>
        </Menu>

        <MenuHeader text={"Orders"} isCollapsed={isCollapsed} />
        <Menu menuItemStyles={menuItemStyles} rootStyles={menuRootStyles}>
          <MenuItem
            component={<NavLink to={`/admin/orders/view/`} />}
            icon={
              <>
                <FontAwesomeIcon icon={faFileInvoice} />
                <FontAwesomeIcon icon={faExpand} className="menu__item__icon" />
              </>
            }
          >
            View Order
          </MenuItem>
          <MenuItem
            component={<NavLink to={`/admin/orders/process/`} />}
            icon={
              <>
                <FontAwesomeIcon icon={faFileInvoice} />
                <FontAwesomeIcon
                  icon={faTruckFast}
                  className="menu__item__icon"
                />
              </>
            }
          >
            Process Order
          </MenuItem>
        </Menu>

        {/* <MenuHeader text={"Blogs"} isCollapsed={isCollapsed} />
        <Menu menuItemStyles={menuItemStyles} rootStyles={menuRootStyles}>
          <MenuItem
            component={<NavLink to="/admin/blogs/view" />}
            icon={
              <>
                <FontAwesomeIcon icon={faBlog} />
                <FontAwesomeIcon icon={faExpand} className="menu__item__icon" />
              </>
            }
          >
            View Blog
          </MenuItem>
          <MenuItem
            component={<NavLink to="/admin/blogs/new" />}
            icon={
              <>
                <FontAwesomeIcon icon={faBlog} />
                <FontAwesomeIcon
                  icon={faPlusSquare}
                  className="menu__item__icon"
                />
              </>
            }
          >
            Add New Blog
          </MenuItem>
          <MenuItem
            component={<NavLink to="/admin/blogs/edit" />}
            icon={
              <>
                <FontAwesomeIcon icon={faBlog} />
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  className="menu__item__icon"
                />
              </>
            }
          >
            Edit Blog
          </MenuItem> 
        </Menu>*/}
      </Sidebar>
    </>
  );
}

export default AdminDashboardSidebar;
