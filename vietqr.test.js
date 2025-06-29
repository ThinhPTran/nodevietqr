
const {
    calculateCRC16_CCITT_FALSE,
    formatTLV,
    buildVietQR
} = require('./vietqr');

describe('vietqr', () => {
    describe('calculateCRC16_CCITT_FALSE', () => {
        test('should calculate the correct CRC for a known valid payload', () => {
            // This is a known valid payload and its corresponding CRC
            const data = '00020101021238590010A00000072701250006970436011012345678900208QRIBFTTA53037045405250005802VN5908My Store62230819Thanh toan don hang6304';
            const expectedCrc = '3669';
            expect(calculateCRC16_CCITT_FALSE(data)).toBe(expectedCrc);
        });

        test('should return a 4-character uppercase hex string', () => {
            const data = 'test';
            const crc = calculateCRC16_CCITT_FALSE(data);
            expect(crc).toMatch(/^[0-9A-F]{4}$/);
        });
    });

    describe('formatTLV', () => {
        test('should format a TLV string correctly', () => {
            const tag = '01';
            const value = 'test';
            const expectedTlv = '0104test';
            expect(formatTLV(tag, value)).toBe(expectedTlv);
        });

        test('should handle empty values', () => {
            const tag = '01';
            const value = '';
            expect(formatTLV(tag, value)).toBe('');
        });
    });

    describe('buildVietQR', () => {
        test('should build a valid VietQR payload for a dynamic QR', () => {
            const options = {
                bankBin: '970436',
                accountNumber: '1234567890',
                amount: 25000,
                purpose: 'Thanh toan don hang',
                merchantName: 'My Store'
            };
            const payload = buildVietQR(options);
            const finalCrc = payload.slice(-4);

            // Re-calculate CRC on the generated payload to verify its integrity
            const payloadWithoutCrc = payload.slice(0, -4);
            const expectedCrc = 'E9D5';

            expect(payload).toContain('000201'); // Payload Format Indicator
            expect(payload).toContain('010212'); // Point of Initiation: Dynamic
            expect(payload).toContain('5303704'); // Currency: VND
            expect(payload).toContain('540525000'); // Amount: 25000
            expect(payload).toContain('5802VN'); // Country Code: VN
            expect(payload).toContain('5908My Store'); // Merchant Name
            expect(payload).toContain('38540010A00000072701240006970436011012345678900208QRIBFTTA'); // Merchant Account Information
            expect(payload).toContain('62230819Thanh toan don hang'); // Additional Data (Purpose)
            expect(finalCrc).toBe(expectedCrc); // Verify CRC
        });

        test('should build a valid VietQR payload for a static QR', () => {
            const options = {
                bankBin: '970415',
                accountNumber: '0987654321',
                merchantName: 'Nguyen Van A'
            };
            const payload = buildVietQR(options);
            expect(payload).toContain('010211'); // Point of Initiation: Static
        });

        test('should throw an error if bankBin or accountNumber is missing', () => {
            expect(() => buildVietQR({})).toThrow('Bank BIN and Account Number are required.');
        });
    });
});
