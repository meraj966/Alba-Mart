import React, { useEffect, useState, useContext } from "react";
import PageTemplate from "./reusable/PageTemplate";
import {
  createLoggedInUserProfile,
  getAllUsers,
  getUserAccessData,
  updateUserAccessData,
} from "../api";
import {
  Card,
  CardContent,
  Grid,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import Dropdown from "../components/reusable/Dropdown";
import { AppContext } from "../context";
import {
  USER_TYPE_ADMIN,
  USER_TYPE_SUPER_USER,
  USER_TYPE_WORKER,
} from "../authentication/utils";

function Admin() {
  const { userInfo, accessKeyMapping } = useContext(AppContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedUserData, setSelectedUserData] = useState(null);

  useEffect(() => {
    const handleGetAllUsers = async () => {
      const users = await getAllUsers();
      setUsers(
        users.map((i) => ({
          label: i.displayName || i.email || i.phoneNumber,
          value: i,
        }))
      );
    };
    handleGetAllUsers();
  }, []);

  const handleUserChange = async (e) => {
    const user = e.target.value;
    setSelectedUser(user);
    if (user?.uid) {
      let userAccessData = await getUserAccessData(user.uid);
      if (userAccessData) setSelectedUserData(userAccessData);
      else {
        await createLoggedInUserProfile(user);
        userAccessData = await getUserAccessData(user.uid);
        setSelectedUserData(userAccessData);
      }
    } else {
      setSelectedUserData(null);
    }
  };

  const handleCheckboxChange = (level, key) => (e) => {
    const updatedAccessData = { ...selectedUserData };
    const accessList = updatedAccessData[level];
    if (e.target.checked) accessList.push(key);
    else {
      const index = accessList.indexOf(key);
      if (index > -1) {
        accessList.splice(index, 1);
      }
    }
    setSelectedUserData(updatedAccessData);
  };

  const handleSaveUpdatedDetails = async () => {
    await updateUserAccessData(selectedUserData);
  };

  const selectAll = (level, select) => {
    const updatedAccessData = { ...selectedUserData };
    const keys = Object.keys(
      accessKeyMapping[
        level == "pageLevelAccess" ? "pageLevel" : "controlLevel"
      ] || {}
    );

    if (select) {
      updatedAccessData[level] = [
        ...new Set([...updatedAccessData[level], ...keys]),
      ];
    } else {
      updatedAccessData[level] = [];
    }

    setSelectedUserData(updatedAccessData);
  };

  return (
    <PageTemplate title="Admin Controls">
      <Grid container spacing={2}>
        <Grid item xs={9}>
          <Dropdown
            label={"Select User"}
            data={users}
            value={selectedUser}
            defaultValue={selectedUser}
            onChange={handleUserChange}
          />
        </Grid>
        {selectedUser ? (
          <Grid item xs={3}>
            <Button
              variant="contained"
              style={{ float: "right", height: "100%" }}
              onClick={handleSaveUpdatedDetails}
            >
              Save User Details
            </Button>
          </Grid>
        ) : null}
      </Grid>

      <br />
      <br />
      {selectedUser ? (
        <>
          {userInfo?.userType == USER_TYPE_SUPER_USER ? (
            <Card>
              <h2 style={{ paddingLeft: "20px" }}>Modify User Type</h2>
              <hr />
              <CardContent>
                <Dropdown
                  label="User Type"
                  onChange={(e) =>
                    setSelectedUserData({
                      ...selectedUserData,
                      userType: e.target.value,
                    })
                  }
                  value={selectedUserData?.userType || ""}
                  data={[
                    { label: "Admin", value: USER_TYPE_ADMIN },
                    { value: USER_TYPE_SUPER_USER, label: "Super User" },
                    { label: "Worker", value: USER_TYPE_WORKER },
                  ]}
                />
              </CardContent>
            </Card>
          ) : null}
          <br />
          <br />
          <Card>
            <h2 style={{ paddingLeft: "20px" }}>
              Page Level Access{" "}
              <span style={{ float: "right", fontWeight: "400" }}>
                <Checkbox
                  onClick={(e) =>
                    selectAll("pageLevelAccess", e.target.checked)
                  }
                ></Checkbox>
                Select All
              </span>
            </h2>

            <hr />
            <CardContent>
              <Grid container spacing={2}>
                {Object.keys(accessKeyMapping?.pageLevel || {}).map((i) => (
                  <Grid item xs={3} key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            selectedUserData?.pageLevelAccess?.includes(i) ||
                            false
                          }
                          onChange={handleCheckboxChange("pageLevelAccess", i)}
                          name={accessKeyMapping.pageLevel[i]}
                        />
                      }
                      label={accessKeyMapping.pageLevel[i].split("_").join(" ")}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
          <br />
          <br />
          <Card>
            <h2 style={{ paddingLeft: "20px" }}>
              Control Level Access{" "}
              <span style={{ float: "right", fontWeight: "400" }}>
                <Checkbox
                  onClick={(e) =>
                    selectAll("controlLevelAccess", e.target.checked)
                  }
                ></Checkbox>
                Select All
              </span>
            </h2>

            <hr />
            <CardContent>
              <Grid container spacing={2}>
                {Object.keys(accessKeyMapping?.controlLevel || {}).map((i) => (
                  <Grid item xs={3} key={i}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            selectedUserData?.controlLevelAccess?.includes(i) ||
                            false
                          }
                          onChange={handleCheckboxChange(
                            "controlLevelAccess",
                            i
                          )}
                          name={accessKeyMapping.controlLevel[i]}
                        />
                      }
                      label={accessKeyMapping.controlLevel[i]
                        .split("_")
                        .join(" ")}
                    />
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      ) : null}
    </PageTemplate>
  );
}

export default Admin;
