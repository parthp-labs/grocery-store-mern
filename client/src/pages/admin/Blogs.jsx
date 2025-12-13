import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReactSelect from "react-select";

import { faAdd, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import BlogTableComponent from "../../components/admin/BlogTableComponent";
import Loader from "../../components/Loader";
import useRequestHandler from "../../hooks/useRequestHandler";

import {
  useGetAllBlogsQuery,
  useLazyGetAllBlogsQuery,
  useRemoveBlogMutation,
} from "../../redux/api/blogsApi";

function Blogs() {
  const [blogId, setBlogId] = useState();
  const [blogTitle, setBlogTitle] = useState();
  const [selectedBlogTag, setSelectedBlogTag] = useState();
  const [blogTags, setBlogTags] = useState([]);
  const [blogsList, setBlogsList] = useState([]);

  const navigate = useNavigate();

  const { data: blogTagsQuery } = useGetAllBlogsQuery({});
  const { data, isLoading, isError } = useGetAllBlogsQuery({
    blogId,
    blogTag: selectedBlogTag,
    blogTitle,
  });
  const [triggerGetAllBlogs] = useLazyGetAllBlogsQuery();

  const [removeBlog] = useRemoveBlogMutation();
  const { triggerMutationFunc: removeBlogHandler } = useRequestHandler({
    mutationFunc: (blogId) => removeBlog(blogId),
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => triggerGetAllBlogs({}),
  });

  const resetFilter = () => {
    setBlogTags("");
    setBlogTitle("");
    setBlogId("");
  };

  useEffect(() => {
    if (data) {
      setBlogsList(data.blog);
    }
    if (isError) {
      setBlogsList([]);
    }
  }, [data, isError]);

  useEffect(() => {
    if (blogTagsQuery) {
      const tempTags = [
        {
          value: "",
          label: "All",
        },
      ];
      setBlogTags([]);

      console.log(blogTagsQuery);
      blogTagsQuery.blog.forEach((i) => {
        i.tags.forEach((tag) => {
          const tagData = {
            label: tag.replace(tag[0], tag[0].toUpperCase()),
            value: tag,
          };

          if (!tempTags.includes(tagData)) tempTags.push(tagData);
        });
      });

      setBlogTags(tempTags);
    }
  }, [blogTagsQuery]);

  return (
    <>
      <button className="site-btn" onClick={resetFilter}>
        <i>
          <FontAwesomeIcon icon={faRefresh} />
        </i>
        Reset Filters
      </button>
      <button className="site-btn">
        <i>
          <FontAwesomeIcon icon={faAdd} />
        </i>
        Add New Blog
      </button>
      <div className="admin__blogs__filter">
        <div className="filter__input">
          <label>Id</label>
          <input
            placeholder="Enter blog id"
            value={blogId}
            onChange={(e) => setBlogId(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Blog Title</label>
          <input
            placeholder="Enter blog title"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Tag</label>
          <ReactSelect
            options={blogTags}
            value={selectedBlogTag}
            onChange={(e) => setSelectedBlogTag(e.value)}
          />
        </div>
      </div>

      <table className="admin__blogs__table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Blog Title</th>
            <th>Added On</th>
            <th>Tags</th>
            <th>Comments</th>
            <th>Likes</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <Loader />
          ) : (
            blogsList.map((i) => (
              <BlogTableComponent
                key={i._id}
                blogId={i._id}
                title={i.title}
                tags={i.tags}
                addedOn={i.createdOn}
                commentsCount={i.comments.length}
                likesCount={i.likes.length}
                editBlogHandler={() =>
                  navigate(`/admin/blogs/edit?id=${i._id}`)
                }
                removeBlogHandler={() => {
                  removeBlogHandler(i._id);
                }}
              />
            ))
          )}
        </tbody>
      </table>
    </>
  );
}

export default Blogs;
