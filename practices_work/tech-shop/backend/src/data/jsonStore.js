const fs = require("fs/promises");
const path = require("path");

function createJsonStore(filename, defaultData) {
  const filePath = path.join(__dirname, "db", filename);
  let writeQueue = Promise.resolve();

  async function ensureFile() {
    await fs.mkdir(path.dirname(filePath), { recursive: true });

    try {
      await fs.access(filePath);
    } catch (error) {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2), "utf8");
    }
  }

  async function read() {
    await ensureFile();
    const raw = await fs.readFile(filePath, "utf8");
    return JSON.parse(raw);
  }

  async function write(data) {
    await ensureFile();
    writeQueue = writeQueue.then(() =>
      fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8")
    );
    await writeQueue;
    return data;
  }

  return {
    filePath,
    read,
    write,
  };
}

module.exports = { createJsonStore };
