require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const users = require("./routes/users");
const auth = require("./routes/auth");
const bars = require("./routes/bars");
const products = require("./routes/products");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(helmet());

app.use("/api/users", users);
app.use("/api/auth", auth);
app.use("/api/bars", bars);
app.use("/api/products", products);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
