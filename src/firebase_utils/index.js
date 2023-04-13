import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { uuidv4 } from "@firebase/util";
import { storage } from "../firebase-config";

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
