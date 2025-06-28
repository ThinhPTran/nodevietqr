// vietqr.js

/**
 * @fileoverview A Node.js console application to generate VietQR code payloads and QR code images.
 * This script implements the specification outlined in the NAPAS document for VietQR.
 * It handles the Tag-Length-Value (TLV) format, nested data objects, and the required
 * CRC-16/CCITT-FALSE checksum calculation.
 *
 * It can be run from the command line, accepting arguments to generate the QR code.
 */

const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');

/**
 * Calculates CRC-16/CCITT-FALSE.
 * As per the specification, the polynomial is '1021' (hex) and the initial value is 'FFFF' (hex).
 * The calculation is performed on the entire data string, including the CRC tag and length ("6304")
 * before the actual CRC value is appended.
 *
 * @param {Buffer|string} data The data to calculate the CRC for.
 * @returns {string} The calculated CRC as a 4-character uppercase hexadecimal string.
 */
function calculateCRC16_CCITT_FALSE(data) {
    let crc = 0xFFFF;
    const buffer = Buffer.isBuffer(data) ? data : Buffer.from(data, 'utf-8');

    for (let i = 0; i < buffer.length; i++) {
        crc ^= buffer[i] << 8;
        for (let j = 0; j < 8; j++) {
            if ((crc & 0x8000) !== 0) {
                crc = (crc << 1) ^ 0x1021;
            } else {
                crc <<= 1;
            }
        }
    }
    // The result needs to be a 16-bit unsigned integer.
    crc &= 0xFFFF;
    // Format as a 4-character uppercase hex string, padding with '0' if necessary.
    return crc.toString(16).toUpperCase().padStart(4, '0');
}


/**
 * Formats a Tag-Length-Value (TLV) component.
 * @param {string} id The tag ID.
 * @param {string} value The value.
 * @returns {string} The formatted TLV string "IDLLVV...".
 */
function formatTLV(id, value) {
    if (value === null || value === undefined || value === '') {
        return '';
    }
    const valueStr = String(value);
    const length = valueStr.length.toString().padStart(2, '0');
    return `${id}${length}${valueStr}`;
}

/**
 * Builds the VietQR payload string.
 * @param {object} options The QR code data.
 * @param {string} options.bankBin The BIN of the beneficiary bank (e.g., "970403").
 * @param {string} options.accountNumber The beneficiary's account number.
 * @param {number} [options.amount] The transaction amount. If not provided, the QR is static for amount.
 * @param {string} [options.purpose] The purpose of the transaction.
 * @param {string} [options.merchantName] The name of the merchant/beneficiary.
 * @returns {string} The complete, valid VietQR payload string including CRC.
 */
function buildVietQR(options) {
    const {
        bankBin,
        accountNumber,
        amount,
        purpose,
        merchantName
    } = options;

    if (!bankBin || !accountNumber) {
        throw new Error("Bank BIN and Account Number are required.");
    }

    // --- Merchant Account Information (ID 38) ---
    // This is a nested TLV structure for VietQR
    const guid = 'A000000727';
    const beneficiaryInfo = formatTLV('00', guid) + formatTLV('01', formatTLV('00', bankBin) + formatTLV('01', accountNumber)) + formatTLV('02', 'QRIBFTTA');
    const merchantAccountInfo = formatTLV('38', beneficiaryInfo);

    // --- Main Payload Assembly ---
    const payload = [
        formatTLV('00', '01'), // Payload Format Indicator
        formatTLV('01', amount ? '12' : '11'), // Point of Initiation Method (12 for dynamic, 11 for static)
        merchantAccountInfo, // Merchant Account Information
        formatTLV('53', '704'), // Transaction Currency (VND)
        amount ? formatTLV('54', amount.toString()) : '', // Transaction Amount
        formatTLV('58', 'VN'), // Country Code
        merchantName ? formatTLV('59', merchantName) : '', // Merchant Name
        purpose ? formatTLV('62', formatTLV('08', purpose)) : '' // Additional Data (Purpose)
    ].join('');

    // --- CRC Calculation ---
    // The CRC is calculated on the payload string + the CRC's own Tag and Length ("6304")
    const dataToCrc = payload + '6304';
    const crc = calculateCRC16_CCITT_FALSE(dataToCrc);

    // Append the CRC TLV to the final payload
    return payload + formatTLV('63', crc);
}

/**
 * Generates a QR code image file from VietQR data.
 * @param {object} options The QR code data (passed to buildVietQR).
 * @param {string} filePath The path to save the generated PNG image.
 */
async function generateQRImageFile(options, filePath) {
    try {
        const payload = buildVietQR(options);
        console.log("Generated Payload:", payload);
        await qrcode.toFile(filePath, payload, {
             errorCorrectionLevel: 'Q' // High error correction for reliability
        });
        console.log(`QR code successfully saved to ${filePath}`);
        return payload; // Return payload for verification
    } catch (err) {
        console.error("Failed to generate QR code:", err);
        process.exit(1);
    }
}

/**
 * Main function to run the console application.
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes('--help')) {
        console.log(`
VietQR Generator Console App
----------------------------
Generates a VietQR code image file.

Usage:
  node vietqr.js <bankBin> <accountNumber> <amount> <purpose> <merchantName> <outputFile>

Arguments:
  bankBin:       The 6-digit bank BIN code.
  accountNumber: The bank account number.
  amount:        The transaction amount. Use '0' for a static QR.
  purpose:       The transaction purpose/message. Use "''" for empty.
  merchantName:  The name of the beneficiary/merchant. Use "''" for empty.
  outputFile:    The name of the output PNG file (e.g., 'my-qr.png').

Example (Dynamic QR):
  node vietqr.js 970436 1234567890 25000 "Thanh toan don hang" "My Store" dynamic.png

Example (Static QR):
  node vietqr.js 970415 0987654321 0 "" "Nguyen Van A" static.png
        `);
        return;
    }

    if (args.length < 6) {
        console.error("Error: Not enough arguments. Please provide all 6 arguments.");
        console.log("Run 'node vietqr.js --help' for usage instructions.");
        process.exit(1);
    }

    const [bankBin, accountNumber, amountStr, purpose, merchantName, outputFileName] = args;

    const amount = parseInt(amountStr, 10);

    const options = {
        bankBin,
        accountNumber,
        amount: amount > 0 ? amount : null,
        purpose: purpose || null,
        merchantName: merchantName || null
    };

    const outputPath = path.resolve(process.cwd(), outputFileName);

    await generateQRImageFile(options, outputPath);
}


// --- Run the application ---
main();
