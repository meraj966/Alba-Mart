import React, { useState, useEffect } from "react";
import {
  collection,
  addDoc,
  updateDoc,
  setDoc,
  doc,
  getDoc,
  deleteDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase-config";
import {
  TextField,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  Card,
  Grid,
  CardHeader,
  CardContent,
} from "@mui/material";
import Swal from "sweetalert2";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase Storage

function AddNewCategory({
  data,
  isEditMode,
  refreshCategory,
  handleClose,
}) {
  const [name, setName] = useState(isEditMode ? data.name : "");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(isEditMode ? data.imageUrl : "");

  useEffect(() => {
    setImageUrl(isEditMode ? data.imageUrl : "");
  }, [data, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);

    // Display a preview of the selected image (optional)
    const reader = new FileReader();
    reader.onload = (e) => {
      setImageUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToStorage = async (file) => {
    try {
      const storageRef = ref(storage, `/category-images/${file.name}`);
      await uploadBytesResumable(storageRef, file);
      return getDownloadURL(storageRef);
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isEditMode) {
      // Check if category already exists in the database
      const categoryRef = doc(db, 'category', name);
      const categorySnapshot = await getDoc(categoryRef);

      if (categorySnapshot.exists()) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: `Category - '${name}' is an existing Category. Please add another.`,
        });
        return;
      }
    }

    try {
      let updatedImageUrl = imageUrl;

      if (image) {
        // If a new image is selected, upload it to Firebase Storage
        updatedImageUrl = await uploadImageToStorage(image);
      }

      if (isEditMode) {
        // Get the existing category document
        const categoryDocRef = doc(db, 'category', data.name);
        const categoryDocSnapshot = await getDoc(categoryDocRef);

        if (categoryDocSnapshot.exists()) {
          // Extract the existing subCategory data
          const subCategoryData = categoryDocSnapshot.data().subCategory || {};

          // Delete the old category document
          await deleteDoc(categoryDocRef);

          // Create a new category document with the updated name and image URL
          await setDoc(doc(db, 'category', name), {
            name,
            imageUrl: updatedImageUrl, // Save updated imageUrl
            subCategory: subCategoryData, // Preserve the existing subCategory data
          });

          Swal.fire('Successful!', 'Category updated', 'success');
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `Category - '${name}' does not exist. Cannot update.`,
          });
        }
      } else {
        // Add new Category with the new image URL
        await setDoc(doc(collection(db, 'category'), name), {
          name,
          imageUrl: updatedImageUrl, // Save updated imageUrl
        });
        Swal.fire('Successful!', 'Category added', 'success');
      }

      refreshCategory();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      Swal.fire("Error", "An error occurred while saving data.", "error");
    }
  };

  const handleCategoryChange = (event) => {
    setName(event.target.value);
  };

  return (
    <Card
      sx={{
        marginTop: "25px",
        border: "1px solid",
        maxHeight: "90vh",
        overflow: "auto",
      }}
    >
      <CardHeader title="Add Category" />
      <CardContent>
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField
              label="Category Name"
              type="text"
              value={name}
              onChange={handleCategoryChange}
              sx={{ mb: 2 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              sx={{ mb: 2 }}
            />
            {imageUrl && (
              <img src={imageUrl} alt="Category" style={{ maxWidth: "100%" }} />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" align="right">
              <Button variant="contained" onClick={handleSubmit}>
                Submit
              </Button>
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

export default AddNewCategory;
