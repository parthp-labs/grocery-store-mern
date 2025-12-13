import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useSendVerificationCodeMutation,
  useVerifyMutation,
} from "../redux/api/userApi";
import useRequestHandler from "../hooks/useRequestHandler";

function Verification() {
  const user = useSelector((state) => state.userReducer.user);

  const navigate = useNavigate();
  const [verificationCode, setVerificationCode] = useState();
  const [email, setEmail] = useState("");

  const [verify] = useVerifyMutation();
  const [resendVerificationCode] = useSendVerificationCodeMutation();

  const { triggerMutationFunc: verifyUserFunc } = useRequestHandler({
    mutationFunc: () => verify({ verificationCode }),
    showToastOnError: true,
    showToastOnSuccess: true,
    successRedirect: "/register",
  });

  const { triggerMutationFunc: resendCodeFunc } = useRequestHandler({
    mutationFunc: () => resendVerificationCode({ email }),
    showToastOnError: true,
    showToastOnSuccess: true,
  });

  useEffect(() => {
    console.log(user);
    if (user) {
      navigate("/account");
      toast.info("You are already logged in !");
    }
  }, [user]);

  return (
    <>
      <div className="verification__container container">
        <h2>Verify Your Email</h2>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="verification__form"
        >
          <p>Enter Email</p>
          <input
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="Enter your email"
          />

          <p>Enter Verification Code</p>
          <input
            name="email"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            id="verification-code"
            placeholder="Enter your email"
          />
          <p className="resend__code__text">
            Verification Code not found.
            <button onClick={() => resendCodeFunc({ email })}>
              Resend Code{" "}
            </button>{" "}
          </p>
          <button
            className="site-btn"
            onClick={() => verifyUserFunc({ verificationCode })}
          >
            Verify
          </button>
        </form>
      </div>
    </>
  );
}

export default Verification;
