import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useEditBlogMutation,
  useGetBlogTagsQuery,
  useLazyGetBlogByIdQuery,
} from "../../redux/api/blogsApi";
import useRequestHandler from "../../hooks/useRequestHandler";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCloudUpload,
  faEdit,
  faMinusSquare,
} from "@fortawesome/free-solid-svg-icons";

import TiptapEditor from "../../components/admin/TiptapEditor";
import ReactSelect from "react-select";
import { toast } from "react-toastify";

function EditBlog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogId, setBlogId] = useState();
  const [blogDetails, setBlogDetails] = useState();
  const [newTag, setNewTag] = useState();
  const [selectedExistingTag, setSelectedExistingTag] = useState();
  const [existingTags, setExistingTags] = useState([]);
  const [blogTags, setBlogTags] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [description, setDescription] = useState("");

  const { data: blogTagsQuery } = useGetBlogTagsQuery();

  const [getBlog] = useLazyGetBlogByIdQuery();
  const { triggerQueryFunc: getBlogHandler } = useRequestHandler({
    queryFunc: (blogId) => getBlog(blogId),
    showToastOnError: true,
    onSuccess: (res) => {
      setBlogDetails(res.blog);
      setBlogTags(res.blog.tags);
      setImagePreview(res.blog.image);
    },
    onError: () => setBlogDetails(),
  });

  const [editBlog] = useEditBlogMutation();
  const { triggerMutationFunc: editBlogHandler } = useRequestHandler({
    mutationFunc: (e) => {
      e.preventDefault();

      const formData = new FormData(e.target);
      formData.set("tags", blogTags);
      formData.set("description", description);
      return editBlog({ blogId, body: formData });
    },
    showToastOnError: true,
    showToastOnSuccess: true,
    successRedirect: "/blogs",
  });

  const addTag = (type) => {
    if (type === "new") {
      if (newTag.trim() === "") {
        toast.error("Please first enter the tag");
      } else {
        if (blogTags.includes(newTag)) {
          toast.info("Tag is already added");
        } else {
          setBlogTags([...blogTags, newTag]);
        }
      }
    } else {
      if (selectedExistingTag.trim() === "") {
        toast.error("Please first enter the tag");
      } else {
        if (blogTags.includes(selectedExistingTag)) {
          toast.info("Tag is already added");
        } else {
          setBlogTags([...blogTags, selectedExistingTag]);
        }
      }
    }
  };

  const removeTag = (e) => {
    const reqIndex = e.target.getAttribute("data-tag-index");

    const temp = [...blogTags];
    temp.splice(parseInt(reqIndex), 1);
    setBlogTags(temp);
  };

  const showImagePreview = (e) => {
    const file = e.target.files[0];
    const src = URL.createObjectURL(file);
    setImagePreview(src);
  };

  useEffect(() => {
    const blogIdFromParam = searchParams.get("id");
    if (blogIdFromParam) {
      setBlogId(blogIdFromParam);
      getBlogHandler(blogIdFromParam);
    }
  }, []);

  useEffect(() => {
    if (blogId) {
      setSearchParams({ id: blogId });
    }
  }, [blogId]);

  useEffect(() => {
    if (blogTagsQuery) {
      const temp = [];
      blogTagsQuery.tags.forEach((tag) => {
        temp.push({
          value: tag,
          label: tag.replace(tag[0], tag[0].toUpperCase()),
        });
      });
      setExistingTags(temp);
    }
  }, [blogTagsQuery]);

  return (
    <>
      <h3 className="admin__dashboard__container__header">Edit Blog</h3>

      <div className="form__field edit__blog__search">
        <label>Blog Id</label>
        <input
          placeholder="Enter blog id to get details and start editing"
          value={blogId}
          onChange={(e) => setBlogId(e.target.value)}
        />
        <button type="button" onClick={() => getBlogHandler(blogId)}>
          Search
        </button>
      </div>

      {blogDetails && (
        <>
          <h4>Blog {blogId}</h4>
          <div>
            <form
              onSubmit={editBlogHandler}
              encType="multipart/form-data"
              className="edit__blog__form md-display-"
            >
              <div className="form__field edit__blog__image__field">
                <div>
                  <label>Blog Image</label>
                  <br />
                  <button type="button">
                    <input
                      placeholder="Enter blog title"
                      type="file"
                      onChange={showImagePreview}
                      multiple={false}
                      name="image"
                    />
                    <FontAwesomeIcon icon={faCloudUpload} /> Upload Image
                  </button>
                </div>
                <img src={imagePreview} />
              </div>
              <div className="form__field kg">
                <label>Title</label>
                <input defaultValue={blogDetails?.title} name="title" />
              </div>
              <div className="form__field">
                <label>Description</label>
                <TiptapEditor
                  content={blogDetails?.description}
                  setHtmlContent={(htmlContent) => setDescription(htmlContent)}
                />
              </div>
              <div className="form__field new__blog__tags">
                <label>Tags</label>
                <div>
                  <input
                    placeholder="Add a new tag"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                  />
                  <button type="button" onClick={() => addTag("new")}>
                    Add
                  </button>
                </div>
                <div>
                  <ReactSelect
                    options={existingTags}
                    onChange={(e) => setSelectedExistingTag(e.value)}
                  />
                  <button type="button" onClick={addTag}>
                    Add
                  </button>
                </div>
                <ul className="new__blog__tags__list">
                  {blogTags.map((tag) => (
                    <li key={Math.random() * 1000}>
                      <i
                        onClick={removeTag}
                        data-tag-index={blogTags.indexOf(tag)}
                      >
                        <FontAwesomeIcon icon={faMinusSquare} />
                      </i>
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="form__buttons">
                <button className="site-btn" type="submit">
                  <i>
                    <FontAwesomeIcon icon={faEdit} />
                  </i>
                  Edit Blog
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default EditBlog;
