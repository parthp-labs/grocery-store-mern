import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faLocation,
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import Breadcrumb from "../components/Breadcrumb";
import { useSendMessageMutation } from "../redux/api/messageApi";
import useRequestHandler from "../hooks/useRequestHandler";

function Contact() {
  const [contactDetails, setContactDetails] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sendMessage] = useSendMessageMutation();

  const { triggerMutationFunc: handleSendMessage } = useRequestHandler({
    mutationFunc: sendMessage,
    showToastOnError: true,
    showToastOnSuccess: true,
    onSuccess: () => {
      setContactDetails({ name: "", email: "", message: "" });
      console.log(contactDetails);
    },
  });

  return (
    <>
      <Breadcrumb destination={"Contact"} />
      {/* <!-- Contact Section Begin --> */}
      <section className="contact spad">
        <div className="container">
          <div className="row contact__widgets__container">
            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span>
                  <FontAwesomeIcon icon={faPhone} />
                </span>
                <h4>Phone</h4>
                <p>+01-3-8888-6868</p>
              </div>
            </div>
            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span>
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                <h4>Address</h4>
                <p>60-49 Road 11378 New York</p>
              </div>
            </div>

            <div className="col-lg-3 col-md-3 col-sm-6 text-center">
              <div className="contact__widget">
                <span>
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
                <h4>Email</h4>
                <p>hello@colorlib.com</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* <!-- Contact Section End --> */}

      {/* <!-- Contact Form Begin --> */}
      <div className="contact-form spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="contact__form__title">
                <h2>Leave Message</h2>
              </div>
            </div>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(contactDetails);
            }}
          >
            <div className="row">
              <div className="col-lg-6 col-md-6">
                <input
                  type="text"
                  placeholder="Your name"
                  name="name"
                  value={contactDetails.name}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      name: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-lg-6 col-md-6">
                <input
                  type="email"
                  placeholder="Your Email"
                  name="email"
                  value={contactDetails.email}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      email: e.target.value,
                    })
                  }
                />
              </div>
              <div className="col-lg-12 text-center">
                <textarea
                  placeholder="Your message"
                  name="message"
                  value={contactDetails.message}
                  onChange={(e) =>
                    setContactDetails({
                      ...contactDetails,
                      message: e.target.value,
                    })
                  }
                ></textarea>
                <button type="submit" className="site-btn">
                  SEND MESSAGE
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* <!-- Contact Form End --> */}
    </>
  );
}

export default Contact;
