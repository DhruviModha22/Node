let http = require("http");
let fs = require("fs");
let PORT = 8080;

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
        res.writeHead(500);
        res.end("Server Error");
        return;
      }

      res.writeHead(200);
      res.end(data);
    });
  })
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
