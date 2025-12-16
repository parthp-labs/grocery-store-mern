import React, { useEffect, useRef, useState } from "react";

import { toast } from "react-toastify";

import Breadcrumb from "../components/Breadcrumb";
import ShippingAddress from "../components/ShippingAddress";
import Loader from "../components/Loader";
import ContainerLoader from "../components/ContainerLoader";

import useRequestHandler from "../hooks/useRequestHandler";
import { usePlaceOrderMutation } from "../redux/api/ordersApi";

function Checkout({ user = {} }) {
  const network = import.meta.env.VITE_NETWORK;

  const [usingDiffAddress, setUsingDiffAddress] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState({});
  const [shippingAddressList, setShippingAddressList] = useState([]);
  const [orderItems, setOrderItems] = useState([]);
  const [newAddress, setNewAddress] = useState({
    houseNumber: "",
    streetInfo: "",
    city: "",
    state: "",
    pinCode: "",
  });
  const [selectedPaymentMode, setSelectedPaymentMode] = useState("");
  const saveNewAddressRef = useRef();
  const [screenInActive, setScreenInactive] = useState(false);

  const [placeOrder, { isLoading: newOrderLoading }] = usePlaceOrderMutation();
  const { triggerMutationFunc: placeOrderHandler } = useRequestHandler({
    mutationFunc: () => {
      if (selectedPaymentMode === "card") {
        toast.info("You are being redirect for payment. Please wait...");
      }

      return placeOrder({
        houseNumber: selectedAddress.houseNumber,
        streetInfo: selectedAddress.streetInfo,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pinCode: selectedAddress.pinCode,
        orderItems: orderItems,
        paymentMode: selectedPaymentMode,
        subTotal: user?.cart.cartTotal,
        totalAmount: user?.cart.cartTotal,
      });
    },
    showToastOnError: true,
    showToastOnSuccess: false,
    loader: true,
    onSuccess: (res) => {
      setScreenInactive(true);
      console.log(res);
      if (selectedPaymentMode === "card") {
        window.location = res.paymentLink;
      } else if (selectedPaymentMode === "cashOnDelivery") {
        window.location = `/order/success?orderId=${res.order._id}`;
      }

      return;
    },
  });

  // For placing order on click
  const placeOrderClickHandler = () => {
    // Checking if delivery address is selected
    if (
      !selectedAddress &&
      (newAddress.houseNumber.trim() === "" ||
        newAddress.streetInfo.trim() === "" ||
        newAddress.city.trim() === "" ||
        newAddress.state.trim() === "" ||
        newAddress.pinCode.trim() === "")
    ) {
      toast.error("Please select existing address or add new one");
      return;
    }

    if (selectedPaymentMode == "") {
      toast.error("Please select a payment mode");
      return;
    }

    // Saving the new delivery address if user checked Save this address
    if (saveNewAddressRef.current?.checked === true) {
      const newAddressData = {
        houseNumber: newAddress.houseNumber,
        streetInfo: newAddress.streetInfo,
        city: newAddress.city,
        state: newAddress.state,
        pinCode: newAddress.pinCode,
      };

      const newShippingAddressList = shippingAddressList.copyWithin();
      newShippingAddressList.shift();
      newShippingAddressList.push(newAddressData);

      localStorage.setItem(
        "shipping-address",
        JSON.stringify(newShippingAddressList)
      );

      setDeliveryAddress();
    }

    toast.info("Please wait, your order is being placed");
    placeOrderHandler();
  };

  // For deleting saved delivery address
  const deleteDeliveryAddress = (id) => {
    const newDeliveryAddressList = shippingAddressList.copyWithin();
    newDeliveryAddressList.shift();
    newDeliveryAddressList.splice(id, 1);

    localStorage.setItem(
      "shipping-address",
      JSON.stringify(newDeliveryAddressList)
    );
    setDeliveryAddress();

    toast.info("A delivery address has been successfully deleted");
  };

  // Getting saved addresses
  const setDeliveryAddress = () => {
    let addresses = [];
    try {
      const savedAddresses = JSON.parse(
        localStorage.getItem("shipping-address")
      );

      if (typeof savedAddress == Array) addresses = [...savedAddresses];
    } catch (error) {
      console.log(error);
    } finally {
      addresses.unshift({
        houseNumber: user.houseNumber,
        streetInfo: user.streetInfo,
        city: user.city,
        state: user.state,
        pinCode: user.pinCode,
      });

      setShippingAddressList(addresses);
      setSelectedAddress(addresses[0]);
    }
  };

  useEffect(() => {
    if (user) {
      setDeliveryAddress();

      let temp = [];
      user?.cart.items.forEach((item) => {
        temp.push({ itemId: item.item._id, quantity: item.quantity });
      });

      setOrderItems(temp);
    }
  }, [user]);

  return (
    <>
      <Breadcrumb destination={"Checkout"} />

      {/* <!-- Checkout Section Begin --> */}
      <section className="checkout spad">
        <div className="container">
          <div className="checkout__form">
            <h4>Billing Details</h4>
            <form action="#">
              <div className="row">
                <div className="col-lg-8 col-md-6">
                  <h5>Shipping Address</h5>
                  <div className="shipping__address__container">
                    {shippingAddressList.map(
                      (address) =>
                        address && (
                          <ShippingAddress
                            key={Math.random() * 1000}
                            id={shippingAddressList.indexOf(address)}
                            houseNumber={address.houseNumber}
                            streetInfo={address.streetInfo}
                            city={address.city}
                            state={address.state}
                            pinCode={address.pinCode}
                            selectable={true}
                            deletable={
                              shippingAddressList.indexOf(address) !== 0 && true
                            }
                            isActive={selectedAddress === address && true}
                            onClickHandler={() => {
                              setSelectedAddress(address);
                              setUsingDiffAddress(false);
                            }}
                            onDeleteHandler={() =>
                              deleteDeliveryAddress(
                                shippingAddressList.indexOf(address) - 1
                              )
                            }
                          />
                        )
                    )}
                  </div>
                  <div className="checkout__input__checkbox">
                    <label htmlFor="diff-acc">
                      Ship to a different address?
                      <input
                        type="checkbox"
                        id="diff-acc"
                        onChange={() => {
                          setUsingDiffAddress(!usingDiffAddress);
                          setSelectedAddress("");
                        }}
                        checked={usingDiffAddress}
                      />
                      <span className="checkmark"></span>
                    </label>
                  </div>

                  {usingDiffAddress && (
                    <>
                      <div className="checkout__input">
                        <p>
                          Address<span>*</span>
                        </p>
                        <input
                          type="text"
                          placeholder="Your house number"
                          className="checkout__input__add"
                          name="houseNumber"
                          onChange={(event) => {
                            setNewAddress({
                              ...newAddress,
                              houseNumber: event.target.value,
                            });
                            setSelectedAddress({
                              ...selectedAddress,
                              houseNumber: event.target.value,
                            });
                          }}
                        />
                        <input
                          type="text"
                          placeholder="Your current street info"
                          name="streetInfo"
                          onChange={(event) => {
                            setNewAddress({
                              ...newAddress,
                              streetInfo: event.target.value,
                            });
                            setSelectedAddress({
                              ...selectedAddress,
                              streetInfo: event.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="checkout__input">
                        <p>
                          Town/City<span>*</span>
                        </p>
                        <input
                          type="text"
                          placeholder="Your city"
                          name="city"
                          onChange={(event) => {
                            setNewAddress({
                              ...newAddress,
                              city: event.target.value,
                            });
                            setSelectedAddress({
                              ...selectedAddress,
                              city: event.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="checkout__input">
                        <p>
                          State<span>*</span>
                        </p>
                        <input
                          placeholder="Your state"
                          type="text"
                          name="state"
                          onChange={(event) => {
                            setNewAddress({
                              ...newAddress,
                              state: event.target.value,
                            });
                            setSelectedAddress({
                              ...selectedAddress,
                              state: event.target.value,
                            });
                          }}
                        />
                      </div>
                      <div className="checkout__input">
                        <p>
                          Postcode / ZIP<span>*</span>
                        </p>
                        <input
                          placeholder="Your area pincode"
                          type="text"
                          name="pinCode"
                          onChange={(event) => {
                            setNewAddress({
                              ...newAddress,
                              pinCode: event.target.value,
                            });
                            setSelectedAddress({
                              ...selectedAddress,
                              pinCode: event.target.value,
                            });
                          }}
                        />
                      </div>

                      <div className="my-4">
                        <input
                          type="checkbox"
                          ref={saveNewAddressRef}
                          checked
                          onChange={() => {}}
                        />
                        <label className="pl-2">Save this address</label>
                      </div>
                    </>
                  )}
                </div>
                <div className="col-lg-4 col-md-6">
                  <div className="checkout__order">
                    <h4>Your Order</h4>
                    <div className="checkout__order__products">
                      Products <span>Total</span>
                    </div>
                    <ul>
                      {user?.cart.items.map((item) => (
                        <li key={item.item._id}>
                          {item.item.name}{" "}
                          <span>
                            Rs.${item.item.discountedPrice} (Qty {item.quantity}
                            )
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="checkout__order__subtotal">
                      Subtotal <span>Rs.{user?.cart.cartTotal}</span>
                    </div>
                    <div className="checkout__order__total">
                      Total <span>Rs.{user?.cart.cartTotal}</span>
                    </div>
                    <div className="checkout__input__checkbox">
                      <label htmlFor="online-payment">
                        Card
                        <input
                          type="radio"
                          id="online-payment"
                          name="payment-mode"
                          checked={selectedPaymentMode == "card" ? true : false}
                          onClick={() => setSelectedPaymentMode("card")}
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    <div className="checkout__input__checkbox">
                      <label htmlFor="cash-on-delivery">
                        Cash On Delivery
                        <input
                          type="radio"
                          id="cash-on-delivery"
                          name="payment-mode"
                          checked={
                            selectedPaymentMode == "cashOnDelivery"
                              ? true
                              : false
                          }
                          onClick={() =>
                            setSelectedPaymentMode("cashOnDelivery")
                          }
                        />
                        <span className="checkmark"></span>
                      </label>
                    </div>

                    <button
                      type="button"
                      className="site-btn"
                      onClick={placeOrderClickHandler}
                    >
                      PLACE ORDER
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
      {/* <!-- Checkout Section End --> */}
    </>
  );
}

export default Checkout;
