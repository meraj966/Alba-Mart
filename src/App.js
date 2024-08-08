import React from "react";
import { createContext } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { getAccessKeyMappingData, getUserAccessData } from "./api";
import { AppContext } from "./context";
import AppRoutes from "./AppRoutes";

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [accessKeyMapping, setAccessKeyMapping] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleDataLoad = async () => {
    const userInfo = await getUserAccessData(
      window.localStorage.getItem("userId")
    );
    const accessKeyMappingData = await getAccessKeyMappingData();
    setAccessKeyMapping(accessKeyMappingData);
    setUserInfo(userInfo);
    setIsLoading(false);
  };

  useEffect(() => {
    if (
      userInfo?.controlLevelAccess?.find((i) => Number(i)) ||
      userInfo?.pageLevelAccess?.find((i) => Number(i))
    ) {
      let userDetails = { ...userInfo };
      userDetails.controlLevelAccess = userDetails.controlLevelAccess.map(
        (i) => accessKeyMapping.controlLevel[i]
      );
      userDetails.pageLevelAccess = userDetails.pageLevelAccess.map(
        (i) => accessKeyMapping.pageLevel[i]
      );
      setUserInfo(userDetails);
    }
  }, [accessKeyMapping, userInfo]);

  useEffect(() => {
    if (isLoading) handleDataLoad();
  }, []);

  return !isLoading ? (
    <>
      <AppContext.Provider value={{ userInfo, accessKeyMapping }}>
        <AppRoutes />
      </AppContext.Provider>
    </>
  ) : (
    <i>Loading</i>
  );
}
