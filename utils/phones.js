const _ = require('lodash');
const brands = ['IPhone', 'Samsung', 'Xiaomi', 'Nokia', 'Sony'];

const generatePhone = key => ({
  brand: brands[_.random(0, brands.length - 1, false)],
  model: `${key} model ${_.random(0, 100, false)}`,
  price: _.random(500, 30000),
  quantity: _.random(1, 24657),
});

module.exports.generatePhones = (length = 30) => {
  const phones = [];

  for (let i = 0; i < length; ++i) {
    phones.push(generatePhone(i));
  }

  return phones;
};