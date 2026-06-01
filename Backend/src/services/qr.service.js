const QRCode = require("qrcode");

const generateQrCode = async (tableNumber) => {
  try {
    const tableUrl = `${process.env.FRONTEND_URL}/table/${tableNumber}`;

    const qrCode = await QRCode.toDataURL(tableUrl);

    return qrCode;
  } catch (error) {
    throw new Error("Failed to generate QR code");
  }
};

module.exports = {
  generateQrCode,
};