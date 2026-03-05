const cloudinary = require("../config/cloudinary");

exports.uploadProductImages = async (req, res) => {
  try {
    const files = req.files || [];
    if (!files.length) return res.status(400).json({ message: "No images received" });

    const uploaded = [];

    for (const f of files) {
      const b64 = `data:${f.mimetype};base64,${f.buffer.toString("base64")}`;

      const up = await cloudinary.uploader.upload(b64, {
        folder: "lakida/products",
      });

      uploaded.push({
        url: up.secure_url,
        publicId: up.public_id,
        width: up.width,
        height: up.height,
      });
    }

    return res.json({ images: uploaded });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Upload failed" });
  }
};