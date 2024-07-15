import React from "react";
import PageTemplate from "./reusable/PageTemplate";
import { useEffect } from "react";
import { useState } from "react";
import { getAllUsers } from "../api";

function Admin() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const handleGetAllUsers = async () => {
      const users = await getAllUsers();
      setUsers(users);
    };
    handleGetAllUsers();
  }, []);
  
  return (
    <PageTemplate title="Admin Controls">
      <h2>Add Access to users</h2>
    </PageTemplate>
  );
}

export default Admin;
