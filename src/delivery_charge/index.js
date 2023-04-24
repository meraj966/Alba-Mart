import React, { useEffect } from "react";
import PageTemplate from "../pages/reusable/PageTemplate";
import ActionBarOnlyAddButton from "../components/reusable/ActionBarOnlyAddButton";
import { useState } from "react";
import ModalPopup from "../components/reusable/ModalPopup";
import ChargeList from "./ChargeList";
import AddCharge from "./AddCharge";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function DeliveryCharge() {
  const [isOpen, setIsOpen] = useState(false);
  const [chargeList, setChargeList] = useState([]);

  useEffect(() => {
    getDeliveryCharges();
  }, []);

  const getDeliveryCharges = async () => {
    const data = await getDocs(collection(db, "DeliveryCharge"));
    setChargeList(data.docs.map((i) => i.data()));
  };

  return (
    <PageTemplate
      title="Delivery Charge Settings"
      modal={
        <ModalPopup
          title={"Add New Delivery Charge"}
          open={isOpen}
          onClose={() => setIsOpen(false)}
        >
          <AddCharge
            onClose={() => {
              setIsOpen(false);
              getDeliveryCharges();
            }}
          />
        </ModalPopup>
      }
      actionBar={
        <ActionBarOnlyAddButton
          buttonLabel={"Add Charge"}
          onClick={() => setIsOpen(true)}
        />
      }
    >
      <ChargeList data={chargeList} />
    </PageTemplate>
  );
}

export default DeliveryCharge;
