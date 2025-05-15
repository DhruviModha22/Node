const http = require("http");
const fs = require("fs");
const PORT = 8080;

http
  .createServer((req, res) => {
    let filename = "";

    switch (req.url) {
      case "/":
        filename = "home.html";
        break;
      case "/about":
        filename = "about.html";
        break;
      case "/contacts":
        filename = "contacts.html";
        break;
      default:
        filename = "404.html";
        break;
    }

    fs.readFile(filename, (err, data) => {
      if (err) {
        res.write("Server Error");
        res.end();
        return;
      }

      res.write(data);
      res.end();
    });
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
