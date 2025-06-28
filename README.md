# VietQR Generator

A Node.js console app to generate VietQR codes.

## Usage

To generate a QR code from the command line, use the following command:

```bash
node vietqr.js <bankBin> <accountNumber> <amount> <purpose> <merchantName> <outputFile>
```

### Arguments

-   `bankBin`: The 6-digit bank BIN code.
-   `accountNumber`: The bank account number.
-   `amount`: The transaction amount. Use '0' for a static QR.
-   `purpose`: The transaction purpose/message. Use `""` for empty.
-   `merchantName`: The name of the beneficiary/merchant. Use `""` for empty.
-   `outputFile`: The name of the output PNG file (e.g., 'my-qr.png').

## Programmatic Usage

You can also use this tool programmatically in your own Node.js projects.

First, install the package:

```bash
npm install vietqr-generator
```

Then, you can use the `buildVietQR` and `generateQRImageFile` functions in your code:

```javascript
const { buildVietQR, generateQRImageFile } = require('vietqr-generator');

// Example: Generate a dynamic QR code
const options = {
    bankBin: '970436',
    accountNumber: '1234567890',
    amount: 25000,
    purpose: 'Thanh toan don hang',
    merchantName: 'My Store'
};

// Generate the QR code payload
const payload = buildVietQR(options);
console.log('Generated Payload:', payload);

// Generate the QR code image file
generateQRImageFile(options, 'dynamic-qr.png')
    .then(() => console.log('QR code generated successfully!'))
    .catch(err => console.error('Error generating QR code:', err));
```

## Examples

### Dynamic QR Code

This example generates a QR code with a pre-filled amount of 25,000 VND.

```bash
node vietqr.js 970436 1234567890 25000 "Thanh toan don hang" "My Store" dynamic-qr.png
```

This will create a file named `dynamic-qr.png` with the following QR code:

![Dynamic QR Code](dynamic-qr.png)

### Static QR Code

This example generates a QR code without a pre-filled amount.

```bash
node vietqr.js 970415 0987654321 0 "" "Nguyen Van A" static-qr.png
```

This will create a file named `static-qr.png` with a generic QR code that can be used for any amount.

## Bank BINs and Codes

The following table lists the Bank BINs and Codes for various banks in Vietnam:

| STT | Mã BIN | Code | Tên viết tắt | SWIFT Code | Tên Tổ chức phát hành thẻ |
|---|---|---|---|---|---|
| 1 | 970400 | SGICB | SaigonBank | SBITVNVX | TMCP Sài Gòn Công thương |
| 2 | 970403 | STP | Sacombank | SGTTVNVX | TMCP Sài Gòn Thương tín |
| 3 | 970405 | VBA | Agribank | VBAAVNVX | Nông nghiệp và Phát triển Nông thôn Việt Nam |
| 4 | 970406 | DOB | DongABank | EACBVNVX | TMCP Đông Á |
| 5 | 970407 | TCB | Techcombank | VTCBVNVX | TMCP Kỹ thương |
| 6 | 970408 | GPB | GPBank | GBNKVNVX | Thương mại TNHH MTV Dầu Khí Toàn Cầu |
| 7 | 970409 | BAB | BacABank | NASCVNVX | TMCP Bắc Á |
| 8 | 970410 | SCVN | StandardChartered | SCBLVNVX | TNHH MTV Standard Chartered |
| 9 | 970412 | PVCB | PVcomBank | WBVNVNVX | TMCP Đại chúng Việt Nam |
| 10 | 970414 | Oceanbank | Oceanbank | OCBKUS3M | TNHH MTV Đại Dương |
| 11 | 970415 | ICB | VietinBank | ICBVVNVX | TMCP Công thương Việt Nam |
| 12 | 970416 | ACB | ACB | ASCBVNVX | TMCP Á Châu |
| 13 | 970418 | BIDV | BIDV | BIDVVNVX | Đầu tư và Phát triển Việt Nam |
| 14 | 970419 | NCB | NCB | NVBAVNVX | TMCP Quốc dân |
| 15 | 970421 | VRB | VRBank | VRBAVNVX | liên doanh Việt Nga |
| 16 | 970422 | MB | MBBank | MSCBVNVX | TMCP Quân Đội |
| 17 | 970423 | TPB | TPBank | TPBVVNVX | TMCP Tiên Phong |
| 18 | 970424 | SHBVN | ShinhanBank | SHBKVNVX | TNHH MTV Shinhan Việt Nam |
| 19 | 970425 | ABB | ABBank | ABBKVNVX | TMCP An Bình |
| 20 | 970426 | MSB | MSB | MCOBVNVX | TMCP Hàng Hải |
| 21 | 970427 | VAB | VietABank | VNACVNVX | TMCP Việt Á |
| 22 | 970428 | NAB | NamABank | NAMAVNVX | TMCP Nam Á |
| 23 | 970429 | SCB | SCB | SACLVNVX | TMCP Sài Gòn |
| 24 | 970430 | PGB | PGBank | PGBLVNVX | TMCP Xăng dầu Petrolimex |
| 25 | 970431 | EIB | Eximbank | EBVIVNVX | TMCP Xuất Nhập khẩu Việt Nam |
| 26 | 970432 | VPB | VPBank | VPBKVNVX | TMCP Việt Nam Thịnh Vượng |
| 27 | 970433 | VIETBANK | VietBank | VNTTVNVX | TMCP Việt Nam Thương Tín |
| 28 | 970434 | IVB | IndovinaBank | IABBVNVX | TNHH Indovina |
| 29 | 970436 | VCB | Vietcombank | BFTVVNVX | TMCP Ngoại thương Việt Nam |
| 30 | 970437 | HDB | HDBank | HDBCVNVX | TMCP Phát triển TP.HCM |
| 31 | 970438 | BVB | BaoVietBank | BVBVVNVX | TMCP Bảo Việt |
| 32 | 970439 | PBVN | PublicBank | VIDPVNVX | liên doanh VID PUBLIC BANK |
| 33 | 970440 | SEAB | SeABank | SEAVVNVX | TMCP Đông Nam Á |
| 34 | 970441 | VIB | VIB | VNIBVNVX | TMCP Quốc Tế Việt Nam |
| 35 | 970442 | HLBVN | HongLeong | HLBBVNVX | TNHH MTV Hong Leong Việt Nam |
| 36 | 970443 | SHB | SHB | SHBAVNVX | TMCP Sài Gòn – Hà Nội |
| 37 | 970444 | CBB | CBBank | GTBAVNVX | Thương mại TNHH MTV Xây dựng Việt Nam |
| 38 | 970446 | COOPBANK | COOPBANK | | Hợp tác xã Việt Nam |
| 39 | 970448 | OCB | OCB | ORCOVNVX | TMCP Phương Đông |
| 40 | 970449 | LPB | LPBank | LVBKVNVX | TMCP Bưu điện Liên Việt (Ngân hàng TMCP Lộc Phát Việt Nam) |
| 41 | 970452 | KLB | KienLongBank | KLBKVNVX | TMCP Kiên Long |
| 42 | 970454 | VCCB | VietCapitalBank | VCBCVNVX | TMCP Bản Việt |
| 43 | 970455 | IBKHN | IBKHN | IBKOVNVX | Công nghiệp Hàn Quốc - Chi nhánh Hà Nội |
| 44 | 970456 | IBKHCM | IBKHCM | IBKOVNVX | Industrial Bank of Korea - Chi nhánh Hồ Chí Minh |
| 45 | 970457 | WVN | Woori | HVBKVNVX | Ngân hàng TNHH Một Thành Viên Woori Bank Việt Nam |
| 46 | 970458 | UOB | UnitedOverseas | UOVBVNVX | Ngân hàng TNHH Một Thành Viên UOB Việt Nam |
| 47 | 970459 | CIMB | CIMBBank | CIBBVNVN | Ngân hàng TNHH Một Thành Viên CIMB Việt Nam |
| 48 | 970460 | Vietcredit | Vietcredit | | Công ty Tài chính cổ phần Xi Măng |
| 49 | 970462 | KBHN | KookminHN | CZNBVN2X | Ngân hàng Kookmin - Chi nhánh Hà Nội |
| 50 | 970463 | KBHCM | KookminHCM | CZNBVNVX | Ngân hàng Kookmin - Chi nhánh Tp. Hồ Chí Minh |
| 51 | 970464 | FCCOM | TNEXFinance | | Công ty Tài chính TNHH MTV CỘNG ĐỒNG (TNHH MTV TNEX) |
| 52 | 970465 | SINOPAC | SINOPAC | SINOVNVX | Ngân hàng SINOPAC - Chi nhánh Tp. Hồ Chí Minh |
| 53 | 970466 | KEBHANAHCM | KEBHanaHCM | KOEXVN2X | Ngân hàng KEB HANA - Chi nhánh Tp. Hồ Chí Minh |
| 54 | 970467 | KEBHANAHN | KEBHANAHN | KOEXVNVX | Ngân hàng KEB HANA - Chi nhánh Hà Nội |
| 55 | 970468 | MAFC | MAFC | | Công ty Tài chính TNHH MTV Mirae Asset (Việt Nam) |
| 56 | 970470 | MCredit | MCredit | | Công ty Tài chính TNHH MB SHINSEI |
