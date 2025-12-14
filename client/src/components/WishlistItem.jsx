import { faAdd, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "../redux/api/userApi";
import useRequestHandler from "../hooks/useRequestHandler";

function WishlistItem({
  getUser,
  id,
  image,
  name,
  price,
  quantity,
  loadWishlist,
}) {
  const [addToCart] = useAddToCartMutation();

  const { triggerMutationFunc: addToCartHandler, isSuccess } =
    useRequestHandler({
      mutationFunc: () => addToCart({ itemId: id, quantity: 1 }),
      showToastOnError: true,
      onSuccess: () => {
        getUser();
        removeFromWishlist();
        toast.success("Item added to cart");
      },
    });

  const removeFromWishlist = () => {
    try {
      const wishlist = JSON.parse(localStorage.getItem("wishlist"));

      wishlist.splice(wishlist.indexOf(id), 1);
      localStorage.setItem("wishlist", JSON.stringify(wishlist));
      loadWishlist();
      toast.success("Item removed from wishlist");
    } catch (error) {
      toast.error("Unable to remove from wishlist");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
      className="wishlist__item"
    >
      <img src={image} />
      <div>
        <p>{name}</p>
        <span>
          {quantity} for Rs.{price}
        </span>
      </div>
      <i onClick={addToCartHandler}>
        <FontAwesomeIcon icon={faAdd} />
      </i>
      <i onClick={removeFromWishlist}>
        <FontAwesomeIcon icon={faTrash} />
      </i>
    </div>
  );
}

export default WishlistItem;
