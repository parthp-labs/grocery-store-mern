import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { hideLoader, showLoader } from "../redux/reducers/loaderReducer";

export default function useRequestHandler({
  mutationFunc = () => {},
  queryFunc = () => {},
  reducerFunc,
  successRedirect = null,
  failureRedirect = null,
  showToastOnSuccess = false,
  showToastOnError = false,
  onSuccess = () => {},
  onError = () => {},
  loader = true,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const triggerMutationFunc = async (body = {}) => {
    try {
      if (loader) {
        dispatch(showLoader());
      }
      setIsLoading(true);
      let res = await mutationFunc(body)?.unwrap();

      if (reducerFunc) {
        dispatch(reducerFunc(res));
      }

      if (showToastOnSuccess) {
        toast.success(res.message);
      }

      setIsSuccess(true);

      if (successRedirect) {
        navigate(successRedirect);
      }

      await onSuccess(res);
    } catch (error) {
      console.log(error);
      if (showToastOnError) {
        toast.error(error.data?.message || error.message);
      }

      if (error.status == "FETCH_ERROR") {
        toast.error("Unable to connect to the server. Please try later");
      }

      setError(error.data?.message || error.message);
      setIsSuccess(false);
      onError(error);
      if (failureRedirect) navigate(failureRedirect);
    } finally {
      if (loader) {
        dispatch(hideLoader());
      }
      setIsLoading(false);
    }
  };

  const triggerQueryFunc = async (body = {}) => {
    try {
      setIsLoading(true);
      if (loader) {
        dispatch(showLoader());
      }
      const res = await queryFunc(body);

      if (res && "data" in res) {
        if (reducerFunc) {
          dispatch(reducerFunc(res.data));
        }

        if (showToastOnSuccess) {
          toast.success(res.data.message);
        }

        onSuccess(res.data);
        setIsSuccess(true);
        if (successRedirect) navigate(successRedirect);
      } else {
        if (showToastOnError) {
          toast.error(res.error.data?.message || res.error.message);
        }

        setError(res.error.data?.message || res.error.message);
        setIsSuccess(false);
        if (failureRedirect) navigate(failureRedirect);
      }
    } catch (error) {
      if (showToastOnError) {
        toast.error(error.data?.message || error.message);
      }

      onError(error);
      setIsSuccess(false);
      setError(error.data?.message || error.message);
      if (failureRedirect) navigate(failureRedirect);
    } finally {
      setIsLoading(false);
      if (loader) {
        dispatch(hideLoader());
      }
    }
  };

  return { isLoading, isSuccess, error, triggerQueryFunc, triggerMutationFunc };
}
