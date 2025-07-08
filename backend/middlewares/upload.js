const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

/**
 * Configuración de Multer para subir archivos (imágenes).
 * Define el destino donde se guardan los archivos y genera un nombre único usando UUID.
 * - destination: carpeta "storage/img"
 * - filename: nombre único con extensión original del archivo
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "storage/img");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });

module.exports = upload;