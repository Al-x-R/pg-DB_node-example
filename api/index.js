
const queryString = require('querystring');
const axios = require('axios');
const { baseURL, defaultParams } = require('./../configs/api.json');

const api = axios.create({
  baseURL,
});

module.exports.getRandomUsers = async options => {
  const params = {
    ...defaultParams,
    ...options,
  };

  const {
    data: { results },
  } = await api.get(`?${queryString.stringify(params)}`);

  return results;
};