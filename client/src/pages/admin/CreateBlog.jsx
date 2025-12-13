import React, { useEffect, useRef, useState } from "react";
import imagePlaceholder from "../../assets/placeholder-image.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAdd,
  faCloudUpload,
  faMinusSquare,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";

import {
  useCreateBlogMutation,
  useGetBlogTagsQuery,
} from "../../redux/api/blogsApi";

import ReactSelect from "react-select";
import { toast } from "react-toastify";
import useRequestHandler from "../../hooks/useRequestHandler";
import TiptapEditor from "../../components/admin/TiptapEditor";

function CreateBlog() {
  const [imagePreview, setImagePreview] = useState(imagePlaceholder);
  const descriptionRef = useRef();
  const [description, setDescription] = useState();
  const [blogTags, setBlogTags] = useState([]);
  const [existingTags, setExistingTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [selectedExistingTag, setSelectedExistingTag] = useState("");
  const newBlogFormRef = useRef();

  const { data } = useGetBlogTagsQuery();

  const resetForm = () => {
    newBlogFormRef.current.reset();
    setImagePreview(imagePlaceholder);
    setNewTag("");
    setBlogTags([]);
  };

  const [createBlog] = useCreateBlogMutation();
  const { triggerMutationFunc: createBlogHandler } = useRequestHandler({
    mutationFunc: (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      formData.set("tags", blogTags);
      formData.set("description", description);

      return createBlog(formData);
    },
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: resetForm,
  });

  const showImagePreview = (e) => {
    const file = e.target.files[0];
    const src = URL.createObjectURL(file);
    setImagePreview(src);
  };

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

  useEffect(() => {
    if (data) {
      const temp = [];
      data.tags.forEach((tag) => {
        temp.push({
          value: tag,
          label: tag.replace(tag[0], tag[0].toUpperCase()),
        });
      });
      setExistingTags(temp);
    }
  }, [data]);

  return (
    <>
      <h3 className="admin__dashboard__container__header">Create Blog</h3>

      <div>
        <form
          onSubmit={createBlogHandler}
          className="new__blog__form"
          ref={newBlogFormRef}
          encType="multipart/form-data"
        >
          <div className="form__field new__blog__image__field">
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
          <div className="form__field">
            <label>Title</label>
            <input placeholder="Enter blog title" name="title" />
          </div>
          <div className="form__field">
            <label>Description</label>

            <TiptapEditor
              content=""
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
                  <i onClick={removeTag} data-tag-index={blogTags.indexOf(tag)}>
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
                <FontAwesomeIcon icon={faAdd} />
              </i>
              Add Blog
            </button>
            <button className="site-btn" type="button" onClick={resetForm}>
              <i>
                <FontAwesomeIcon icon={faRefresh} />
              </i>
              Reset Form
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default CreateBlog;
