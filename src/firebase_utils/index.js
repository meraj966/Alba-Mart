import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { async, uuidv4 } from "@firebase/util";
import { db, storage } from "../firebase-config";
import { collection, getDocs } from "@firebase/firestore";

async function uploadImage(image) {
  const storageRef = ref(storage, `images/${uuidv4()}-${image.name}`);

  const response = await uploadBytes(storageRef, image);
  const url = await getDownloadURL(response.ref);
  return url;
}

export async function uploadImages(images) {
  const imagePromises = Array.from(images, (image) => uploadImage(image));

  const imageRes = await Promise.all(imagePromises);
  return imageRes; // list of url like ["https://..", ...]
}

export const uploadImageAndSaveUrl = async (
  file,
  saveUrl,
  setPercent = () => {}
) => {
  const storageRef = ref(storage, `/images/${uuidv4() + file.name}`);
  const uploadTask = uploadBytesResumable(storageRef, file);
  uploadTask.on(
    "state_changed",
    (snapshot) => {
      const percent = String(
        Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100) +
          "%"
      );
      // update progress
      setPercent(percent);
    },
    (err) => console.log(err),
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
        await saveUrl(url);
      });
    }
  );
};

export const getAll = async (type) => {
  const ref = collection(db, type);
  const data = await getDocs(ref)
  return data.docs.map(data=>({...data.data(), id: data.id}))
}

export const getProductByIds = async (ids) => {
  let data = await getAll("Menu")
  return data.filter(i=> ids.includes(i.id))
}