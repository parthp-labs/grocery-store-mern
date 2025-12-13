import React, { useEffect, useState } from "react";

import ContainerLoader from "../components/ContainerLoader";
import BlogCard from "../components/BlogCard";
import Breadcrumb from "../components/Breadcrumb";

import {
  useGetBlogTagsQuery,
  useGetRecentBlogsQuery,
  useLazyGetAllBlogsQuery,
} from "../redux/api/blogsApi";
import RecentBlogCard from "../components/RecentBlogCard";

function AllBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [blogTitleSearch, setBlogTitleSearch] = useState("");

  const [getAlBlogs, { data: blogsRes, isFetching: blogsLoading }] =
    useLazyGetAllBlogsQuery({
      blogTag: selectedCategory,
      blogTitle: blogTitleSearch,
    });
  const { data: blogTagsRes } = useGetBlogTagsQuery();

  const { data: recentBlogsRes, isLoading: recentBlogsLoading } =
    useGetRecentBlogsQuery();

  // For selecting category
  const selectCategoryHandler = (e) => {
    setSelectedCategory(e.target.getAttribute("data-value"));
  };

  useEffect(() => {
    if (blogTagsRes) {
      // Collecting the blog categories
      const tempCategories = [];

      blogTagsRes.tags.forEach((tag) => {
        if (!tempCategories.includes(tag)) tempCategories.push(tag);
      });
      setCategories(tempCategories);
    }
  }, [blogTagsRes]);

  useEffect(() => {
    getAlBlogs();
  }, []);

  useEffect(() => {
    if (blogsRes) {
      setBlogs(blogsRes.blog);
    }
  }, [blogsRes]);

  return (
    <>
      {/* <!-- Breadcrumb Section Begin --> */}
      <Breadcrumb destination={"Blogs"} />
      {/* <!-- Breadcrumb Section End --> */}

      {/* <!-- Blog Section Begin --> */}
      <section className="blog spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-12">
              <div className="blog__sidebar">
                <div className="blog__sidebar__search">
                  <form action="#" onSubmit={(e) => e.preventDefault()}>
                    <input
                      type="text"
                      placeholder="Search..."
                      value={blogTitleSearch}
                      onChange={(e) => setBlogTitleSearch(e.target.value)}
                    />
                  </form>
                </div>
                <div className="blog__sidebar__item">
                  <h4>Categories</h4>
                  <ul className="blog__categories__options">
                    <li
                      data-value=""
                      onClick={selectCategoryHandler}
                      className={selectedCategory === "" ? "active" : ""}
                    >
                      All
                    </li>
                    {categories.map((cat) => (
                      <li
                        data-value={cat}
                        onClick={selectCategoryHandler}
                        key={cat}
                        className={selectedCategory === cat ? "active" : ""}
                      >
                        {cat} (0)
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="blog__sidebar__item">
                  {recentBlogsRes?.blog.length !== 0 && <h4>Recent News</h4>}

                  <div className="blog__sidebar__recent">
                    {recentBlogsRes?.blog.slice(0, 3).map((i) => (
                      <RecentBlogCard
                        key={i._id}
                        link={`/blogs/${i._id}`}
                        blogImage={i.image}
                        blogTitle={i.title}
                        postedOn={i.createdOn}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-8 col-md-12">
              <h4 className="blogs__count">Total {blogs.length} blogs found</h4>
              <div className="row">
                <ContainerLoader isLoading={blogsLoading} />
                {!blogsLoading &&
                  blogs.map((blog) => (
                    <div className="col-lg-6 col-md-6 col-sm-6" key={blog._id}>
                      <BlogCard
                        blogId={blog._id}
                        title={blog.title}
                        image={blog.image}
                        description={blog.description}
                        postedOn={blog.createdOn}
                        commentsCount={blog.comments.length}
                      />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Blog Section End --> */}
    </>
  );
}

export default AllBlogs;
