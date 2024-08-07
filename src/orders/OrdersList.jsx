// Keeping the old logic commented because if anything fails we can revert it back

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   TableFooter,
//   Button,
//   Grid,
//   Typography,
// } from "@mui/material";
// import OpenInNewIcon from "@mui/icons-material/OpenInNew";
// import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import {
//   collection,
//   doc,
//   getDoc,
//   getDocs,
//   updateDoc,
// } from "firebase/firestore";
// import { db } from "../firebase-config";
// import { map, sum } from "lodash";
// import Box from "@mui/material/Box";
// import Dropdown from "../components/reusable/Dropdown";
// import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
// import Swal from "sweetalert2";
// import { DataGrid } from "@mui/x-data-grid";
// import { getOrdersGridColumns } from "../products/constants";

// function OrdersList({ orderData, isEdit, setIsEdit, refreshOrders }) {
//   const [users, setUser] = useState([]);
//   const [deliveryBoy, setDeliveryBoy] = useState([]);
//   const [updatedOrders, setUpdatedOrders] = useState([]);
//   const [orders, setOrders] = useState([...orderData]);
//   const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState({});

//   useEffect(() => {
//     getData();
//   }, []);

//   const getData = () => {
//     getUserByOrder();
//     getDeliveryBoy();
//   };

//   useEffect(() => {
//     setOrders([...orderData]);
//   }, [orderData]);

//   const getDeliveryBoy = async () => {
//     let deliveryBoyData = await getDocs(collection(db, "DeliveryBoy"));
//     setDeliveryBoy(
//       deliveryBoyData.docs.map((i) => ({ ...i.data(), id: i.id }))
//     );
//   };

//   const getUserByOrder = async () => {
//     let data = await getDocs(collection(db, "UserProfile"));
//     let users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
//     setUser(users);
//   };

//   const handleChange = (e, index, order, type) => {
//     let orderdata = [...orders];
//     setUpdatedOrders([...updatedOrders, order.id]);
//     orderdata[index][type] = e.target.value;
//     setOrders([...orderdata]);
//     setSelectedDeliveryBoys({
//       ...selectedDeliveryBoys,
//       [order.id]: e.target.value,
//     });
//   };

//   const deliveryBoyDropdown = (index, order) => {
//     if (
//       (order.orderStatus === "placed" || order.orderStatus === "processing") &&
//       deliveryBoy.some((i) => i.isAvailable && i.isActive)
//     ) {
//       const availableDeliveryBoys = deliveryBoy
//         .filter((i) => i.isAvailable && i.isActive)
//         .map((i) => ({ value: i.id, label: i.name }));

//       return (
//         <Dropdown
//           label="Delivery Boy"
//           value={selectedDeliveryBoys[order.id] || ""}
//           data={availableDeliveryBoys}
//           onChange={(e) => handleChange(e, index, order, "deliveryBoy")}
//         />
//       );
//     } else {
//       // Display the current delivery boy name if not editable
//       return (
//         <span>
//           {deliveryBoy.find((i) => i.id === order.deliveryBoy)?.name || "-"}
//         </span>
//       );
//     }
//   };

//   const statusDropdown = (index, order) => {
//     if (isEdit) {
//       return <span>{order.orderStatus}</span>;
//     } else {
//       return (
//         <Dropdown
//           label="Status"
//           value={orders[index].orderStatus}
//           onChange={(e) => handleChange(e, index, order, "orderStatus")}
//           data={ORDER_TYPE_DROPDOWN_VALUES}
//         />
//       );
//     }
//   };

//   const handleSave = async () => {
//     const currentDate = new Date();

//     const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')} ${currentDate.toLocaleTimeString('en-US', { hour12: false })}.${currentDate.getMilliseconds().toString().padStart(6, '0')}`;

//     updatedOrders.forEach(async (id) => {
//       const deliveryBoyDoc = await getDoc(doc(db, "DeliveryBoy", selectedDeliveryBoys[id]));
//       const deliveryBoyData = deliveryBoyDoc.data();
//       const deliveryBoyFCM = deliveryBoyData?.FCM || "";

//       await updateDoc(doc(db, "Order", id), {
//         ...orders.find((i) => i.id === id),
//         deliveryBoy: selectedDeliveryBoys[id],
//         deliveryBoyFCM,
//         deliveryBoyResponse: "none",
//         orderStatus: "processing",
//         processingDate: formattedDate,
//       });
//     });

//     setIsEdit(false);
//     setUpdatedOrders([]);
//     setSelectedDeliveryBoys({});
//     refreshOrders();
//   };

//   const sortedOrders = [...orders].sort((a, b) => {
//     const dateA = new Date(a.orderDate)?.getTime() || 0;
//     const dateB = new Date(b.orderDate)?.getTime() || 0;
//     return dateB - dateA;
//   });

//   return (
//     <Box sx={{ width: "100%" }}>
//       {isEdit ? (
//         <TableContainer>
//           <Table stickyHeader>
//             <TableHead>
//               <TableRow>
//                 <TableCell align="left">Order ID</TableCell>
//                 <TableCell align="left">Cust Name</TableCell>
//                 <TableCell align="left">Cust Contact</TableCell>
//                 <TableCell align="left">Total Amount</TableCell>
//                 <TableCell align="left">Order Date</TableCell>
//                 <TableCell align="left">Payment Mode</TableCell>
//                 <TableCell align="left">Status</TableCell>
//                 <TableCell align="left">
//                   {isEdit ? "Assign Delivery Boy" : "Delivery Boy"}
//                 </TableCell>
//                 <TableCell align="left">Options</TableCell>
//               </TableRow>
//             </TableHead>
//             <TableBody>
//               {sortedOrders.map((order, index) => {
//                 const user = users.find((i) => i.user === order.userID);
//                 return (
//                   <TableRow hover tabIndex={-1} key={order.id}>
//                     <TableCell align="left">AM-{order.orderNumber}</TableCell>
//                     <TableCell align="left">{user?.name}</TableCell>
//                     <TableCell align="left">{user?.phoneNo}</TableCell>
//                     <TableCell align="left">{order.netPrice}</TableCell>
//                     <TableCell align="left">
//                       {order && order.orderDate ? order.orderDate.split(" ")[0] : ""}
//                     </TableCell>
//                     <TableCell align="left">
//                       {order.paymentType || "-"}
//                     </TableCell>
//                     <TableCell align="left">
//                         {isEdit
//                           ? statusDropdown(index, order)
//                           : order.orderStatus}
//                       </TableCell>
//                     <TableCell align="left">
//                       {isEdit
//                         ? deliveryBoyDropdown(index, order)
//                         : deliveryBoy.find((i) => i.id === order.deliveryBoy)
//                           ?.name || "-"}
//                     </TableCell>
//                     <TableCell align="left">
//                       <Link
//                         to={`/order-details/${order.orderId}`}
//                         target="_blank"
//                         rel="noopener noreferrer"
//                       >
//                         <OpenInNewIcon />
//                       </Link>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>

//           {isEdit && (
//             <Grid item xs={12}>
//               <Button
//                 style={{
//                   float: "right",
//                   margin: "10px 10px 0",
//                   background: "#1976d2",
//                   color: "white",
//                 }}
//                 onClick={handleSave}
//               >
//                 Save
//               </Button>
//             </Grid>
//           )}
//         </TableContainer>
//       ) : (
//         <DataGrid
//           rows={sortedOrders}
//           columns={getOrdersGridColumns(
//             users,
//             isEdit,
//             // null,
//             statusDropdown,
//             deliveryBoy
//           )}
//           autoHeight={true}
//         ></DataGrid>
//       )}
//     </Box>
//   );
// }

// export default OrdersList;


//-------------------------------------------------------------------------------------------------------------


import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase-config";
import { map, sum } from "lodash";
import Box from "@mui/material/Box";
import Dropdown from "../components/reusable/Dropdown";
import { ORDER_TYPE_DROPDOWN_VALUES } from "../Constants";
import Swal from "sweetalert2";
import { DataGrid } from "@mui/x-data-grid";
import { getOrdersGridColumns } from "../products/constants";

function OrdersList({ orderData, isEdit, setIsEdit, refreshOrders }) {
  const [users, setUser] = useState([]);
  const [deliveryBoy, setDeliveryBoy] = useState([]);
  const [updatedOrders, setUpdatedOrders] = useState([]);
  const [orders, setOrders] = useState([...orderData]);
  const [selectedDeliveryBoys, setSelectedDeliveryBoys] = useState({});

  useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    getUserByOrder();
    getDeliveryBoy();
  };

  useEffect(() => {
    setOrders([...orderData]);
  }, [orderData]);

  const getDeliveryBoy = async () => {
    let deliveryBoyData = await getDocs(collection(db, "DeliveryBoy"));
    setDeliveryBoy(
      deliveryBoyData.docs.map((i) => ({ ...i.data(), id: i.id }))
    );
  };

  const getUserByOrder = async () => {
    let data = await getDocs(collection(db, "UserProfile"));
    let users = data.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setUser(users);
  };

  const handleChange = (e, index, order, type) => {
    let orderdata = [...orders];
    setUpdatedOrders([...updatedOrders, order.id]);
    orderdata[index][type] = e.target.value;
    setOrders([...orderdata]);
    setSelectedDeliveryBoys({
      ...selectedDeliveryBoys,
      [order.id]: e.target.value,
    });
  };

  const deliveryBoyDropdown = (index, order) => {
    if (
      (order.orderStatus === "placed" || order.orderStatus === "processing") &&
      deliveryBoy.some((i) => i.isAvailable && i.isActive)
    ) {
      const availableDeliveryBoys = deliveryBoy
        .filter((i) => i.isAvailable && i.isActive)
        .map((i) => ({ value: i.id, label: i.name }));

      return (
        <Dropdown
          label="Delivery Boy"
          value={selectedDeliveryBoys[order.id] || ""}
          data={availableDeliveryBoys}
          onChange={(e) => handleChange(e, index, order, "deliveryBoy")}
        />
      );
    } else {
      // Display the current delivery boy name if not editable
      return (
        <span>
          {deliveryBoy.find((i) => i.id === order.deliveryBoy)?.name || "-"}
        </span>
      );
    }
  };

  const filteredOrderTypeDropdownValues = ORDER_TYPE_DROPDOWN_VALUES.filter(
    (item) => item.value === "processing" || item.value === "canceled"
  );

  const statusDropdown = (index, order) => {
    if (order.orderStatus === "pending") {
      return (
        <Dropdown
          label="Status"
          value={orders[index].orderStatus}
          onChange={(e) => handleChange(e, index, order, "orderStatus")}
          data={filteredOrderTypeDropdownValues}
        />
      );
    } else {
      return <span>{order.orderStatus}</span>;
    }
  };

  const handleSave = async () => {
    const currentDate = new Date();

    const formattedDate = `${currentDate.getFullYear()}-${(
      currentDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${currentDate
      .getDate()
      .toString()
      .padStart(2, "0")} ${currentDate.toLocaleTimeString("en-US", {
      hour12: false,
    })}.${currentDate.getMilliseconds().toString().padStart(6, "0")}`;

    for (const id of updatedOrders) {
      const orderToUpdate = orders.find((i) => i.id === id);

      // Check if the status is "canceled"
      if (orderToUpdate.orderStatus === "canceled") {
        // If canceled, update order status to "canceled" and add cancelComment
        await updateDoc(doc(db, "Order", id), {
          ...orderToUpdate,
          orderStatus: "canceled",
          cancelComment: "return", // Set cancelComment to "return"
          cancelReason: "Payment not successful. Please contact your bank for any money deducted",
          canceledDate: formattedDate,
          paymentStatus: "failed",
        });
      } else {
        // For other statuses, proceed with existing logic
        const deliveryBoyDoc = await getDoc(
          doc(db, "DeliveryBoy", selectedDeliveryBoys[id])
        );
        const deliveryBoyData = deliveryBoyDoc.data();
        const deliveryBoyFCM = deliveryBoyData?.FCM || "";

        await updateDoc(doc(db, "Order", id), {
          ...orderToUpdate,
          deliveryBoy: selectedDeliveryBoys[id],
          deliveryBoyFCM,
          deliveryBoyResponse: "none",
          orderStatus: "processing",
          processingDate: formattedDate,
        });
      }
    }

    setIsEdit(false);
    setUpdatedOrders([]);
    setSelectedDeliveryBoys({});
    refreshOrders();
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const dateA = new Date(a.orderDate)?.getTime() || 0;
    const dateB = new Date(b.orderDate)?.getTime() || 0;
    return dateB - dateA;
  });

  return (
    <Box sx={{ width: "100%" }}>
      {isEdit ? (
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align="left">Order ID</TableCell>
                <TableCell align="left">Cust Name</TableCell>
                <TableCell align="left">Cust Contact</TableCell>
                <TableCell align="left">Total Amount</TableCell>
                <TableCell align="left">Order Date</TableCell>
                <TableCell align="left">Payment Mode</TableCell>
                <TableCell align="left">Status</TableCell>
                <TableCell align="left">
                  {isEdit ? "Assign Delivery Boy" : "Delivery Boy"}
                </TableCell>
                <TableCell align="left">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedOrders.map((order, index) => {
                const user = users.find((i) => i.user === order.userID);
                return (
                  <TableRow hover tabIndex={-1} key={order.id}>
                    <TableCell align="left">AM-{order.orderNumber}</TableCell>
                    <TableCell align="left">{user?.name}</TableCell>
                    <TableCell align="left">{user?.phoneNo}</TableCell>
                    <TableCell align="left">{order.netPrice}</TableCell>
                    <TableCell align="left">
                      {order && order.orderDate
                        ? order.orderDate.split(" ")[0]
                        : ""}
                    </TableCell>
                    <TableCell align="left">
                      {order.paymentType || "-"}
                    </TableCell>
                    <TableCell align="left">
                      {isEdit
                        ? statusDropdown(index, order)
                        : order.orderStatus}
                    </TableCell>
                    <TableCell align="left">
                      {isEdit
                        ? deliveryBoyDropdown(index, order)
                        : deliveryBoy.find((i) => i.id === order.deliveryBoy)
                            ?.name || "-"}
                    </TableCell>
                    <TableCell align="left">
                      <Link
                        to={`/order-details/${order.orderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <OpenInNewIcon />
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {isEdit && (
            <Grid item xs={12}>
              <Button
                style={{
                  float: "right",
                  margin: "10px 10px 0",
                  background: "#1976d2",
                  color: "white",
                }}
                onClick={handleSave}
              >
                Save
              </Button>
            </Grid>
          )}
        </TableContainer>
      ) : (
        <DataGrid
          rows={sortedOrders}
          columns={getOrdersGridColumns(
            users,
            isEdit,
            // null,
            statusDropdown,
            deliveryBoy
          )}
          autoHeight={true}
        ></DataGrid>
      )}
    </Box>
  );
}

export default OrdersList;
