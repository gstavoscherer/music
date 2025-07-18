import path from "path";
import fs from "fs";

class FileService {
  constructor() {
    this.uploadDir = path.resolve("..", "frontend", "uploads");
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  saveFileLocally(file) {
    return new Promise((resolve, reject) => {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join(this.uploadDir, fileName);

      file.mv(filePath, (err) => {
        if (err) {
          return reject(err);
        }
        resolve(`/uploads/${fileName}`);
      });
    });
  }
}

export default new FileService();
