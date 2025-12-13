import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const useRtkQueryIsLoading = (sliceName) => {
  const storeState = useSelector((state) => state);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const isLoading = Object.values(storeState)
      .filter((state) => state.queries)
      .map((slice) => slice.queries)
      .some((query) =>
        Object.values(query).some((q) => q.status === "pending")
      );

    setIsLoading(isLoading);
    console.log("isLoading:", isLoading);
  }, [storeState]);

  return isLoading;
};

export default useRtkQueryIsLoading;
