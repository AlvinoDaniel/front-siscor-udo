import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'

const fechaActual = () => {
  let now = moment().format('D MMM YYYY');

  return `Fecha: ${now}`;
}

var pdfConfig = {
  headerTextSize: 14,
  labelTextSize: 12,
  fieldTextSize: 10,
  lineHeight: 14,
  subLineHeight: 4,
};

const exportPDF = (columns, items, infoHead) => {
  const namePDF = infoHead.title.toLowerCase().split(" ").join("-") + `-${moment().format('HHmmssSSS')}`;
  var totalPagesExp = '{total_pages_count_string}';
  var colorBlack = "#000000";
  var colorGray = "#4d4e53";
  var currentHeight = 54;

  var img = new Image();
  img.src = require('@/assets/IDENTIDAD.png')

  var doc = new jsPDF('p', 'pt', 'letter');
  var docWidth = doc.internal.pageSize.getWidth()
  var docHeight = doc.internal.pageSize.getHeight()

  doc.addImage(img, 'png', 40, 30, 140, 50)
  doc.setFontSize(pdfConfig.fieldTextSize);
  doc.setTextColor(colorGray);
  doc.text(fechaActual(), docWidth - 40, currentHeight, 'right');
  currentHeight += pdfConfig.lineHeight;
  doc.text(`Total de Registros: ${items.length}`, docWidth - 40, currentHeight, 'right');
  currentHeight += pdfConfig.lineHeight*2;
  doc.setDrawColor(77, 78, 83);
  doc.line(40, currentHeight, docWidth - 40, currentHeight)
  currentHeight += pdfConfig.lineHeight + 4;
  doc.text(`Rango de Fecha: ${infoHead.range}`, 40, currentHeight,);
  if(infoHead.amount) {
    currentHeight += pdfConfig.lineHeight;
    doc.text(`Saldo Total: ${parseFloat(infoHead.amount, 0.0).toFixed(2)}$`, 40, currentHeight,);
  }
  currentHeight += pdfConfig.lineHeight + 4;
  doc.setFontSize(pdfConfig.headerTextSize)
  doc.setTextColor(colorBlack);
  doc.text(infoHead.title, 40, currentHeight);
  currentHeight += pdfConfig.lineHeight;

  doc.autoTable(columns, items, {
    startY: currentHeight,
    startX: 30,
    headStyles: { 
      fillColor: [185, 194, 208], 
      textColor: [0, 59, 73], 
    },
    didDrawPage: function (data) {
       var str = 'Pág. ' + doc.internal.getNumberOfPages()
       if (typeof doc.putTotalPages === 'function') {
         str = str + '/' + totalPagesExp
       }
       doc.setFontSize(pdfConfig.fieldTextSize)
       var pageSize = doc.internal.pageSize
       var pageHeight = pageSize.height ? pageSize.height : pageSize.getHeight()
       doc.text(str, data.settings.margin.left, pageHeight - 10)
    },
  });

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp)
  }

  doc.save(`${namePDF}.pdf`);
}

export default exportPDF;