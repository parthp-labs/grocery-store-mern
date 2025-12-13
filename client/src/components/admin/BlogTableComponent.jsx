import React from "react";
import { formatDate } from "../utils/utilityFunctions";
import AdminActionMenu from "../ActionMenu";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";

function BlogTableComponent({
  blogId,
  title,
  addedOn,
  commentsCount,
  likesCount,
  tags,
  removeBlogHandler,
  editBlogHandler,
}) {
  return (
    <>
      <tr>
        <td>{blogId}</td>
        <td>{title}</td>
        <td>{formatDate(addedOn)}</td>
        <td>{tags.map((tag) => tag + ", ")}</td>
        <td>{commentsCount}</td>
        <td>{likesCount}</td>
        <td>
          {" "}
          <AdminActionMenu
            menuItems={[
              {
                label: "Edit Blog",
                icon: faPenToSquare,
                onClickHandler: editBlogHandler,
              },
              {
                label: "Delete blog",
                icon: faTrash,
                onClickHandler: removeBlogHandler,
              },
            ]}
          />
        </td>
      </tr>
    </>
  );
}

export default BlogTableComponent;
