import React from "react";

import "../assets/payment-item.png";
import {
  faFacebook,
  faTwitter,
  faPinterestP,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <>
      {/* !-- Footer Section Begin --> */}
      <footer className="footer spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-md-6 col-sm-6">
              <div className="footer__about">
                <div className="footer__about__logo">
                  <a href="./index.html">
                    <img src={logo} alt="" />
                  </a>
                </div>
                {/* <ul>
                  <li>Address: 60-49 Road 11378 New York</li>
                  <li>Phone: +65 11.188.888</li>
                  <li>Email: hello@ogani.com</li>
                </ul> */}
              </div>
            </div>
            <div className="col-lg-8 col-md-10 col-sm-6 offset-lg-1">
              <div className="footer__widget">
                <h6>Useful Links</h6>
                <ul>
                  <li>
                    <Link to="/account">My Account</Link>
                  </li>
                  <li>
                    <Link to="/orders">My Orders</Link>
                  </li>
                  <li>
                    <Link to="/cart">My Cart</Link>
                  </li>
                </ul>
                <ul>
                  <li>
                    <Link to="/shop">Start Shopping</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-12">
              <div className="footer__copyright">
                <div className="footer__copyright__text">
                  Copyright &copy;
                  <script>document.write(new Date().getFullYear());</script> All
                  rights reserved | This template is made with{" "}
                  <i className="fa fa-heart" aria-hidden="true"></i> by{" "}
                  <a href="https://colorlib.com" target="_blank">
                    Colorlib
                  </a>
                  <div className="footer__copyright__payment">
                    <img src="img/payment-item.png" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
      {/* <-- Footer Section End --> */}
    </>
  );
}

export default Footer;
