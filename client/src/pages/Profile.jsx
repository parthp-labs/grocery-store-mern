import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import Breadcrumb from "../components/Breadcrumb";
import ShippingAddress from "../components/ShippingAddress";

function Profile() {
  const user = useSelector((state) => state.userReducer.user);
  const [userAddress, setUserAddress] = useState([]);

  const deleteAddress = (index) => {
    const updatedAddress = userAddress;
    updatedAddress.splice(index);
    updatedAddress.pop();
    console.log("HEllo ", index);

    localStorage.setItem("shipping-address", updatedAddress);
    setUserAddress(updatedAddress);
  };

  useEffect(() => {
    let address = [];
    try {
      address = JSON.parse(localStorage.getItem("shipping-address"));
    } catch (error) {
      address = [];
    }

    if (address == null) address = [];
    address?.push({
      streetInfo: user.streetInfo,
      houseNumber: user.houseNumber,
      city: user.city,
      pinCode: user.pinCode,
    });
    console.log(address);
    setUserAddress(address);
  }, [user]);

  return (
    <>
      <Breadcrumb destination={"Profile"} parentDestination={"Account"} />

      <section className="profile spad">
        <div className="container-lg">
          <div className="profile__details">
            <div>
              <div className="profile__detail__label">First Name</div>
              <div className="">{user.firstName}</div>
            </div>
            <div>
              <div className="profile__detail__label">Last Name</div>
              <div className="">{user.firstName}</div>
            </div>
            <div>
              <div className="profile__detail__label">Age</div>
              <div className="">{user.age}</div>
            </div>
            <div>
              <div className="profile__detail__label">Gender</div>
              <div className="">
                {user.gender.replace(
                  user.gender[0],
                  user.gender[0].toUpperCase()
                )}
              </div>
            </div>
            <div>
              <div className="profile__detail__label">Phone Number</div>
              <div>{user.phoneNumber}</div>
            </div>
            <div>
              <div className="profile__detail__label">Email</div>
              <div>{user.email}</div>
            </div>
            <div>
              <div className="profile__detail__label">Password</div>
              <div>
                <button className="site-btn">Reset Password</button>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="mb-4 profile__detail__label">Saved Addresses</p>

            <div className="profile__saved__addresses">
              {userAddress.length == 0 && <p>No saved address found</p>}
              {userAddress.map((address) => (
                <div key={Math.random() * 1000} className="">
                  <ShippingAddress
                    city={address.city}
                    streetInfo={address.streetInfo}
                    houseNumber={address.houseNumber}
                    pinCode={address.pinCode}
                    selectable={false}
                    deletable={
                      userAddress.indexOf(address) !== userAddress.length - 1
                        ? true
                        : false
                    }
                    onDeleteHandler={() =>
                      deleteAddress(userAddress.indexOf(address))
                    }
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Profile;
