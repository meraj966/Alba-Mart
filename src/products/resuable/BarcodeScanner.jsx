import React, { useState } from "react";
import BarcodeReader from "react-barcode-reader";

function BarcodeScanner({ onBarcodeScanned }) {
  const [scannedBarcode, setScannedBarcode] = useState("");

  const handleScan = (data) => {
    if (data) {
      setScannedBarcode(data);
      onBarcodeScanned(data); // Callback to parent component with scanned barcode
    }
  };

  const handleError = (err) => {
    console.error("Barcode scan error:", err);
  };

  return (
    <div>
      <BarcodeReader onScan={handleScan} onError={handleError} />
      <p>{scannedBarcode}</p>
    </div>
  );
}

export default BarcodeScanner;
