const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const XLSX = require("xlsx");
const multer = require("multer");
const { timeout } = require("nodemon/lib/config");
const json = require("body-parser/lib/types/json");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, "rdqe.html");
  },
});

const upload = multer({ storage: storage });

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload_files", upload.array("files"), uploadFiles);

function uploadFiles(req, res) {
  console.log(req.body);
  console.log(req.files);
  res.json({ message: "Successfully uploaded files" });
}

app.get("/", (req, res) => {
  fs.readFile("./index.html", "utf8", (err, html) => {
    if (err) {
      res.status(500).send("sorry, out of order");
    }

    res.render("index");
  });
});

app.post("/", (req, res) => {
  let resArray = [];
  const allRadars = [
    "S723E",
    "EBBL",
    "EBBE",
    "GEEK",
    "GEMB",
    "EBFS",
    "EBSH",
    "EBEZ",
  ];
  function createTableRow(
    name,
    pdssr,
    pdpsr,
    pda,
    pdc,
    iva,
    ivc,
    fc,
    ft,
    mt,
    rng,
    azim,
    stat
  ) {
    let tempArr = [
      name,
      req.body.to,
      pdssr,
      pdpsr,
      pda,
      pdc,
      iva,
      ivc,
      fc,
      ft,
      mt,
      rng,
      azim,
    ];
    if (stat === 1) {
        tempArr.push("No Data");
    }
    resArray.push(tempArr);
  }
  JSON.parse(req.body.say).forEach(function (item) {
    switch (item[0]) {
      case "Semmerzake":
        item[0] = "S723E";
        createTableRow(
          item[0],
          item[2],
          item[3],
          item[9],
          item[10],
          item[11],
          item[12],
          item[13],
          item[14],
          item[15],
          item[19],
          item[21]
        );
        break;
      case "EBBL_UPGRADE":
        item[0] = "EBBL";
        createTableRow(
          item[0],
          item[2],
          item[3],
          item[9],
          item[10],
          item[11],
          item[12],
          item[13],
          item[14],
          item[15],
          item[19],
          item[21]
        );
        break;
      case "EBBE_NEW":
        item[0] = "EBBE";
        createTableRow(
          item[0],
          "",
          item[3],
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          item[19],
          item[21]
        );
        break;
      case "Erbeskopf":
        item[0] = "GEEK";
        createTableRow(
          item[0],
          item[2],
          item[3],
          item[9],
          item[10],
          item[11],
          item[12],
          item[13],
          item[14],
          item[15],
          item[19],
          item[21]
        );
        break;
      case "Marienbaum":
        item[0] = "GEMB";
        createTableRow(
          item[0],
          item[1],
          item[3],
          item[4],
          item[5],
          item[6],
          item[7],
          item[8],
          item[14],
          item[15],
          item[19],
          item[21]
        );
        break;
      case "Florennes_new":
        item[0] = "EBFS";
        createTableRow(
          item[0],
          item[2],
          item[3],
          item[9],
          item[10],
          item[11],
          item[12],
          item[13],
          item[14],
          item[15],
          item[19],
          item[21]
        );
        break;
      case "EBSH":
        createTableRow(
          item[0],
          "",
          item[3],
          "",
          "",
          "",
          "",
          "",
          "",
          "",
          item[19],
          item[21]
        );
        break;
      case "EBEZ":
        console.log(item[21]);
        item[0] = "EBEZ";
        createTableRow(
          item[0],
          item[2],
          item[3],
          item[9],
          item[10],
          item[11],
          item[12],
          item[13],
          item[14],
          item[15],
          item[19],
          item[21]
        );
        break;

      default:
        break;
    }
  });

  console.log(resArray.length);

  let runningRadars = [];

  resArray.forEach(function (item) {
    runningRadars.push(item[0]);
  });

  let missingRadars = allRadars
    .filter((x) => !runningRadars.includes(x))
    .concat(runningRadars.filter((x) => !allRadars.includes(x)));

  console.log(missingRadars);

  missingRadars.forEach(function (item) {
    createTableRow(item, "", "", "", "", "", "", "", "", "", "", "", 1);
  });

  resArray.unshift([
    "Radar",
    "Datum",
    "Pd_SSR",
    "Pd_PSR",
    "Pd_A",
    "Pd_C",
    "Pd_Inc_Val_A",
    "Pd_Inc_Val_C",
    "Pd_False_Code",
    "Rate_False_Trgt",
    "Rate_Multi_Trgt",
    "Range_Bias",
    "Az_Bias",
    "Opmerkingen"
  ]);

  const ec = (r, c) => {
    return XLSX.utils.encode_cell({ r: r, c: c });
  };

  const delete_row = (ws, row_index) => {
    let range = XLSX.utils.decode_range(ws["!ref"]);
    for (var R = row_index; R < range.e.r; ++R) {
      for (var C = range.s.c; C <= range.e.c; ++C) {
        ws[ec(R, C)] = ws[ec(R + 1, C)];
      }
    }
    range.e.r--;
    ws["!ref"] = XLSX.utils.encode_range(range.s, range.e);
  };

  let retFile = JSON.stringify(req.body.to).replace(/\//g, '').replace(/"/g, "") + "rdqe.xlsx"

  console.log(retFile)

  const ws = XLSX.utils.json_to_sheet(resArray);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "data");
  delete_row(ws, 0);
  XLSX.writeFile(wb, retFile);

  res.download(retFile);
    
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`App available on http://localhost:3000`)
);

