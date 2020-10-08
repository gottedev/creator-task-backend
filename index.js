const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

app.use(cors());

const jsonParser = bodyParser.json();

const BASE_URL = "https://crtr.dev/api.json";

let properties = {
  unique_id: {
    address: {},
    photos: [],
    property_id: "",
    bathrooms: 0,
    cluster_size: 0,
    book_now_url: "",
    price_per_person_per_week: 0,
    end_date: "",
    living_space: 0,
    unique_id: "",
  },
};

const getProperties = async () => {
  console.log("url", BASE_URL);
  const url = `${BASE_URL}`;
  const properties = await axios.get(url);
  const { data } = properties;
  if (data.status === 404 || data.status === 403 || data.status === 500) {
    throw Error("processingError");
  }
  return data;
};

const data = async () => {
  try {
    const fetchProperties = await getProperties();
    // const {
    //   properties: [
    //     {
    //       media: { photos },
    //       property_id,
    //       bathrooms,
    //       cluster_size,
    //       address,
    //       contracts: [
    //         {
    //           book_now_url,
    //           prices: [{ price_per_person_per_week, room_name }],
    //           end_date,
    //         },
    //       ],
    //     },
    //   ],
    // } = fetchProperties;

    let organisedData = {};

    fetchProperties.properties.forEach(
      ({
        media: { photos },
        property_id,
        bathrooms,
        cluster_size,
        address,
        contracts,
      }) => {
        contracts.forEach(
          ({
            book_now_url,
            prices: [{ price_per_person_per_week }],
            end_date,
            title,
          }) => {
            organisedData[`${property_id}${title}`] = {
              photos,
              property_id,
              bathrooms,
              address,
              cluster_size,
              book_now_url,
              price_per_person_per_week,
              end_date,
              living_space: 1,
              unique_id: `${property_id}${title}`,
            };
          }
        );
      }
    );

    // const organiseData = fetchProperties.properties.map(
    //   ({
    //     media: { photos },
    //     property_id,
    //     bathrooms,
    //     cluster_size,
    //     address,
    //     contracts,
    //   }) => {
    //     return contracts.map(
    //       ({
    //         book_now_url,
    //         prices: [{ price_per_person_per_week }],
    //         end_date,
    //         title,
    //       }) => {
    //         temp[`${property_id}${title}`] = {
    //           photos,
    //           property_id,
    //           bathrooms,
    //           address,
    //           cluster_size,
    //           book_now_url,
    //           price_per_person_per_week,
    //           end_date,
    //           living_space: 1,
    //           unique_id: `${property_id}${title}`,
    //         };
    //         return {
    //           photos,
    //           property_id,
    //           bathrooms,
    //           address,
    //           cluster_size,
    //           book_now_url,
    //           price_per_person_per_week,
    //           end_date,
    //           living_space: 1,
    //         };
    //       }
    //     );
    //   }
    // );
    properties = organisedData;
  } catch (e) {
    console.log(e);
  }
};

data();

app.get("/properties", (req, res) => {
  const jsonData = JSON.stringify(properties);
  res.send(jsonData);
});

app.put("/updateproperty", jsonParser, (req, res) => {
  // const {

  // } =req.body
  properties[req.body.unique_id] = {
    ...properties[req.body.unique_id],
    ...req.body,
    address: { ...properties[req.body.unique_id.address], ...req.body.address },
  };
  const jsonData = JSON.stringify(properties);
  // console.log(properties);
  res.send(jsonData);
});

app.listen(4000, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log("Listening at http://localhost:4000/");
});
