import moment from 'moment'
import html2canvas from 'html2canvas'
import { wait } from '@/util/helpers'
import jsPDF from 'jspdf'

const capture = (id, title) => {
  var container = document.getElementById(id);
  html2canvas(container, { letterRendering: 1, allowTaint: true, useCORS: true, }).then(function (canvas) {
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.download = `${title}_${moment().format('HHmmssSSS')}`;
      link.href = canvas.toDataURL("image/png");
      link.target = '_blank';
      link.click();
  });
}

export const screenshot = async ({id, title, width}) => {
  var container = document.getElementById(id);
  await wait(1000)
  return new Promise((resolve, reject) => {
    const pdf = new jsPDF('p', 'pt', 'letter')
    pdf.html(container,{
      callback: (doc) => {
        doc.save('sample-document.pdf')
      },
      margin: [0,0,0,0],
      autoPaging: 'text',
      x: 0,
      y: 0,
    })
    return resolve()
    // html2canvas(container, {
    //   scrollY: -window.scrollY,
    //   scrollX: -window.scrollX,
    //   escala: 1,
    //   width: 812,
    //   height: 1050,
    // }).then(function (canvas) {
    //   var link = document.createElement("a");
    //   document.body.appendChild(link);
    //   link.download = `${title}_${moment().format('HHmmssSSS')}`;
    //   link.href = canvas.toDataURL("image/png");
    //   link.target = '_blank';
    //   link.click();
    //   return resolve()
    // }).catch(function (error) {
    //   return reject({ error: error })
    // })
  })
}

export default capture
