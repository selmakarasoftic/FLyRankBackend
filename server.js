// firstly - loading the library and creating the serveron a certain port and then crating the endpoint 
const express = require("express");
const app = express();
const PORT = 3000;
app.get("/", (req, res) => {
  res.send("Hello, server!");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});