import jsPDF from "jspdf";
import "jspdf-autotable";


export default function PDFGenerator(items, formData) {
    const formatCode = (text) => {
        if(text){
            const result = /([^-]*)-/.exec(text)[1]
            return result
        }
        return result
    }


    const doc = new jsPDF();

    doc.autoTable({
        body: [
            [
              {
                content: 'Client Name: ' + formData.clientName
                +'\nClient Address: ' + formData.clientAddress,
                styles: {
                  halign: 'left',
                  fontSize: 10,
                  textColor: '#ffffff'
                }
              },
              {
                content: 'Client Email: ' + formData.clientEmail,
                styles: {
                  halign: 'right',
                  fontSize: 10,
                  textColor: '#ffffff'
                }
              }
            ],
          ],
          theme: 'plain',
          styles: {
            fillColor: '#3366ff'
          }
    });

    doc.autoTable({
        body: [
            [
              {
                content: 'PO Number: ' + formData.PONumber
                +'\nDue Date: ' + formData.quotationDueDate,
               
                styles: {
                  halign: 'right'
                }
              }
            ],
          ],
          theme: 'plain'
    });
   
    doc.autoTable({
        head: [['Item', 'Unit Code', 'Qty', 'Price', 'Availability']],
        body: items.map(item => [item["Asset Type"], formatCode(item["Calibration Product Code"]), 0, item.Price, item.Availability]),
    });

    doc.autoTable({
      body: [
          [
            {
              content: 'Total Hours: ' + formData.totalHours
              +'\nTotal Price: ' + formData.totalPrice,
             
              styles: {
                halign: 'right'
              }
            }
          ],
        ],
        theme: 'plain'
  });
    
    // customer name/date created
    doc.save(formData.clientName + ' (' +  new Date().toLocaleDateString() + ') ' + ".pdf");
}

// Path: lib\components\PDFGenerator.js
