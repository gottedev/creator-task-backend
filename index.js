const express = require("express");
const axios = require("axios");
const cors = require("cors");
const bodyParser = require("body-parser");
const isEmpty = require("lodash.isempty");
const { LocalStorage } = require("node-localstorage");

const localStorage = new LocalStorage("./scratch");

const app = express();

app.use(cors());

app.options("*", cors());

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

localStorage.setItem("properties", JSON.stringify(properties));

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
  if (localStorage.unique_id) {
    try {
      const fetchProperties = await getProperties();

      let organisedData = {};

      fetchProperties.properties.forEach(
        async ({
          media: { photos },
          property_id,
          bathrooms,
          cluster_size,
          address,
          contracts,
        }) => {
          await contracts.forEach(
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
      localStorage.setItem("properties", JSON.stringify(organisedData));
      properties = organisedData;
    } catch (e) {
      console.log(e);
    }
  } else {
    const storedProperties = localStorage.getItem("properties");
    properties = JSON.parse(storedProperties);
  }
};

exports.appPromise = async () => {
  await data();

  app.get("/properties", (req, res) => {
    const jsonData = JSON.stringify(properties);
    res.send(jsonData);
  });

  app.put("/updateproperty", jsonParser, (req, res) => {
    if (isEmpty(req.body)) {
      res.status(204).send("empty request");
    } else if (!req.body.unique_id) {
      res
        .status(400)
        .send(
          "something is wrong with request object, unique id field not found"
        );
    } else {
      properties[req.body.unique_id] = {
        ...properties[req.body.unique_id],
        ...req.body,
        address: {
          ...properties[req.body.unique_id.address],
          ...req.body.address,
        },
      };
      const jsonData = JSON.stringify(properties);
      res.send(jsonData);
    }
  });

  return app;
};

exports.data = data;
exports.app = app;
