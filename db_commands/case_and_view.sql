SELECT *,
       (CASE "isMale"
            WHEN true THEN 'male'
            WHEN false THEN 'female'
            ELSE 'other'
           END) as "GENDER"
FROM users;

SELECT brand,
       (CASE
            WHEN brand ILIKE 'iphone'
                THEN 'apple'
            ELSE 'other'
           END) as "manufaturer"
FROM phones;

SELECT *,
       (CASE
            WHEN (extract('year' FROM age("birthday")) >= 65 AND "isMale") OR
                 extract('year' FROM age("birthday")) >= 60 AND not "isMale" THEN 'retiree'
            WHEN extract('year' FROM age("birthday")) < 18 THEN 'underage'
            ELSE 'middle age'
           END) as "age status"
FROM users;

SELECT COALESCE(null, 12);

SELECT *
FROM users
WHERE users.id IN (SELECT "userId" FROM orders);


SELECT *
FROM orders
WHERE EXISTS(SELECT *
             FROM phones_to_orders
             WHERE EXISTS(SELECT * FROM phones WHERE brand ILIKE 'nokia'));

CREATE VIEW users_with_orders_count AS
(
SELECT u.*,
       "lastName" || ' ' || "firstName"   "full name",
       (Case
            WHEN "isMale" THEN 'MALE'
            WHEN not "isMale" THEN 'FEMALE'
            ELSE 'OTHER' END),
       EXTRACT('year' FROM age(birthday)) "age",
       count(o."userId"),
       (sum(p.price * pto.quantity))      "orders total cost"
FROM users u
         FULL JOIN orders o on u.id = o."userId"
         LEFT JOIN phones_to_orders pto on o.id = pto."orderId"
         LEFT JOIN phones p on pto."phoneId" = p.id
GROUP BY u.id
    );

SELECT *
FROM users_with_orders_count;


CREATE VIEW phones_sold_count as
(
SELECT brand, model, price, sum(pto.quantity) "sold"
FROM phones p
         JOIN phones_to_orders pto on p.id = pto."phoneId"
GROUP BY brand, model, price
ORDER BY "sold"
    );

SELECT * FROM phones_sold_count;


SELECT o.id,
       p.brand || ' ' || p.model                         "phone",
       p.price,
       pto.quantity,
       sum(pto.quantity * p.id) OVER (PARTITION BY o.id) "order cost"
FROM orders o
         JOIN phones_to_orders pto on o.id = pto."orderId"
         JOIN phones p on p.id = pto."phoneId"
GROUP BY o.id, p.id, pto.quantity