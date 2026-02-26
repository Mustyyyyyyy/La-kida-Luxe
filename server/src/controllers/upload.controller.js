const streamifier = require("streamifier");
const cloudinary = require("../config/cloudinary");

exports.uploadProductImages = async (req, res) => {
  try {
    if (!req.files?.length) return res.status(400).json({ message: "No images uploaded" });

    const uploads = req.files.map((file) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "tailor-fashion/products",
            resource_type: "image",
            transformation: [{ quality: "auto", fetch_format: "auto" }],
          },
          (err, result) => {
            if (err) return reject(err);
            resolve({
              url: result.secure_url,
              publicId: result.public_id,
              width: result.width,
              height: result.height,
            });
          }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
      });
    });

    const results = await Promise.all(uploads);
    return res.json({ images: results });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Upload failed" });
  }
};