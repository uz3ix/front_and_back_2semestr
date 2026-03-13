const { createApp } = require("./src/app");

const PORT = 3000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`API: http://localhost:${PORT}`);
  console.log(`Swagger: http://localhost:${PORT}/api-docs`);
});
