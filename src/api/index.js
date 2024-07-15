import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "../firebase-config";
import { USER_TYPE_WORKER } from "../authentication/utils";
import axios from "axios";

const BASE_API_URL = `https://us-central1-albamart-9de65.cloudfunctions.net`;

export async function getUserAccessData() {
  const refUserInfo = collection(db, "UserInfo");
  const uid = window.localStorage.getItem("userId");
  const manageAccess = await getDocs(refUserInfo);
  const userInfo = manageAccess?.docs?.find((doc) => doc.id == uid)?.data();
  return userInfo;
}

export async function getAccessKeyMappingData() {
  const refAccessTypes = collection(db, "AccessTypes");
  const accessTypes = await getDocs(refAccessTypes);
  const [controlLevel, pageLevel] = accessTypes.docs.map((doc) => ({
    ...doc.data(),
  }));
  return { controlLevel, pageLevel };
}

export async function createLoggedInUserProfile(user) {
  if (!user.uid) return;
  const refUserInfo = collection(db, "UserInfo");
  const userInfoDocs = await getDocs(refUserInfo);
  const allUserInfoData = userInfoDocs.docs.map((doc) => ({ ...doc.data() }));
  if (!allUserInfoData.find((u) => u.uid == user.uid))
    await setDoc(doc(db, "UserInfo", user.uid), {
      uid: user.uid,
      email: user.email,
      userType: USER_TYPE_WORKER,
      pageLevelAccess: ["100"],
      controlLevelAccess: [],
    });
}

export async function getAllUsers() {
  try {
    const userToken = window.localStorage.getItem("token");
    if (userToken) {
      // Get the ID token
      const response = await axios.get(`${BASE_API_URL}/getAllUsers`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      console.log("User data:", response.data);
      return response.data;
    }
  } catch (e) {
    console.error("Error fetching user data:", e);
  }
  return;
}
