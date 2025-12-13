import React from "react";
import Breadcrumb from "../components/Breadcrumb";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileInvoice,
  faShoppingCart,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

function Account() {
  return (
    <>
      <Breadcrumb destination="Account" />

      <div className="container-lg account">
        <div className="row account__links">
          <div className="col col-lg-4 col-sm-12">
            <Link to="/cart" className="account__nav__link">
              <i>
                <FontAwesomeIcon icon={faShoppingCart} />
              </i>
              <div>
                <h3>Cart</h3>
                <p>View and edit your shopping cart</p>
              </div>
            </Link>
          </div>
          <div className="col col-lg-4 col-sm-12">
            <Link to="/orders" className="account__nav__link">
              <i>
                <FontAwesomeIcon icon={faFileInvoice} />
              </i>
              <div>
                <h3>Orders</h3>
                <p>View your orders</p>
              </div>
            </Link>
          </div>
          <div className="col col-lg-4 col-sm-12">
            <Link to="/account/profile" className="account__nav__link">
              <i>
                <FontAwesomeIcon icon={faUser} />
              </i>
              <div>
                <h3>Profile</h3>
                <p>View and edit your personal details</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Account;
