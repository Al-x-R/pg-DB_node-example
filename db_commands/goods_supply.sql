CREATE TABLE products
(
    "id"    serial PRIMARY KEY,
    "code"  varchar(50) NOT NULL UNIQUE,
    "name"  varchar(50) NOT NULL UNIQUE,
    "price" money       NOT NULL CHECK (price >= 0::money)
);

CREATE TABLE customers
(
    "id"              serial PRIMARY KEY,
    "firstName"       varchar(64)  NOT NULL,
    "lastName"        varchar(64)  NOT NULL,
    "email"           varchar(255) NOT NULL UNIQUE,
    "phoneNumbers"    jsonb        NOT NULL,
    "customerAddress" jsonb        NOT NULL,
    "isMale"          boolean
);

CREATE TABLE contracts
(
    "id"             serial PRIMARY KEY,
    "customerId"     int REFERENCES customers,
    "contractNumber" int  NOT NULL,
    "conclusionDate" date NOT NULL,
    "fromDate"       date NOT NULL,
    "toDate"         date NOT NULL,
    CHECK ("fromDate" < "toDate")
);

CREATE TABLE orders
(
    "id"         serial PRIMARY KEY,
    "contractId" int REFERENCES contracts,
    "deadline"   timestamp NOT NULL
);

CREATE TABLE products_to_orders
(
    "orderId"   int REFERENCES orders,
    "productId" int REFERENCES products,
    "quantity"  numeric(10, 3) NOT NULL CHECK (quantity > 0) DEFAULT 1,
    PRIMARY KEY ("orderId", "productId")
);