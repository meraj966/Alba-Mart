import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import {
  Modal,
  Stack,
  Autocomplete,
  TextField,
  Typography,
  Button,
} from "@mui/material";
import { collection, deleteDoc, doc, getDoc, getDocs, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase-config";
import Swal from "sweetalert2";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { BOX_STYLE } from "./reusable/Styles";
import PageTemplate from "./reusable/PageTemplate";
import ProductsGrid from "../products";
import ProductPopup from "../products/resuable/ProductPopup";
import AddProducts from "../products/AddProducts";
import EditForm from "../products/EditForm";
import VariantPopup from "./VariantPopup";

export default function Products() {
  const [categories, setCategories] = useState([]);
  const [originalRows, setOriginalRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = collection(db, "Menu");
  const [row, setRow] = useState(null);
  const [formid, setFormid] = useState("");
  const [openProductPreview, setOpenProductPreview] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [editopen, setEditOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const [variantPopupOpen, setVariantPopupOpen] = useState(false);

  // Store the unsubscribe functions in state
  const [unsubscribeFunctions, setUnsubscribeFunctions] = useState([]);

  const getMenuData = async () => {
    const menuData = await getDocs(menuRef);
    const rowsData = menuData.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setOriginalRows(rowsData);
    setRows(rowsData);
  };

  const handleOpenVariantPopup = () => {
    setVariantPopupOpen(true);
  };

  const handleCloseVariantPopup = () => {
    setVariantPopupOpen(false);
  };

  const handleBulkOpen = () => {
    setBulkOpen(true);
    setModalType("EDIT_OPEN");
  };

  const handleBulkClose = () => setBulkOpen(false);

  const handleEditOpen = () => {
    setEditOpen(true);
    setModalType("EDIT_OPEN");
  };

  const handleEditClose = () => {
    setEditOpen(false);
    setModalType("");
  };

  useEffect(() => {
    getMenuData();

    // Subscribe to menu data changes
    const menuUnsubscribe = onSnapshot(menuRef, (snapshot) => {
      const menuData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setOriginalRows(menuData);
      setRows(menuData);
    });

    // Subscribe to category data changes
    const categoryUnsubscribe = onSnapshot(collection(db, "category"), (snapshot) => {
      const categoryData = snapshot.docs.map((doc) => doc.data().name);
      const uniqueCategories = [
        ...new Set([
          ...originalRows.flatMap((item) => item.category),
          ...categoryData,
        ]),
      ];
      setCategories(uniqueCategories);
    });

    // Store the unsubscribe functions
    setUnsubscribeFunctions([menuUnsubscribe, categoryUnsubscribe]);

    return () => {
      // Unsubscribe from Firestore listeners
      unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
    };
  }, []);

  const filterData = (v) => {
    if (v) {
      const filteredRows = originalRows.filter((row) => row.category === v);
      setRows(filteredRows);
    } else {
      setRows(originalRows);
    }
  };

  const filterBySearchQuery = () => {
    if (searchQuery === "") {
      setRows(originalRows);
    } else {
      const filteredRows = originalRows.filter((row) =>
        row.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setRows(filteredRows);
    }
  };

  const clearSearchQuery = () => {
    setSearchQuery("");
    setRows(originalRows);
  };

  const modalTypeEditOpen = () => (
    <div>
      <Modal open={bulkOpen} sx={{ margin: "auto" }}>
        <Box
          sx={{
            ...BOX_STYLE,
            overflow: "scroll",
            maxHeight: "70%",
            width: "80%",
          }}
        >
          <AddProducts closeEvent={handleBulkClose} />
        </Box>
      </Modal>
      <Modal
        open={editopen}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={BOX_STYLE} className="editForm">
          <EditForm closeEvent={handleEditClose} fid={formid} />
        </Box>
      </Modal>
    </div>
  );

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: "20px",
  };

  const handleClosePreviewModal = () => {
    setModalType("");
    setOpenProductPreview(false);
    setRow(null);
  };

  const modalTypeProductPreview = () => (
    <Modal open={openProductPreview} onClose={handleClosePreviewModal}>
      <Box sx={style}>
        <ProductPopup
          {...row}
          data={row}
          deleteProd={getMenuData}
          clearRow={handleClosePreviewModal}
          setFormid={setFormid}
          handleEditOpen={handleEditOpen}
        />
      </Box>
    </Modal>
  );

  const editData = (row) => {
    const newData = {
      ...row,
      date: new Date(),
    };
    console.log("EDIT DATA", row);
    setFormid(newData);
    handleEditOpen();
  };

  const deleteApi = async (id) => {
    const userDoc = doc(db, "Menu", id);
    let productData = (await getDoc(userDoc)).data();
    console.log(productData, "product data")
    if (productData.saleTag) {
      const offerDocRef = doc(db, "Offers", productData.saleTag);
      let offerData = (await getDoc(offerDocRef)).data();
      let newProducts = [...offerData.products];
      newProducts = newProducts.filter((i) => i !== productData.saleTag);
      await updateDoc(offerDocRef, { products: newProducts });
    }
    await deleteDoc(userDoc);
    Swal.fire("Deleted!", "Your file has been deleted.", "success");
    getMenuData();
  };

  const deleteProduct = (row) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.value) {
        deleteApi(row.id);
      }
    });
  };

  return (
    <>
      <PageTemplate
        title="Products List"
        modal={
          modalType === "EDIT_OPEN"
            ? modalTypeEditOpen()
            : modalTypeProductPreview()
        }
        actionBar={
          <Stack direction="row" spacing={2} className="my-2 mb-2">
            <Autocomplete
              disablePortal
              id="combo-box-demo"
              options={categories}
              sx={{ width: 300 }}
              onChange={(e, v) => filterData(v)}
              renderInput={(params) => (
                <TextField {...params} size="small" label="Select Category" />
              )}
            />
            <TextField
              type="text"
              id="search"
              name="search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                filterBySearchQuery();
              }}
              label="Search by Product Name"
              size="small"
              sx={{ width: "250px" }}
            />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
            <Button
              variant="contained"
              endIcon={<AddCircleIcon />}
              onClick={handleBulkOpen}
            >
              Add Product
            </Button>
            <Button
              variant="contained"
              color="primary"
              endIcon={<AddCircleIcon />}
              onClick={handleOpenVariantPopup}
            >
              Add Variant
            </Button>

            <VariantPopup
              open={variantPopupOpen}
              handleClose={handleCloseVariantPopup}
            />
          </Stack>
        }
      >
        <ProductsGrid
          data={rows}
          openProductPreview={(row) => {
            console.log("product preview", row);
            setOpenProductPreview(true);
            setModalType("PRODUCT_PREVIEW");
            setRow(row);
          }}
          editData={editData}
          open={openProductPreview}
          selectedProd={row}
          deleteProduct={deleteProduct}
        />
      </PageTemplate>
    </>
  );
}
