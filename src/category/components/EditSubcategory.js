// import React, { useState, useEffect } from "react";
// import {
//     TextField,
//     Button,
//     Dialog,
//     DialogActions,
//     DialogContent,
//     DialogTitle,
//     FormControl,
//     InputLabel,
//     Select,
//     MenuItem,
// } from "@mui/material";
// import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
// import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
// import Swal from "sweetalert2";
// import { db, storage } from "../../firebase-config";

// function EditSubcategory({ closeModal, subcategoryData, categoryId }) {
//     const [editedSubcategoryName, setEditedSubcategoryName] = useState(subcategoryData.subcategoryName);
//     const [selectedCategory, setSelectedCategory] = useState(categoryId);
//     const [selectedImage, setSelectedImage] = useState(null);
//     const [editedImageUrl, setEditedImageUrl] = useState(subcategoryData.imageUrl);

//     useEffect(() => {
//         setEditedSubcategoryName(subcategoryData.subcategoryName);
//         setEditedImageUrl(subcategoryData.imageUrl);
//     }, [subcategoryData]);

//     const handleSubcategoryNameChange = (event) => {
//         setEditedSubcategoryName(event.target.value);
//     };

//     const handleCategoryChange = (event) => {
//         setSelectedCategory(event.target.value);
//     };

//     const handleImageChange = async (event) => {
//         const file = event.target.files[0];
//         setSelectedImage(file);

//         const imageUrl = URL.createObjectURL(file);
//         setEditedImageUrl(imageUrl);

//         try {
//             const storageRef = ref(storage, `/images/${Math.random() + file.name}`);
//             await uploadBytesResumable(storageRef, file);
//             const newImageUrl = await getDownloadURL(storageRef);
//             setEditedImageUrl(newImageUrl);
//         } catch (error) {
//             console.error("Error uploading image:", error);
//             Swal.fire("Error", "An error occurred while uploading the image.", "error");
//         }
//     };

//     const handleSave = async () => {
//         try {
//             if (!editedSubcategoryName || !selectedCategory) {
//                 console.error("Please fill in all required fields.");
//                 return;
//             }

//             const categoryAndSubRef = collection(db, "category");
//             const categoryDocRef = doc(categoryAndSubRef, selectedCategory);
//             const categoryDoc = await getDoc(categoryDocRef);

//             if (!categoryDoc.exists()) {
//                 console.error("Selected category does not exist.");
//                 return;
//             }

//             const categoryData = categoryDoc.data() || {};
//             const subcategoriesMap = categoryData.subCategory || {};

//             if (subcategoryData.subcategoryName !== editedSubcategoryName && subcategoriesMap[editedSubcategoryName]) {
//                 console.error("Subcategory name already exists.");
//                 return;
//             }

//             subcategoriesMap[editedSubcategoryName] = {
//                 subcategoryName: editedSubcategoryName,
//                 imageUrl: editedImageUrl,
//             };

//             if (subcategoryData.subcategoryName !== editedSubcategoryName) {
//                 delete subcategoriesMap[subcategoryData.subcategoryName];
//             }

//             await updateDoc(categoryDocRef, {
//                 subCategory: subcategoriesMap,
//             });

//             Swal.fire("Success", "Data saved successfully!", "success");
//             closeModal();
//         } catch (error) {
//             console.error("Error saving data:", error);
//             Swal.fire("Error", "An error occurred while saving data.", "error");
//         }
//     };

//     return (
//         <Dialog open={true} onClose={closeModal} aria-labelledby="form-dialog-title">
//             <DialogTitle id="form-dialog-title">Edit Subcategory</DialogTitle>
//             <DialogContent>
//                 <TextField
//                     autoFocus
//                     margin="dense"
//                     id="subcategoryName"
//                     label="Subcategory Name"
//                     fullWidth
//                     value={editedSubcategoryName}
//                     onChange={handleSubcategoryNameChange}
//                 />
//                 <FormControl fullWidth>
//                     <InputLabel id="category-label">Category</InputLabel>
//                     <Select
//                         labelId="category-label"
//                         id="category"
//                         value={selectedCategory}
//                         onChange={handleCategoryChange}
//                     >
//                         {/* Render your category options here */}
//                     </Select>
//                 </FormControl>
//                 <input
//                     type="file"
//                     accept="image/*"
//                     id="image-upload"
//                     style={{ display: "none" }}
//                     onChange={handleImageChange}
//                 />
//                 <label htmlFor="image-upload">
//                     <Button variant="outlined" component="span">
//                         Upload New Image
//                     </Button>
//                 </label>
//                 {editedImageUrl && (
//                     <div>
//                         <img
//                             src={editedImageUrl}
//                             alt="Preview"
//                             style={{ maxWidth: "100%", maxHeight: "200px" }}
//                         />
//                     </div>
//                 )}
//             </DialogContent>
//             <DialogActions>
//                 <Button
//                     onClick={closeModal}
//                     color="primary"
//                     style={{ marginRight: "10px", backgroundColor: "#007bff", color: "white" }}
//                 >
//                     Cancel
//                 </Button>
//                 <Button
//                     onClick={handleSave}
//                     color="primary"
//                     style={{ backgroundColor: "#007bff", color: "white" }}
//                 >
//                     Save
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// }

// export default EditSubcategory;












import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { collection, doc, updateDoc, getDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import Swal from "sweetalert2";
import { db, storage } from "../../firebase-config";

function EditSubcategory({ closeModal, subcategoryData, categoryId }) {
    const [editedSubcategoryName, setEditedSubcategoryName] = useState(subcategoryData.subcategoryName);
    const [selectedCategory, setSelectedCategory] = useState(categoryId);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editedImageUrl, setEditedImageUrl] = useState(subcategoryData.imageUrl);

    useEffect(() => {
        setEditedSubcategoryName(subcategoryData.subcategoryName);
        setEditedImageUrl(subcategoryData.imageUrl);
    }, [subcategoryData]);

    const handleSubcategoryNameChange = (event) => {
        setEditedSubcategoryName(event.target.value);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    const handleImageChange = async (event) => {
        const file = event.target.files[0];
        setSelectedImage(file);
    
        try {
            const storageRef = ref(storage, `/images/${Math.random() + file.name}`);
            await uploadBytesResumable(storageRef, file);
            const newImageUrl = await getDownloadURL(storageRef);
            setEditedImageUrl(newImageUrl); // Update the state with the cloud storage URL
        } catch (error) {
            console.error("Error uploading image:", error);
            Swal.fire("Error", "An error occurred while uploading the image.", "error");
        }
    };    

    const handleSave = async () => {
        try {
            if (!editedSubcategoryName || !selectedCategory) {
                console.error("Please fill in all required fields.");
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

            if (subcategoryData.subcategoryName !== editedSubcategoryName && subcategoriesMap[editedSubcategoryName]) {
                console.error("Subcategory name already exists.");
                return;
            }

            subcategoriesMap[editedSubcategoryName] = {
                subcategoryName: editedSubcategoryName,
                imageUrl: editedImageUrl,
            };

            if (subcategoryData.subcategoryName !== editedSubcategoryName) {
                delete subcategoriesMap[subcategoryData.subcategoryName];
            }

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
            <DialogTitle id="form-dialog-title">Edit Subcategory</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    id="subcategoryName"
                    label="Subcategory Name"
                    fullWidth
                    value={editedSubcategoryName}
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
                        {/* Render your category options here */}
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
                        Upload New Image
                    </Button>
                </label>
                {editedImageUrl && (
                    <div>
                        <img
                            src={editedImageUrl}
                            alt="Preview"
                            style={{ maxWidth: "100%", maxHeight: "200px" }}
                        />
                    </div>
                )}
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={closeModal}
                    color="primary"
                    style={{ marginRight: "10px", backgroundColor: "#007bff", color: "white" }}
                >
                    Cancel
                </Button>
                <Button
                    onClick={handleSave}
                    color="primary"
                    style={{ backgroundColor: "#007bff", color: "white" }}
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditSubcategory;
