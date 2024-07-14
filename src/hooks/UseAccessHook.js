import { collection, getDocs } from "firebase/firestore";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { db } from "../firebase-config";

const UseAccessHook = (type) => {
  const [hasAccess, setHasAccess] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(null);
  const userUid = window.localStorage.getItem("userId");
  const refAccessTypes = collection(db, "AccessTypes");
  const refManageAccess = collection(db, "ManageAccess");

  const getUserAccessData = async () => {
    console.log(userUid, "USER UID")
    setCheckingAccess(true)
    const accessTypes = await getDocs(refAccessTypes);
    const manageAccess = await getDocs(refManageAccess);
    const userAccessInfo = manageAccess?.docs
      .find((doc) => doc.id == userUid)
      ?.data();
    const [controlLevel, pageLevel] = accessTypes.docs.map((doc) => ({
      ...doc.data(),
    }));
    if (userAccessInfo?.pageLevel?.map(i=>pageLevel[i]).includes(type))
        setHasAccess(true)
    setCheckingAccess(false)
  };

  useEffect(() => {
    if (userUid) getUserAccessData();
  }, [type]);

  console.log(checkingAccess, hasAccess, "checkingAccess for a route")
  return [checkingAccess, hasAccess];
};

export default UseAccessHook;
