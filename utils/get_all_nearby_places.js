const axios = require('axios')

// let fs = require('fs');
// let json = JSON.parse(fs.readFileSync('../response_mock_all.json', 'utf8'));
// let next_page_token = json['next_page_token'];

let results = [];
let req_results = [];
// results = [
//   ...results,
//   ...json['results']
// ];
let next_page_token = ''
request = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=44.4295429,26.1010684&radius=1000&key=AIzaSyCMyep5LOR7sWsl7ggXEWgjTOfp8K__QHI'

const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyCMyep5LOR7sWsl7ggXEWgjTOfp8K__QHI',
  Promise: Promise
});
results = []
googleMapsClient.placesNearby({
  location: [44.4295429,26.1010684],
  radius: 50,
  type: 'establishment'
}).asPromise()
  .then(response => {
    results = [
      ...results,
      ...response.json.results
    ];

    function getNextPage() {
      return googleMapsClient.placesNearby({
        pagetoken: response.json.next_page_token
      }).asPromise();
    }
    return getNextPage()
      .then(function repeatWhileInvalid(nextResponse) {
        if (nextResponse.json.status !== 'INVALID_REQUEST') {
          return nextResponse;
        }

        // Wait one second, and try again.
        return new Promise(function (resolve) {
          setTimeout(resolve, 2000);
        })
          .then(getNextPage)
          .then(repeatWhileInvalid);
      })
      .then(nextResponse => {
        results = [
          ...results,
          ...nextResponse.json.results
        ];
        console.log(results.length)
      });
  }).catch(err => {
    console.log(err)
  });


// axios.get(`request`)
//     .then(response => {
//       let data = response['data'];
//       next_page_token = data['next_page_token'];
//       results = [
//         ...results,
//         ...data['results']
//       ];
//       console.log(results.length);
//     })
//     .catch(error => {
//       console.log(error);
//     });
//
// while(next_page_token)
// {
//   axios.get(`${request}&pagetoken=${next_page_token}`)
//     .then(response => {
//       let data = response['data'];
//       next_page_token = data['next_page_token'];
//       results = [
//         ...results,
//         ...data['results']
//       ];
//       console.log(next_page_token);
//       console.log(results.length);
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

