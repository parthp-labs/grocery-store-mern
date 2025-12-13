import React from "react";

import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import ActionMenu from "../ActionMenu";

function ItemsTableComponent({
  id,
  name,
  image,
  originalPrice,
  finalPrice,
  stock,
  categories,
  removeItemHandler,
  editItemHandler,
}) {
  return (
    <>
      <tr>
        <td>{id}</td>
        <td>
          <img src={image} alt="" />
        </td>
        <td>{name}</td>
        <td>Rs. {originalPrice}</td>
        <td>Rs. {finalPrice}</td>
        <td>{stock}</td>
        <td>
          {categories?.map(
            (cat) => cat.replace(cat[0], cat[0].toUpperCase()) + ", "
          )}
        </td>
        <td>
          <ActionMenu
            menuItems={[
              {
                label: "Edit item",
                icon: faPenToSquare,
                onClickHandler: editItemHandler,
              },
              {
                label: "Delete item",
                icon: faTrash,
                onClickHandler: removeItemHandler,
              },
            ]}
          />
        </td>
      </tr>
    </>
  );
}

export default ItemsTableComponent;
