import moment from 'moment'
import html2canvas from 'html2canvas'
import { wait } from '@/util/helpers'

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
  await wait(100)
  return new Promise((resolve, reject) => {
    html2canvas(container, 
      { 
        windowWidth: width ? width : window.innerWidth
      }
    ).then(function (canvas) {
      var link = document.createElement("a");
      document.body.appendChild(link);
      link.download = `${title}_${moment().format('HHmmssSSS')}`;
      link.href = canvas.toDataURL("image/png");
      link.target = '_blank';
      link.click();
      return resolve()
    }).catch(function (error){
      return reject({error: error})
    })
  })
}

export default capture
