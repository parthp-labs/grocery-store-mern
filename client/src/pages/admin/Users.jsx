import React, { useEffect, useState } from "react";
import ReactSelect from "react-select";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRefresh } from "@fortawesome/free-solid-svg-icons";

import useRequestHandler from "../../hooks/useRequestHandler";

import UserTableComponent from "../../components/admin/UserTableComponent";
import TableLoader from "../../components/TableLoader";

import {
  useDeleteUserByAdminMutation,
  useLazyGetAllUsersQuery,
  useMakeAdminMutation,
} from "../../redux/api/userApi";
import CustomModal from "../../components/CustomModal";
import ContainerLoader from "../../components/ContainerLoader";

function Users() {
  const [userId, setUserId] = useState();
  const [email, setEmail] = useState();
  const [gender, setGender] = useState();
  const [role, setRole] = useState();
  const [name, setName] = useState();
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState({});

  const {
    modal: DeleteUserModal,
    openModal: openDeleteUserModal,
    closeModal: closeDeleteuserModal,
  } = CustomModal({
    title: "Are you sure that you want to delete this user ?",
    description: "Once the user is deleted, no related data can be recovered",
    cancelButtonText: "No, I don't want to delete the user",
    actionButtons: (
      <button
        className="custom-modal__btn custom-modal__okBtn"
        onClick={() => deleteUserHandler(selectedUser._id)}
      >
        Yes, I want to delete the user
      </button>
    ),
    body: (
      <>
        <p>Id: {selectedUser._id}</p>
        <p>
          Name: {selectedUser.firstName} {selectedUser.lastName}
        </p>
        <p>Email: {selectedUser.email}</p>
      </>
    ),
  });

  const [getAllUsers, { data, isLoading, isError }] = useLazyGetAllUsersQuery();

  const [deleteUser] = useDeleteUserByAdminMutation();
  const [makeAdmin] = useMakeAdminMutation();

  const {
    triggerMutationFunc: deleteUserHandler,
    isLoading: deleteUserLoading,
  } = useRequestHandler({
    mutationFunc: (id) => deleteUser({ id }),
    showToastOnSuccess: true,
    showToastOnError: true,
    onSuccess: async () => {
      await getAllUsers({});
      closeDeleteuserModal();
    },
  });

  const { triggerMutationFunc: makeAdminHandler, isLoading: makeAdminLoading } =
    useRequestHandler({
      mutationFunc: (id) => makeAdmin({ id }),
      showToastOnSuccess: true,
      showToastOnError: true,
      onSuccess: getAllUsers,
    });

  const resetFilter = () => {
    setUserId("");
    setEmail("");
    setRole("");
    setName("");
    setGender("");
  };

  useEffect(() => {
    if (data) {
      setUsers(data.user);
    }
    if (isError) {
      setUsers([]);
    }
  }, [data, isError]);

  useEffect(() => {
    getAllUsers({
      userId,
      email,
      gender,
      role,
    });
  }, [email, gender, role, name, userId]);

  return (
    <>
      <ContainerLoader isLoading={deleteUserLoading} />
      <button className="site-btn" onClick={resetFilter}>
        <i>
          <FontAwesomeIcon icon={faRefresh} />
        </i>
        Reset Filters
      </button>
      <div className="admin__users__filter">
        <div className="filter__input">
          <label>UserId</label>
          <input
            placeholder="Enter user id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Email</label>
          <input
            placeholder="Enter user email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Name</label>
          <input
            placeholder="Enter user name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="filter__input">
          <label>Gender</label>
          <ReactSelect
            options={[
              { value: "", label: "All" },
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
            ]}
            isSearchable={false}
            placeholder="Select gender"
            onChange={(e) => setGender(e.value)}
          />
        </div>
        <div className="filter__input">
          <label>Role</label>
          <ReactSelect
            options={[
              { value: "", label: "All" },
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
            ]}
            isSearchable={false}
            placeholder="Select role"
            onChange={(e) => setRole(e.value)}
          />
        </div>
      </div>
      <table className="admin__users__table">
        <thead>
          <tr>
            <th className="">Id</th>
            <th className="">Name</th>
            <th>Gender</th>
            <th>Email</th>
            <th>Role</th>
            <th className="">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <TableLoader />
          ) : (
            users.map((i) => (
              <UserTableComponent
                key={i._id}
                id={i._id}
                name={i.firstName + " " + i.lastName}
                gender={i.gender}
                email={i.email}
                role={i.role}
                deleteUserHandler={() => {
                  openDeleteUserModal(), setSelectedUser(i);
                }}
                makeAdminHandler={() => makeAdminHandler(i._id)}
              />
            ))
          )}
        </tbody>
      </table>

      {DeleteUserModal}
    </>
  );
}

export default Users;
