import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import {
  faFacebook,
  faGooglePlus,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import parse from "html-react-parser";

import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import RecentBlogCard from "../components/RecentBlogCard";
import ContainerLoader from "../components/ContainerLoader";

import {
  useGetAllBlogsQuery,
  useGetBlogByIdQuery,
  useGetRecentBlogsQuery,
} from "../redux/api/blogsApi";

import authorImage from "../assets/blog/details/details-author.jpg";
import heroImage from "../assets/blog/details/details-hero.jpg";

function BlogDetails() {
  const params = useParams();
  const blogId = params.blogId;
  const [blogDetails, setBlogDetails] = useState({});

  const { data: blogDetailsRes, isLoading: blogDetailsLoading } =
    useGetBlogByIdQuery(blogId);
  const { data: recentBlogsRes, isLoading: recentBlogsLoading } =
    useGetRecentBlogsQuery();
  const { data: otherBlogsRes, isLoading: otherBlogsLoading } =
    useGetAllBlogsQuery({
      limit: 4,
      blogTag: blogDetails.tags,
    });

  useEffect(() => {
    if (blogDetailsRes) setBlogDetails(blogDetailsRes.blog);
  }, [blogDetailsRes]);

  return (
    <>
      {blogDetailsLoading ? (
        <Loader />
      ) : (
        <>
          {/* <!-- Blog Details Hero Begin --> */}
          <section
            className="blog-details-hero set-bg"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="blog__details__hero__text">
                    <h2>{blogDetails.title}</h2>
                    <ul>
                      <li>
                        By {blogDetails.createdBy?.firstName}{" "}
                        {blogDetails.createdBy?.lastName}
                      </li>
                      <li>
                        {new Date(blogDetails.createdOn).toLocaleDateString()}
                      </li>
                      <li>{blogDetails.comments?.length} Comments</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <!-- Blog Details Hero End --> */}

          {/* <!-- Blog Details Section Begin --> */}
          <section className="blog-details spad">
            <div className="container">
              <div className="row">
                {/* <div className="col-lg-4 col-md-5 order-md-1 order-2">
                  <div className="blog__sidebar">
                    <div className="blog__sidebar__item">
                      <h4>Recent Blogs</h4>
                      <div className="blog__sidebar__recent">
                        <ContainerLoader isLoading={recentBlogsLoading} />
                        {!recentBlogsLoading &&
                          recentBlogsRes?.blog
                            .slice(0, 3)
                            .map((i) => (
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
                </div> */}
                <div className="col-lg-12 col-md-12 order-md-1 order-1">
                  <div className="blog__details__text">
                    <img src={blogDetails.image} alt="" />
                    <div>{parse(blogDetails.description || "")}</div>
                  </div>
                  <div className="blog__details__content">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="blog__details__author">
                          <div className="blog__details__author__pic">
                            <img src={authorImage} alt="" />
                          </div>
                          <div className="blog__details__author__text">
                            <h6>
                              {blogDetails.createdBy?.firstName}{" "}
                              {blogDetails.createdBy?.lastName}
                            </h6>
                            <span>Admin</span>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6">
                        <div className="blog__details__widget">
                          <ul>
                            {/* <li>
                              <span>Categories:</span> Food
                            </li> */}
                            <li>
                              <span>Tags: </span>
                              {blogDetails.tags?.map(
                                (tag) =>
                                  tag.replace(tag[0], tag[0].toUpperCase()) +
                                  ","
                              )}
                            </li>
                          </ul>
                          <div className="blog__details__social">
                            <a href="#">
                              <i>
                                <FontAwesomeIcon icon={faFacebook} />
                              </i>
                            </a>
                            <a href="#">
                              <i>
                                <FontAwesomeIcon icon={faTwitter} />
                              </i>
                            </a>
                            <a href="#">
                              <i>
                                <FontAwesomeIcon icon={faGooglePlus} />
                              </i>
                            </a>
                            <a href="#">
                              <i>
                                <FontAwesomeIcon icon={faLinkedin} />
                              </i>
                            </a>
                            <a href="#">
                              <i>
                                <FontAwesomeIcon icon={faEnvelope} />
                              </i>
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          {/* <!-- Blog Details Section End --> */}

          {/* <!-- Related Blog Section Begin --> */}
          <section className="related-blog spad">
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="section-title related-blog-title">
                    {otherBlogsRes?.blog.length !== 0 && <h2>Similar Blogs</h2>}
                  </div>
                </div>
              </div>
              <div className="row  d-flex justify-content-center">
                {otherBlogsRes?.blog.map(
                  (blog) =>
                    blog._id !== blogDetails._id && (
                      <div
                        key={blog._id}
                        className="col-lg-4 col-md-4 col-sm-6"
                      >
                        <BlogCard
                          blogId={blog._id}
                          image={blog.image}
                          title={blog.title}
                          description={blog.description}
                          postedOn={blog.createdOn}
                          commentsCount={blog.comments.length}
                        />
                      </div>
                    )
                )}
              </div>
            </div>
          </section>
          {/* <!-- Related Blog Section End --> */}
        </>
      )}
    </>
  );
}

export default BlogDetails;
