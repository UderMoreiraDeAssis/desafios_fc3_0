const express = require("express");
const mysql = require("mysql");

const app = express();

const port = 3000;

const config = {
  host: "fullcycle_db",
  user: "root",
  password: "root",
  database: "fullcycle_db",
};

const connection = mysql.createConnection(config);
const insert = `INSERT INTO people(name) values('Uma Pessoa Legal aqui - [App]')`;
const select = `SELECT * FROM people`;

app.get("/", (req, res) => {
  connection.query(insert);

  let tableUsers =
    "<table><thead><tr><th>#</th><th>Name</th></tr></thead><tbody>";

  connection.query(select, (error, rows) => {
    if (error) throw error;

    for (let row of rows) {
      tableUsers += `<tr><td>${row.id}</td><td>${row.name}</td></tr>`;
    }

    tableUsers += "</tbody></table>";
    res.send(`<h1>Full Cycle Rocks!!</h1>${tableUsers}`);
    connection.end();
  });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
