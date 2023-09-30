// import React, { useEffect, useState } from "react";
// import {
//   Stack,
//   Typography,
//   Button,
//   Box,
//   Modal,
//   FormControl,
//   InputLabel,
//   Select,
//   MenuItem,
// } from "@mui/material";
// import AddNewCategory from "../category/components/AddNewCategory";
// import CategoryList from "../category/components/CategoryList";
// import AddNewSubcategory from "../category/components/AddNewSubcategory"; // Import the AddNewSubcategory component
// import PageTemplate from "../pages/reusable/PageTemplate";
// import AddCircleIcon from "@mui/icons-material/AddCircle";
// import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
// import { db } from "../firebase-config";
// import Swal from "sweetalert2";

// function CategoryDetails() {
//   const [addNewCategory, setAddNewCategory] = useState(false);
//   const handleOpen = () => setAddNewCategory(true);
//   const handleClose = () => setAddNewCategory(false);
//   const [categoryModalData, setCategoryModalData] = useState(null);
//   const [openInEditMode, setOpenInEditMode] = useState(false);
//   const [categoryData, setCategoryData] = useState([]);
//   const ref = collection(db, "CategoryAndSub");

//   useEffect(() => {
//     getCategoryData();
//   }, []);

//   const getCategoryData = async () => {
//     const data = await getDocs(ref);
//     setCategoryData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
//   };

//   const handleDelete = async (id) => {
//     // Show the confirmation dialog using Swal.fire with custom button styles
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "Cancel",
//       confirmButtonColor: "#1976d2", // Blue color for "Yes, delete it!"
//       cancelButtonColor: "#ff5722", // Red color for "Cancel"
//     });

//     if (result.isConfirmed) {
//       await deleteDoc(doc(ref, id));
//       setCategoryData(categoryData.filter((row) => row.id !== id));
//       Swal.fire("Deleted!", "Your entry has been deleted.", "success");
//     }
//   };

//   const modal = () => (
//     <Modal onClose={() => setAddNewCategory(false)} open={addNewCategory}>
//       <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
//         <AddNewCategory
//           closeModal={() => setAddNewCategory(false)}
//           isEditMode={openInEditMode}
//           data={categoryModalData}
//           refreshCategory={getCategoryData}
//           handleClose={handleClose}
//         />
//       </Box>
//     </Modal>
//   );

//   const actionBar = () => (
//     <>
//       <Stack direction="row" spacing={2} className="my-2 mb-2">
//         <Typography
//           variant="h6"
//           component="div"
//           sx={{ flexGrow: 1 }}
//         ></Typography>
//         <Button
//           variant="contained"
//           endIcon={<AddCircleIcon />}
//           onClick={() => {
//             handleOpen();
//             setOpenInEditMode(false);
//           }}
//         >
//           Add Category
//         </Button>
//         <Button
//           variant="contained"
//           endIcon={<AddCircleIcon />}
//           onClick={() => {
//             // Add your logic for "Add Subcategory" here
//           }}
//         >
//           Add Subcategory
//         </Button>
//       </Stack>
//     </>
//   );

//   return (
//     <>
//       <PageTemplate
//         modal={modal()}
//         actionBar={actionBar()}
//         title={"Promo Codes"}
//       >
//         <CategoryList
//           openModal={(row) => {
//             setOpenInEditMode(true);
//             setCategoryModalData(row);
//             handleOpen();
//           }}
//           categoryData={categoryData}
//           handleDelete={handleDelete}
//         />
//       </PageTemplate>
//     </>
//   );
// }

// export default CategoryDetails;







import React, { useEffect, useState } from "react";
import {
  Stack,
  Typography,
  Button,
  Box,
  Modal,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import AddNewCategory from "../category/components/AddNewCategory";
import CategoryList from "../category/components/CategoryList";
import AddNewSubcategory from "../category/components/AddNewSubcategory"; // Import the AddNewSubcategory component
import PageTemplate from "../pages/reusable/PageTemplate";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase-config";
import Swal from "sweetalert2";

function CategoryDetails() {
  const [addNewCategory, setAddNewCategory] = useState(false);
  const handleOpen = () => setAddNewCategory(true);
  const handleClose = () => setAddNewCategory(false);

  const [addNewSubcategory, setAddNewSubcategory] = useState(false); // Step 1: Create state variable
  const handleOpenSubcategoryForm = () => setAddNewSubcategory(true); // Step 2: Function to open the popup form
  const handleCloseSubcategoryForm = () => setAddNewSubcategory(false); // Function to close the popup form

  const [categoryModalData, setCategoryModalData] = useState(null);
  const [openInEditMode, setOpenInEditMode] = useState(false);
  const [categoryData, setCategoryData] = useState([]);
  const ref = collection(db, "CategoryAndSub");

  useEffect(() => {
    getCategoryData();
  }, []);

  const getCategoryData = async () => {
    const data = await getDocs(ref);
    setCategoryData(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
  };

  const handleDelete = async (id) => {
    // Show the confirmation dialog using Swal.fire with custom button styles
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "Cancel",
      confirmButtonColor: "#1976d2", // Blue color for "Yes, delete it!"
      cancelButtonColor: "#ff5722", // Red color for "Cancel"
    });

    if (result.isConfirmed) {
      await deleteDoc(doc(ref, id));
      setCategoryData(categoryData.filter((row) => row.id !== id));
      Swal.fire("Deleted!", "Your entry has been deleted.", "success");
    }
  };

  const modal = () => (
    <Modal onClose={() => setAddNewCategory(false)} open={addNewCategory}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        <AddNewCategory
          closeModal={() => setAddNewCategory(false)}
          isEditMode={openInEditMode}
          data={categoryModalData}
          refreshCategory={getCategoryData}
          handleClose={handleClose}
        />
      </Box>
    </Modal>
  );

  const subcategoryModal = () => ( // Step 3: Create the popup form component
    <Modal onClose={handleCloseSubcategoryForm} open={addNewSubcategory}>
      <Box sx={{ width: "50%", margin: "0 auto", top: "50%" }}>
        {/* Pass any necessary props to the AddNewSubcategory component */}
        <AddNewSubcategory closeModal={handleCloseSubcategoryForm} />
      </Box>
    </Modal>
  );

  const actionBar = () => (
    <>
      <Stack direction="row" spacing={2} className="my-2 mb-2">
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={() => {
            handleOpen();
            setOpenInEditMode(false);
          }}
        >
          Add Category
        </Button>
        <Button
          variant="contained"
          endIcon={<AddCircleIcon />}
          onClick={handleOpenSubcategoryForm} // Step 4: Open the popup form for adding a subcategory
        >
          Add Subcategory
        </Button>
      </Stack>
    </>
  );

  return (
    <>
      <PageTemplate
        modal={modal()}
        actionBar={actionBar()}
        title={"Category"}
      >
        <CategoryList
          openModal={(row) => {
            setOpenInEditMode(true);
            setCategoryModalData(row);
            handleOpen();
          }}
          categoryData={categoryData}
          handleDelete={handleDelete}
        />
      </PageTemplate>

      {subcategoryModal()} {/* Step 5: Render the popup form for adding a subcategory conditionally */}
    </>
  );
}

export default CategoryDetails;
