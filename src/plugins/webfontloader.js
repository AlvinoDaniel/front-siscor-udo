/**
 * plugins/webfontloader.js
 *
 * webfontloader documentation: https://github.com/typekit/webfontloader
 */

 // Imports
 import WebFontLoader from 'webfontloader'

export function loadFonts () {
  WebFontLoader.load({
    google: {
      families: [
        'Roboto:100,300,400,500,700,900&display=swap',
        'Source Serif Pro:200,300,400,500,700,900&display=swap',
        'Open Sans:300,400,500,700,900&display=swap',
        'Plus Jakarta Sans:300,400,500,700,900&display=swap',
      ],
     },
   })
 }
