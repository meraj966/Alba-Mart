import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db, storage } from "../../firebase-config"; // Assuming you have imported 'storage' from the Firebase SDK

function DeliveryBoyDetails({ deliveryBoy }) {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchImage = async () => {
      const storageRef = storage.ref();
      // Assuming you have a field named "image" in the delivery boy document
      const imageRef = storageRef.child(deliveryBoy.profilePic);
      const url = await imageRef.getDownloadURL();
      setImageUrl(url);
    };

    fetchImage();
  }, [deliveryBoy]);

  return (
    <div>
      {deliveryBoy ? (
        <div>
          <h1>{`${deliveryBoy.name} Detail`}</h1>
          <p>Name: {deliveryBoy.name}</p>
          <p>DL Number: {deliveryBoy.dlnumber}</p>
          <p>Phone Number: {deliveryBoy.phoneNumber}</p>
          <p>Date Of Joining: {deliveryBoy.joinDate}</p>
          <p>Address: {deliveryBoy.address}</p>
          {imageUrl && <img src={imageUrl} alt="Delivery Boy" />}
          {/* Display other details as needed */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

function DeliveryBoyList() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);

  useEffect(() => {
    const fetchDeliveryBoys = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "DeliveryBoy"));
        const deliveryBoyData = querySnapshot.docs.map((doc) => doc.data());
        setDeliveryBoys(deliveryBoyData);
      } catch (error) {
        console.log("Error fetching delivery boys:", error);
      }
    };

    fetchDeliveryBoys();
  }, []);

  return (
    <div>
      {deliveryBoys.map((deliveryBoy) => (
        <DeliveryBoyDetails
          deliveryBoy={deliveryBoy}
          key={deliveryBoy.id}
        />
      ))}
    </div>
  );
}

export default DeliveryBoyList;
