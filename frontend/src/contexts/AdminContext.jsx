import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AdminContext = createContext();

const AdminContextProvider = ({ children }) => {
  const [foods, setFoods] = useState([]);
  const [users, setUsers] = useState([]);

  /* ---------- FOOD ---------- */

  const getFoods = async () => {
    const res = await axios.get("http://localhost:3000/api/food/get-food", {
      withCredentials: true,
    });
    setFoods(res.data);
  };

  const addFood = async (formData) => {
    try {
      await axios.post("http://localhost:3000/api/food/add-food", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
     getFoods();
    } catch (err) {
      console.log("ADD ERROR:", err.response?.data || err.message);
    }
  };

  const updateFood = async (id, data) => {
  try {
    console.log("Hello")
    const res = await axios.patch(
      `http://localhost:3000/api/food/update-food/${id}`,
      data,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log(res.data)
    getFoods();
  } catch (err) {
    console.log("UPDATE ERROR:", err.response?.data || err.message);
  }
};

  const deleteFood = async (id) => {
    await axios.delete(`http://localhost:3000/api/food/delete-food/${id}`, {
      withCredentials: true,
    });
  getFoods();
  };

  /* ---------- USERS ---------- */

  const getUsers = async () => {
    const res = await axios.get("http://localhost:3000/api/auth/get-users", {
      withCredentials: true,
    });
    setUsers(res.data.users);
  };

const updateUser = async (id, data) => {
  try {
    await axios.patch(
      `http://localhost:3000/api/auth/update-user/${id}`,
      data,
      { withCredentials: true }
    );

    await getUsers();
  } catch (err) {
    console.log("UPDATE USER ERROR:", err.response?.data || err.message);
  }
};

const deleteUser = async (id) => {
  try {
    await axios.delete(
      `http://localhost:3000/api/auth/delete-user/${id}`,
      { withCredentials: true }
    );

    await getUsers();
  } catch (err) {
    console.log("DELETE ERROR:", err.response?.data || err.message);
  }
};

  useEffect(() => {
    getFoods();
    getUsers();
  }, []);

  return (
    <AdminContext.Provider
      value={{
        foods,
        users,
        addFood,
        updateFood,
        deleteFood,
        getFoods,
        getUsers,
        updateUser,
        deleteUser,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
