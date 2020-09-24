const { promises } = require('fs');
const path = require('path');
const _ = require('lodash');

const { getRandomUsers } = require('./api');
const { User, Phone, client } = require('./models');
const { generatePhones } = require('./utils/phones');
//
//
(async () => {
  const resetDbQueryString = (
    await promises.readFile(path.join(__dirname, '/sql/reset-db-query.psql'))
  ).toString();
  await client.query(resetDbQueryString);

  const users = await User.bulkCreate(await getRandomUsers({ page: 5 }));
  const phones = await Phone.bulkCreate(generatePhones());

  /**
   * smell code
   *    ||
   *    \/
   */

    //  '(1),(1),(1),(2),(2),(2),(2),(3),(4),()'
  const ordersValuesString = users
      .map(u => {
        const userOrders = [...new Array(_.random(1, 10, false))];
        userOrders.forEach((item, index, arr) => {
          arr[index] = `(${u.id})`;
        });
        return userOrders.join(',');
      })
      .join(',');

  const { rows: orders } = await client.query(`INSERT INTO orders ("userId")\n
  VALUES ${ordersValuesString}\n
  RETURNING id;`);

  const phonesToOrdersValuesString = orders
    .map(o => {
      const arr = [...new Array(_.random(1, phones.length))];
      arr.forEach((i, index, arr) => {
        arr[index] = phones[_.random(1, phones.length - 1)];
      });
      const phonesToBuy = [...new Set(arr)];
      return phonesToBuy
        .map(p => `(${o.id}, ${p.id}, ${_.random(1, 10)})`)
        .join(',');
    })
    .join(',');
  await client.query(`INSERT INTO phones_to_orders ("orderId", "phoneId", "quantity")\n
  VALUES ${phonesToOrdersValuesString};`);

  client.end();
})();