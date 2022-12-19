import jsPDF from "jspdf";
import "jspdf-autotable";


export default function PDFGenerator(items) {
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
                content: 'Company brand',
                styles: {
                  halign: 'left',
                  fontSize: 20,
                  textColor: '#ffffff'
                }
              },
              {
                content: 'Quotation',
                styles: {
                  halign: 'right',
                  fontSize: 20,
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
                content: 'Reference: xxxxxx' 
                +'\nDate: xxxx-xx-xx'
                +'\nInvoice number: ' ,
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
    doc.save("quotations/table.pdf");
}

// Path: lib\components\PDFGenerator.js
