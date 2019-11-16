// <p>
// 	<p> <strong>1 King Bed or 2 Twin Beds</strong></p>
// 	<p>183 sq feet (17 sq meters)</p>
// 	<br />
// 	<p><b>Internet</b> - Free WiFi </p>
// 	<p><b>Entertainment</b> - Flat-screen TV with cable channels</p>
// 	<p><b>Food & Drink</b> - Coffee/tea maker and free bottled water </p>
// 	<p><b>Sleep</b> - Linens </p>
// 	<p><b>Bathroom</b> - Private bathroom, shower, and rainfall showerhead</p>
// 	<p><b>Practical</b> - Desk, free newspaper, and phone; rollaway/extra beds available on request</p>
// 	<p><b>Comfort</b> - Air conditioning and daily housekeeping</p>
// 	<p>Smoking</p>	
// </p>

// OUTPUT will be
// {
//   "p": {
//     "p": [
//       { "strong": "1 King Bed or 2 Twin Beds" },
//       "183 sq feet (17 sq meters)",
//       {
//         "b": "Internet",
//         "#text": " - Free WiFi "
//       },
//       {
//         "b": "Entertainment",
//         "#text": " - Flat-screen TV with cable channels"
//       },
//       {
//         "b": "Food and Drink",
//         "#text": " - Coffee/tea maker and free bottled water "
//       },
//       {
//         "b": "Sleep",
//         "#text": " - Linens "
//       },
//       {
//         "b": "Bathroom",
//         "#text": " - Private bathroom, shower, and rainfall showerhead"
//       },
//       {
//         "b": "Practical",
//         "#text": " - Desk, free newspaper, and phone; rollaway/extra beds available on request"
//       },
//       {
//         "b": "Comfort",
//         "#text": " - Air conditioning and daily housekeeping"
//       },
//       "Smoking"
//     ]
//   }

import { xml2json } from 'xml-js';
import { find as _find,
  filter as _filter,
  map as _map } from 'lodash';

export const RawHtmlToJSON = value => {
  const appendParent = "<p>"+ value.replace(/&/g, "and") + "</p>";
  const rawJson = JSON.parse(xml2json(appendParent, { compact: true }));
 
  const outputSchema = {
    title: null, // <strong>1 King Bed or 2 Twin Beds</strong>
    amenities: [ // <p><b>Internet</b> - Free WiFi </p>
      {
        desc: null, // <b>Internet</b>
        name: null // - Free WiFi => Free WiFi
      }
    ],
    _amenities: [ //<p>Smoking</p>	
      {
        name: null // Smoking
      }
    ] 
  }
  const requireInfo = rawJson.p.p; // it wil be array
  
  if(requireInfo) {
    try{
    outputSchema.title = _find(requireInfo, 'strong')['strong']['_text'];
    outputSchema.amenities = _map(_filter(requireInfo, 'b'),
      each => {
        return({
          desc: each.b._text,
          name: (each._text).substring(3)
        })
      });
    outputSchema._amenities = _map(_filter(requireInfo, each=> !each.b),
      each => ({
        name: each._text
      }));
    }catch(e){
      
    }
  }
  return outputSchema; 
}