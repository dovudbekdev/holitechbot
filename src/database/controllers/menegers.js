const axios = require("axios");
const { Menejer } = require("../models");

const findMenegerByRefId = async (id) => {
  return await Menejer.findOne({ refId: id });
};

module.exports = {
  findMenegerByRefId,
};
