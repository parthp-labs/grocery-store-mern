import React, { useEffect, useState } from "react";
import useRequestHandler from "../../hooks/useRequestHandler";
import { useSearchParams } from "react-router-dom";
import { useLazyGetBlogByIdQuery } from "../../redux/api/blogsApi";
import parse from "html-react-parser";

function ViewBlog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogId, setBlogId] = useState();
  const [blogDetails, setBlogDetails] = useState();

  const [getBlog] = useLazyGetBlogByIdQuery();
  const { triggerMutationFunc: getBlogHandler } = useRequestHandler({
    mutationFunc: (blogId) => getBlog(blogId),
    showToastOnError: true,
    onSuccess: (res) => setBlogDetails(res.blog),
    onError: () => setBlogDetails(),
  });

  useEffect(() => {
    const blogIdFromParam = searchParams.get("id");
    if (blogIdFromParam) {
      setBlogId(blogIdFromParam);
      getBlogHandler(blogIdFromParam);
    }
  }, []);

  useEffect(() => {
    setSearchParams({ ...searchParams, id: blogId });
  }, [blogId]);

  return (
    <>
      <h3 className="admin__dashboard__container__header">View Blog</h3>

      <div className="form__field view__blog__search">
        <label>Blog Id</label>
        <input
          placeholder="Enter blog id to get details"
          value={blogId}
          onChange={(e) => setBlogId(e.target.value)}
        />
        <button type="button" onClick={() => getBlogHandler(blogId)}>
          Search
        </button>
      </div>

      {blogDetails && (
        <>
          <h4>{blogDetails.title}</h4>

          {parse(blogDetails.description)}
        </>
      )}
    </>
  );
}

export default ViewBlog;
