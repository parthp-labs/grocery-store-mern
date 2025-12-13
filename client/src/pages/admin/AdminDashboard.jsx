import React, { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import AdminDashboardSidebar from "../../components/admin/AdminDashboardSidebar";
import { Outlet } from "react-router-dom";
import Breadcrumb from "../../components/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function AdminDashboard() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);
  const [broken, setBroken] = useState(false);
  const [toggleSidebar, setToggleSidebar] = useState(false);

  return (
    <>
      <Breadcrumb destination={"Admin Dashboard"} />
      <div className="container-fluid px-1 ">
        <div className="admin__dashboard__container">
          <AdminDashboardSidebar
            isCollapsed={isSidebarCollapsed}
            collapseSidebar={setIsSidebarCollapsed}
            isToggled={toggleSidebar}
            toggleSidebar={setToggleSidebar}
            setBroken={setBroken}
          />
          <div className="admin__dashboard__contents">
            {broken && (
              <button
                className="md__toggle__sidebar__button"
                onClick={() => setToggleSidebar(true)}
              >
                Open Sidebar
                <FontAwesomeIcon icon={faBars} />
              </button>
            )}
            <div className="admin__dashboard__panel__content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
