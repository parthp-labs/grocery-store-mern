import nodemailer from "nodemailer";
import handlebars from "handlebars";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";

import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
console.log(__filename, __dirname);
dotenv.config({ path: dirname(__dirname) + "/.env" });

const getItemRow = ({ name, image, cost, quantity }) => {
  return `<tr>
                          <td
                            class="column column-1"
                            width="25%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: middle;
                            "
                          >
                            <table
                              class="image_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                            >
                              <tr>
                                <td
                                  class="pad"
                                  style="
                                    width: 100%;
                                    padding-right: 0px;
                                    padding-left: 0px;
                                  "
                                >
                                  <div class="alignment" align="center">
                                    <div style="max-width: 84px">
                                      <img
                                        src="${image}"
                                        style="
                                          display: block;
                                          height: auto;
                                          border: 0;
                                          width: 100%;
                                        "
                                        width="84"
                                        alt
                                        title
                                        height="auto"
                                      />
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="heading_block block-2"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <h6
                                    style="
                                      margin: 0;
                                      color: #555555;
                                      direction: ltr;
                                      font-family: Arial, Helvetica Neue,
                                        Helvetica, sans-serif;
                                      font-size: 10px;
                                      font-weight: 700;
                                      letter-spacing: normal;
                                      line-height: 1.2;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      mso-line-height-alt: 12px;
                                    "
                                  >
                                    <span
                                      class="tinyMce-placeholder"
                                      style="word-break: break-word"
                                      >${name}</span
                                    >
                                  </h6>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-2"
                            width="25%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: middle;
                            "
                          >
                            <table
                              class="heading_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <h6
                                    style="
                                      margin: 0;
                                      color: #555555;
                                      direction: ltr;
                                      font-family: Arial, Helvetica Neue,
                                        Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: normal;
                                      line-height: 1.2;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      mso-line-height-alt: 14px;
                                    "
                                  >
                                    <span
                                      class="tinyMce-placeholder"
                                      style="word-break: break-word"
                                      >Rs. ${cost}</span
                                    >
                                  </h6>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-3"
                            width="25%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: middle;
                            "
                          >
                            <table
                              class="heading_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <h6
                                    style="
                                      margin: 0;
                                      color: #555555;
                                      direction: ltr;
                                      font-family: Arial, Helvetica Neue,
                                        Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: normal;
                                      line-height: 1.2;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      mso-line-height-alt: 14px;
                                    "
                                  >
                                    <span
                                      class="tinyMce-placeholder"
                                      style="word-break: break-word"
                                      >${quantity}</span
                                    >
                                  </h6>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td
                            class="column column-4"
                            width="25%"
                            style="
                              mso-table-lspace: 0pt;
                              mso-table-rspace: 0pt;
                              font-weight: 400;
                              text-align: left;
                              padding-bottom: 5px;
                              padding-top: 5px;
                              vertical-align: middle;
                            "
                          >
                            <table
                              class="heading_block block-1"
                              width="100%"
                              border="0"
                              cellpadding="10"
                              cellspacing="0"
                              role="presentation"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                              "
                            >
                              <tr>
                                <td class="pad">
                                  <h6
                                    style="
                                      margin: 0;
                                      color: #555555;
                                      direction: ltr;
                                      font-family: Arial, Helvetica Neue,
                                        Helvetica, sans-serif;
                                      font-size: 12px;
                                      font-weight: 700;
                                      letter-spacing: normal;
                                      line-height: 1.2;
                                      text-align: center;
                                      margin-top: 0;
                                      margin-bottom: 0;
                                      mso-line-height-alt: 14px;
                                    "
                                  >
                                    <span
                                      class="tinyMce-placeholder"
                                      style="word-break: break-word"
                                      >Rs. ${cost * quantity}</span
                                    >
                                  </h6>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>`;
};

console.log(process.env.SMTP_PORT);
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const getVerificationEmailTemplate = (name, verificationCode) => {
  // Reading the email template file
  const readFile = fs.readFileSync(
    __dirname + "/emailTemplates/emailVerificationTemplate.html",
    { encoding: "utf-8" }
  );

  // Compiling the read to handlebar template
  const template = handlebars.compile(readFile);

  const replacements = {
    name: name,
    verificationCode: verificationCode,
  };

  // Returning template with replacements of the fields
  return template(replacements);
};

export const sendVerificationEmail = async (name, to, verificationCode) => {
  return await transporter
    .sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Ogani - Email Verification",
      html: getVerificationEmailTemplate(name, verificationCode),
    })
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const getOrderPlacedEmailTemplate = ({
  name,
  orderId,
  items,
  totalItems,
  total,
}) => {
  // Reading the email template file
  const readFile = fs.readFileSync(
    __dirname + "/emailTemplates/orderPlacedTemplate.html",
    { encoding: "utf-8" }
  );

  // Compiling the read to handlebar template
  const template = handlebars.compile(readFile);

  const orderItemsRows = items.map((item) =>
    getItemRow({
      name: item.name,
      image: item.images[0],
      cost: item.discountedPrice,
      quantity: item.quantity,
    })
  );

  const replacements = {
    name: name,
    order_id: orderId,
    orderItems: orderItemsRows.join(" "),
    total,
    totalItems,
  };

  // Returning template with replacements of the fields
  return template(replacements);
};

export const sendOrderPlacedEmail = async ({
  name,
  orderId,
  items,
  totalItems,
  total,
  to,
}) => {
  return await transporter
    .sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Ogani - Order Placed",
      html: getOrderPlacedEmailTemplate({
        name,
        orderId,
        items,
        totalItems,
        total,
      }),
    })
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

const getOrderDeliveredEmailTemplate = ({
  name,
  email,
  totalAmount,
  orderId,
  address,
}) => {
  // Reading the email template file
  const readFile = fs.readFileSync(
    __dirname + "/emailTemplates/orderDeliveredTemplate.html",
    { encoding: "utf-8" }
  );

  // Compiling the read to handlebar template
  const template = handlebars.compile(readFile);

  const replacements = {
    name: name,
    orderId,
    totalAmount,
    address,
  };

  return template(replacements);
};

export const sendOrderDeliveredEmail = async ({
  name,
  orderId,
  totalAmount,
  address,
  to,
}) => {
  return await transporter
    .sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Ogani - Order Delivered",
      html: getOrderDeliveredEmailTemplate({
        name,
        orderId,
        totalAmount,
        address,
        email: to,
      }),
    })
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const sendOrderCancelledByCustomerEmail = async ({
  to,
  name,
  orderId,
  items,
  total,
}) => {
  const readFile = fs.readFileSync(
    __dirname + "/emailTemplates/orderCancelledByCustomer.html",
    { encoding: "utf-8" }
  );

  // Compiling the read to handlebar template
  const template = handlebars.compile(readFile);

  const itemsRow = items.map((i) =>
    getItemRow({
      name: i.name,
      cost: i.discountedPrice,
      quantity: i.quantity,
      image: i.images[0],
    })
  );

  const emailTemplate = template({
    name,
    orderId,
    orderItems: itemsRow.join(" "),
    totalItems: items.length,
    total,
  });

  return await transporter
    .sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Ogani - Order Cancelled By Customer",
      html: emailTemplate,
    })
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};

export const sendOrderCancelledByAdminEmail = async ({
  to,
  name,
  orderId,
  items,
  total,
  message,
}) => {
  const readFile = fs.readFileSync(
    __dirname + "/emailTemplates/orderCancelledByEmail.html",
    { encoding: "utf-8" }
  );

  // Compiling the read to handlebar template
  const template = handlebars.compile(readFile);

  const itemsRow = items.map((i) =>
    getItemRow({
      name: i.name,
      cost: i.discountedPrice,
      quantity: i.quantity,
      image: i.images[0],
    })
  );

  const emailTemplate = template({
    name,
    orderId,
    items: itemsRow.join(" "),
    totalItems: items.length,
    total,
    message,
  });

  return await transporter
    .sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: "Ogani - Order Cancelled By Customer",
      html: emailTemplate,
    })
    .then((res) => {
      console.log(res);
      return true;
    })
    .catch((err) => {
      console.log(err);
      return false;
    });
};
