import jsPDF from 'jspdf'
import 'jspdf-autotable'
import moment from 'moment'
import { LogoUdo } from '@/util/Iconos'

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

const exportPDF = ({doc, destinos, copias, circular, destinoCircular, hasCopias}) => {
  const namePDF = doc.propietario.nombre.toLowerCase().split(" ").join("-") + `-${moment().format('HHmmssSSS')}`;
  var totalPagesExp = '{total_pages_count_string}';
  var colorBlack = "#000000";
  var colorGray = "#4d4e53";
  var currentHeight = 54;

  var udoLogo = new Image();
  udoLogo.src = LogoUdo

  var doc = new jsPDF('p', 'pt', 'letter');
  var docWidth = doc.internal.pageSize.getWidth()
  var docHeight = doc.internal.pageSize.getHeight()

  doc.addImage(udoLogo, 'png',  70, 62, 70,62)
  doc.setFontSize(pdfConfig.fieldTextSize);
  doc.setTextColor(colorBlack);
  // doc.text(fechaActual(), docWidth - 40, currentHeight, 'right');
  currentHeight += pdfConfig.lineHeight;
  doc.text(`UNIVERSIDAD DE ORIENTE`, 40, currentHeight, {align: 'left'});
  // currentHeight += pdfConfig.lineHeight*2;
  // doc.setDrawColor(77, 78, 83);
  // doc.line(40, currentHeight, docWidth - 40, currentHeight)
  // currentHeight += pdfConfig.lineHeight + 4;
  // doc.text(`Rango de Fecha: ${infoHead.range}`, 40, currentHeight,);
  // if(infoHead.amount) {
  //   currentHeight += pdfConfig.lineHeight;
  //   doc.text(`Saldo Total: ${parseFloat(infoHead.amount, 0.0).toFixed(2)}$`, 40, currentHeight,);
  // }
  // currentHeight += pdfConfig.lineHeight + 4;
  // doc.setFontSize(pdfConfig.headerTextSize)
  // doc.setTextColor(colorBlack);
  // doc.text(infoHead.title, 40, currentHeight);
  // currentHeight += pdfConfig.lineHeight;

  doc.save(`${namePDF}.pdf`);
}

export default exportPDF;
