CREATE SCHEMA invoiceSchema;

CREATE TABLE invoiceSchema.header_table (
    vr_no NUMERIC(18) PRIMARY KEY,
    vr_date DATE,
    status CHAR(1),
    ac_name VARCHAR(200),
    ac_amt NUMERIC(18,2)
);

CREATE TABLE invoiceSchema.detail_table (
    vr_no NUMERIC(18) REFERENCES invoiceSchema.header_table(vr_no),
    sr_no SERIAL
    item_code VARCHAR(20),
    item_name VARCHAR(200),
    description VARCHAR(3000),
    qty NUMERIC(18,3),
    rate NUMERIC(18,2),
);

CREATE TABLE invoiceSchema.item_master (
    item_code VARCHAR(20),
    item_name VARCHAR(200)
);
