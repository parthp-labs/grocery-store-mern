import React from "react";
import ActionMenu from "../ActionMenu";

import { faUserAltSlash, faUserCheck } from "@fortawesome/free-solid-svg-icons";

function UserTableComponent({
  id,
  name,
  gender,
  email,
  role,
  deleteUserHandler,
  makeAdminHandler,
}) {
  return (
    <tr>
      <td>{id}</td>
      <td>{name}</td>
      <td>{gender.replace(gender[0], gender[0].toUpperCase())}</td>
      <td>{email}</td>
      <td>{role.replace(role[0], role[0].toUpperCase())}</td>
      <td>
        <ActionMenu
          menuItems={[
            {
              label: "Make Admin",
              icon: faUserCheck,
              onClickHandler: makeAdminHandler,
            },
            {
              label: "Remove User",
              icon: faUserAltSlash,
              onClickHandler: deleteUserHandler,
            },
          ]}
        />
      </td>
    </tr>
  );
}

export default UserTableComponent;
