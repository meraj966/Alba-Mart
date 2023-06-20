const express = require("express");
const app = express();
const port = 3000; // Update with your desired port number
const ThermalPrinter = require("node-thermal-printer").printer;
const PrinterTypes = require("node-thermal-printer").types;

app.use(express.json());

app.post("/api/print-bill", (req, res) => {
  const { order, products, user, subTotal } = req.body;

  // Initialize the printer
  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // Update with your printer type
    interface: "printer:your-printer-name-or-ip", // Update with your printer name or IP address
    characterSet: "SLOVENIA", // Update with your desired character set
  });

  // Set printer options (e.g., font, align)
  printer.setPrinterDriverOptions({
    maxColumn: 32,
    driver: "epson",
    bold: true,
    underline: true,
  });

  // Connect to the printer
  printer
    .isPrinterConnected()
    .then(() => {
      // Print the receipt
      printer.alignCenter();
      printer.println("Order Details");
      printer.newLine();
      printer.println("Order ID: " + order.id);
      printer.println("Customer Name: " + user.name);
      printer.println("Customer Contact: " + user.phoneNo);
      printer.println("Address: " + user.address);
      // Add more details as needed

      // Print the products
      printer.alignLeft();
      products.forEach((product) => {
        printer.tableCustom([
          { text: product.name, width: 0.5 },
          { text: product.quantity.toString(), width: 0.1 },
          { text: product.price.toString(), width: 0.2 },
          { text: product.amount.toString(), width: 0.2 },
        ]);
      });

      // Print subtotals, tax, etc.
      printer.alignRight();
      printer.tableCustom([
        { text: "Sub Total Price:", width: 0.7 },
        { text: subTotal.toString(), width: 0.3 },
      ]);
      // Add more details as needed

      // Print additional information or formatting
      // ...

      // Send print command to the printer
      printer.cut();
      printer.execute()
        .then(() => {
          console.log("Print command sent successfully");
          res.status(200).send("Print command sent successfully");
        })
        .catch((error) => {
          console.log("Error while sending print command:", error);
          res.status(500).send("Error while sending print command");
        });
    })
    .catch((error) => {
      console.log("Printer not connected:", error);
      res.status(500).send("Printer not connected");
    });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
