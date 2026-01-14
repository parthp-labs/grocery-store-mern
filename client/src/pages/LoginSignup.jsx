import React, { useEffect, useState } from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faEyeSlash,
  faSignIn,
  faUserCircle,
} from "@fortawesome/free-solid-svg-icons";

import logo from "../assets/logo.png";

import {
  useLazyGetUserQuery,
  useLoginMutation,
  useSignupMutation,
} from "../redux/api/userApi";
import { useDispatch, useSelector } from "react-redux";
import { userExists } from "../redux/reducers/userReducer";
import useRequestHandler from "../hooks/useRequestHandler";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../redux/reducers/loaderReducer";

function LoginSignup() {
  const [login] = useLoginMutation();
  const [signup] = useSignupMutation();
  const [getUser] = useLazyGetUserQuery();
  const dispatch = useDispatch();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginPasswordVisible, setLoginPasswordVisible] = useState(false);
  const [cpasswordVisible, setCPasswordVisible] = useState(false);
  const { user, loading } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { triggerMutationFunc: loginFunc } = useRequestHandler({
    mutationFunc: login,
    showToastOnError: true,
    showToastOnSuccess: true,
    successRedirect: "/",
    onSuccess: async () => {
      dispatch(hideLoader());
      await triggerQueryFunc();
    },
  });
  const { triggerMutationFunc: signupFunc } = useRequestHandler({
    mutationFunc: signup,
    showToastOnError: true,
    onSuccess: (data) => {
      navigate("/verify");
      if (data?.emailSent) {
        toast.info(
          "Your account has been created. Please verify your email, to login and continue"
        );
      } else {
        toast.info(data.message);
      }
    },
  });
  const { triggerQueryFunc } = useRequestHandler({
    queryFunc: getUser,
    reducerFunc: (data) => userExists(data.user),
    showToastOnError: true,
    showToastOnSuccess: true,
  });

  const loginHandler = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    await loginFunc({
      email: formData.get("email"),
      password: formData.get("password"),
    });
    // await triggerQueryFunc();
  };

  const signupHandler = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    if (formData.get("confirm-password") != formData.get("password")) {
      toast.error("Confirm password should be equal to password");
      return;
    }
    await signupFunc(formData);
  };

  useEffect(() => {
    if (user) {
      if (searchParams.get("redirect_to")) {
        navigate(searchParams.get("redirect_to"));
      }
    }
  }, [user]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className="register__container container">
            <Link to="/">
              <img
                className="register__container__logo"
                src={logo}
                alt="Logo"
              />
            </Link>
            <div className="register__container__form">
              <ul className="nav nav-tabs" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link active"
                    data-toggle="tab"
                    href="#tabs-1"
                    role="tab"
                    aria-selected="true"
                  >
                    <i>
                      <FontAwesomeIcon icon={faUserCircle} />
                    </i>
                    SignUp
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link"
                    data-toggle="tab"
                    href="#tabs-2"
                    role="tab"
                    aria-selected="false"
                  >
                    <i>
                      <FontAwesomeIcon icon={faSignIn} />
                    </i>
                    Login
                  </a>
                </li>
              </ul>
              <div className="tab-content">
                <div className="tab-pane active" id="tabs-1" role="tabpanel">
                  <form className="signup__form" onSubmit={signupHandler}>
                    <div className="row">
                      <div className="register__input col">
                        <p>
                          First Name <span>*</span>
                        </p>
                        <input name="firstName" id="firstName" />
                      </div>
                      <div className="register__input col">
                        <p>
                          Last Name <span>*</span>
                        </p>
                        <input name="lastName" id="lastName" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="register__input col">
                        <p>
                          Age <span>*</span>
                        </p>
                        <input name="age" id="age" type="number" />
                      </div>
                      <div className="register__input col">
                        <p>
                          Gender <span>*</span>
                        </p>
                        <select name="gender" id="gender" defaultValue="">
                          <option value="">Select Gender</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="register__input">
                      <p>
                        Phone Number <span>*</span>
                      </p>
                      <input
                        name="phoneNumber"
                        id="phoneNumber"
                        type="number"
                      />
                    </div>

                    <div className="row">
                      <div className="register__input col">
                        <p>
                          House Number/Name <span>*</span>
                        </p>
                        <input name="houseNumber" id="houseNumber" />
                      </div>
                      <div className="register__input col">
                        <p>
                          Street Info <span>*</span>
                        </p>
                        <input name="streetInfo" id="streetInfo" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="register__input col">
                        <p>
                          City <span>*</span>
                        </p>
                        <input name="city" id="city" />
                      </div>
                      <div className="register__input col">
                        <p>
                          State <span>*</span>
                        </p>
                        <input name="state" id="state" />
                      </div>
                    </div>
                    <div className="row">
                      <div className="register__input col">
                        <p>
                          PinCode <span>*</span>
                        </p>
                        <input name="pinCode" id="pinCode" />
                      </div>
                      <div className="col"></div>
                    </div>
                    <div className="register__input">
                      <p>
                        Email Address <span>*</span>
                      </p>
                      <input name="email" id="email" type="email" />
                    </div>
                    <div className="register__input password__field">
                      <p>
                        Password <span>*</span>
                      </p>
                      <input
                        name="password"
                        id="password"
                        type={passwordVisible ? "text" : "password"}
                      />
                      <i onClick={() => setPasswordVisible(!passwordVisible)}>
                        <FontAwesomeIcon
                          icon={!passwordVisible ? faEyeSlash : faEye}
                        />
                      </i>
                    </div>
                    <div className="register__input password__field">
                      <p>
                        Confirm Password <span>*</span>
                      </p>
                      <input
                        name="confirm-password"
                        id="confirm-password"
                        type={cpasswordVisible ? "text" : "password"}
                      />
                      <i onClick={() => setCPasswordVisible(!cpasswordVisible)}>
                        <FontAwesomeIcon
                          icon={!cpasswordVisible ? faEyeSlash : faEye}
                        />
                      </i>
                    </div>
                    <button className="site-btn col">Signup</button>
                  </form>
                </div>
                <div className="tab-pane" id="tabs-2" role="tabpanel">
                  <form className="login__form" onSubmit={loginHandler}>
                    <div className="register__input">
                      <p>
                        Email <span>*</span>
                      </p>
                      <input
                        placeholder="Enter your account email"
                        name="email"
                        id="email"
                      />
                    </div>
                    <div className="register__input password__field">
                      <p>
                        Password <span>*</span>
                      </p>
                      <input
                        placeholder="Enter your account password"
                        name="password"
                        id="password"
                        type={loginPasswordVisible ? "text" : "password"}
                      />
                      <i
                        onClick={() =>
                          setLoginPasswordVisible(!loginPasswordVisible)
                        }
                      >
                        <FontAwesomeIcon
                          icon={!loginPasswordVisible ? faEyeSlash : faEye}
                        />
                      </i>
                    </div>

                    <button className="site-btn col">Login</button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default LoginSignup;
