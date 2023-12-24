import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { collection, getDocs, doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage"; // Import Firebase Storage
import { db, storage } from "../../firebase-config"; // Make sure to import your Firebase configuration properly
import Swal from "sweetalert2";

function AddNewSubcategory({ closeModal }) {
    const [subcategoryName, setSubcategoryName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null); // Add this line to declare imagePreview state

    useEffect(() => {
        // Fetch categories from "category" database
        const fetchCategories = async () => {
            const categoryRef = collection(db, "category");
            try {
                const querySnapshot = await getDocs(categoryRef);

                const categoriesList = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name,
                }));

                setCategories(categoriesList);
                setLoading(false); // Set loading to false once data is fetched
            } catch (error) {
                console.error("Error fetching categories:", error);
                setLoading(false); // Set loading to false in case of an error
            }
        };

        fetchCategories();
    }, []);

    const handleSubcategoryNameChange = (event) => {
        setSubcategoryName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);

        const imageUrl = URL.createObjectURL(file);
        setImagePreview(imageUrl);
    };

    // ...

    const handleSave = async () => {
        try {
            if (!subcategoryName.trim() || !selectedCategory || !selectedImage) {
                // Check if subcategoryName is empty
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Please enter subcategory name and ensure all fields are filled.',
                });
                return;
            }

            const categoryAndSubRef = collection(db, "category");
            const categoryDocRef = doc(categoryAndSubRef, selectedCategory);
            const categoryDoc = await getDoc(categoryDocRef);

            if (!categoryDoc.exists()) {
                console.error("Selected category does not exist.");
                return;
            }

            const categoryData = categoryDoc.data() || {};
            const subcategoriesMap = categoryData.subCategory || {};

            if (subcategoriesMap[subcategoryName]) {
                console.error("Subcategory already exists.");
                return;
            }

            const storageRef = ref(storage, `/images/${Math.random() + selectedImage.name}`);
            await uploadBytesResumable(storageRef, selectedImage);
            const imageUrl = await getDownloadURL(storageRef);
            // const subcategoryDocRef = doc(categoryDocRef, "Subcategories", subcategoryName);
            const subcategoryData = {
                subcategoryName: subcategoryName,
                imageUrl: imageUrl,
            };
            // await setDoc(subcategoryDocRef, subcategoryData);
            subcategoriesMap[subcategoryName] = subcategoryData;
            await updateDoc(categoryDocRef, {
                subCategory: subcategoriesMap,
            });

            Swal.fire("Success", "Data saved successfully!", "success");
            closeModal();
        } catch (error) {
            console.error("Error saving data:", error);
            Swal.fire("Error", "An error occurred while saving data.", "error");
        }
    };


    return (
        <Dialog open={true} onClose={closeModal} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add Subcategory</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="subcategoryName"
                    label="Subcategory Name"
                    fullWidth
                    value={subcategoryName}
                    onChange={handleSubcategoryNameChange}
                />
                <FormControl fullWidth>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                    >
                        {loading ? (
                            <MenuItem disabled>Loading categories...</MenuItem>
                        ) : (
                            categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>
                                    {category.name}
                                </MenuItem>
                            ))
                        )}
                    </Select>
                </FormControl>
                <input
                    type="file"
                    accept="image/*"
                    id="image-upload"
                    style={{ display: "none" }}
                    onChange={handleImageChange}
                />
                <label htmlFor="image-upload">
                    <Button variant="outlined" component="span">
                        Upload Image
                    </Button>
                </label>
                {/* Image Preview */}
                {imagePreview && (
                    <div>
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color="primary">
                    Cancel
                </Button>
                <Button onClick={handleSave} color="primary">
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AddNewSubcategory;
