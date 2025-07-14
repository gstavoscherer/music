import path from "path";
import fs from "fs";

// Correto: sai do backend/ → vai para frontend/uploads
const uploadDir = path.resolve("..", "frontend", "uploads");

if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

export const saveFileLocally = (file) => {
	return new Promise((resolve, reject) => {
		const fileName = `${Date.now()}-${file.name}`;
		const filePath = path.join(uploadDir, fileName);

		file.mv(filePath, (err) => {
			if (err) {
				console.error("❌ Erro ao mover arquivo:", err);
				return reject(err);
			}
			console.log("✅ Arquivo salvo em:", filePath);
			resolve(`/uploads/${fileName}`); // caminho para servir no frontend
		});
	});
};
