const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

const root = path.resolve(__dirname);
const publicDir = path.resolve(__dirname, 'public');

// 1. Ánh xạ tài nguyên tĩnh (CSS/JS/Images)
app.get('/style.css', (req, res) => res.sendFile(path.join(publicDir, 'style.css')));
app.get('/script.js', (req, res) => res.sendFile(path.join(publicDir, 'script.js')));
app.use('/public', express.static(publicDir));

// 2. Phục vụ các file HTML
app.use(express.static(root, { extensions: ['html'], index: false }));

// --- MOCK API ROUTES (Dùng cho bản không MongoDB) ---

// Dữ liệu sản phẩm mẫu (Bạn có thể copy toàn bộ DEFAULT_PRODUCTS từ script.js vào đây)
let mockProducts = [
    {
        _id: "p1", name: '[NEW DEW] Son Tint Bóng Merzy Dạng Thạch The Watery Dew Tint', brand: 'Merzy', category: 'trang-diem-son-moi', price: 179000, oldPrice: 309000, discount: '42%',
        image: 'https://product.hstatic.net/1000006063/product/wd23_c168ab0ee2c24edda27693a18de15bb5_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/wd23_c168ab0ee2c24edda27693a18de15bb5_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/36_3232d9509c31426c9ea371625b3fc168_1024x1024.png'],
        details: 'Son Tint Bóng Dạng Thạch Merzy The Watery Dew Tint lấy cảm hứng từ tinh thần Old Money, mang lại đôi môi căng mọng, bền màu suốt ngày dài.',
        specs: { 'Chất son': 'Son thạch, son tint', 'Dung tích': '4g', 'Thương hiệu': 'Merzy (Hàn Quốc)', 'Nơi sản xuất': 'Hàn Quốc' },
        sold: 25200, stock: 100
    },
    {
        _id: "p2", name: 'Serum Chống Nắng B.O.M Water Glow Sun Serum SPF50+PA++++ 50g', brand: 'B.O.M', category: 'cham-soc-da', price: 438000, oldPrice: 548000, discount: '20%',
        image: 'https://cdn.hstatic.net/products/1000006063/bt_770a3fcae16d4350ad40ad252a1805fb_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/bt_770a3fcae16d4350ad40ad252a1805fb_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/download_761a7597092b4c799c8d06e2f284d44c_1024x1024.jpg'],
        details: 'Tinh chất chống nắng bảo vệ da phổ rộng, cấp ẩm vượt trội với 89% thành phần dưỡng da.',
        specs: { 'Dung tích': '50g', 'Chỉ số': 'SPF50+ PA++++', 'Thương hiệu': 'B.O.M (Hàn Quốc)', 'Loại da': 'Mọi loại da' },
        sold: 1500, stock: 50
    },
    {
        _id: "p3", name: 'Kem Chống Nắng La Roche-Posay Anthelios UVMune 400 SPF50+', brand: 'La Roche-Posay', category: 'cham-soc-da', price: 449000, oldPrice: 640000, discount: '30%',
        image: 'https://product.hstatic.net/1000006063/product/bth_b1850e1e326b4a60ab803afca16b55af_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/bth_b1850e1e326b4a60ab803afca16b55af_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/22_2d9c2cc106af4ff5a8b76a5eabf5a099_1024x1024.png'],
        details: 'Dòng sản phẩm bảo vệ da toàn diện trước tia UVA dài, ngăn ngừa thâm nám và lão hóa sớm.',
        specs: { 'Dung tích': '50ml', 'Thương hiệu': 'La Roche-Posay (Pháp)', 'Kết cấu': 'Dạng sữa lỏng', 'Đặc tính': 'Không nhờn rít' },
        sold: 3200, stock: 80
    },
    {
        _id: "p4", name: 'Kem Chống Nắng CLINICOS Truth Sunscreen SPF 50+ PA++++', brand: 'CLINICOS', category: 'cham-soc-da', price: 129000, oldPrice: 219000, discount: '41%',
        image: 'https://cdn.hstatic.net/products/1000006063/clinicos_1_01852f0e66eb4f66a1868e5d5c336d03_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/clinicos_1_01852f0e66eb4f66a1868e5d5c336d03_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/download__9__af2f0acce36047ca8221217379bc5092_1024x1024.jpg'],
        details: 'Củng cố hàng rào bảo vệ da với Niacinamide và Vitamin E, hỗ trợ làm dịu và sáng da.',
        specs: { 'Dung tích': '50ml', 'Thương hiệu': 'CLINICOS (Việt Nam)', 'Nơi sản xuất': 'Việt Nam', 'Chỉ số': 'SPF50+ PA++++' },
        sold: 33, stock: 200
    },
    {
        _id: "p5", name: 'Kem Chống Nắng Caryophy Nâng Tông Smart Sunscreen SPF50+', brand: 'CARYOPHY', category: 'cham-soc-da', price: 310000, oldPrice: 360000, discount: '14%',
        image: 'https://product.hstatic.net/1000006063/product/a5dee1093d94a01c9bed0bd7d75_72f7f1f42a4a4a3c9f89d24674a0cc6f_1024x1024_884db8ac03f643708b5baed015ec0eb7_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/a5dee1093d94a01c9bed0bd7d75_72f7f1f42a4a4a3c9f89d24674a0cc6f_1024x1024_884db8ac03f643708b5baed015ec0eb7_1024x1024.jpg'],
        details: 'Tác dụng 3in1: Chống nắng, nâng tông tự nhiên và dưỡng da với chiết xuất rau má, rau sam.',
        specs: { 'Dung tích': '50ml', 'Thương hiệu': 'Caryophy (Hàn Quốc)', 'Nơi sản xuất': 'Hàn Quốc', 'Loại da': 'Mọi loại da' },
        sold: 2600, stock: 100
    },
    {
        _id: "p8", name: 'Kem Chống Nắng Make P:rem UV Defense Me Sun Cream SPF50+', brand: 'Make P:rem', category: 'cham-soc-da', price: 309000, oldPrice: 450000, discount: '31%',
        image: 'https://product.hstatic.net/1000006063/product/bt_watery_e83562e4e591408c9801d18259120ea1_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/bt_watery_e83562e4e591408c9801d18259120ea1_1024x1024.jpg'],
        details: 'Kem chống nắng vật lý lành tính cho da nhạy cảm, giúp làm dịu và bảo vệ da tối ưu.',
        specs: { 'Dung tích': '50ml', 'Thương hiệu': 'Make P:rem (Hàn Quốc)', 'Kết cấu': 'Dạng kem mỏng nhẹ', 'Hạn dùng': '3 năm' },
        sold: 351, stock: 100
    },
    {
        _id: "p9", name: 'Kem Chống Nắng Acnes Giảm Mụn Blemish Control Sunscreen', brand: 'Acnes', category: 'cham-soc-da', price: 148000, oldPrice: 158000, discount: '6%',
        image: 'https://product.hstatic.net/1000006063/product/vn-11134201-23030-scu1mi2xkpov69_ea5a65254a374a0a89a267fd4eed714f_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/vn-11134201-23030-scu1mi2xkpov69_ea5a65254a374a0a89a267fd4eed714f_1024x1024.jpg'],
        details: 'Sản phẩm chuyên biệt cho da mụn với chiết xuất tràm trà, giúp bảo vệ và cải thiện tình trạng mụn.',
        specs: { 'Khối lượng': '50g', 'Thương hiệu': 'Acnes (Nhật Bản)', 'Nơi sản xuất': 'Việt Nam', 'Thành phần': 'Tràm trà, B3, B5' },
        sold: 24, stock: 150
    },
    {
        _id: "p10", name: 'Gel Chống Nắng Anessa Perfect UV Skincare Gel SPF50+', brand: 'Anessa', category: 'cham-soc-da', price: 488000, oldPrice: 575000, discount: '15%',
        image: 'https://product.hstatic.net/1000006063/product/8_38fdbb4cd52541b58537b5136a144bea_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/8_38fdbb4cd52541b58537b5136a144bea_1024x1024.jpg'],
        details: 'Công nghệ Auto Veil tự phục hồi màng bảo vệ, dưỡng ẩm sâu và chống bụi PM2.5.',
        specs: { 'Khối lượng': '90g', 'Thương hiệu': 'Anessa (Nhật Bản)', 'Loại da': 'Da thường đến da khô', 'Chỉ số': 'SPF50+ PA++++' },
        sold: 517, stock: 200
    },
    {
        _id: "p11", name: 'Miếng Pad Dưỡng Ẩm Emmié Semi-Gel Mask Pad (60 miếng)', brand: 'Emmié by HappySkin', category: 'cham-soc-da', price: 315000, oldPrice: 450000, discount: '30%',
        image: 'https://cdn.hstatic.net/products/1000006063/emmie_copy_28ed3a4f9ae3421db56ff99742a1599f_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/emmie_copy_28ed3a4f9ae3421db56ff99742a1599f_1024x1024.jpg'],
        details: 'Toner pad đa năng giúp làm sạch nhẹ nhàng và cấp ẩm sâu cho da tức thì.',
        specs: { 'Quy cách': '60 miếng', 'Thương hiệu': 'Emmié by HappySkin', 'Nơi sản xuất': 'Việt Nam', 'Thành phần': 'Niacinamide, HA' },
        sold: 850, stock: 100
    },
    {
        _id: "p12", name: 'Nước Dưỡng Tóc Tinh Dầu Bưởi Cocoon 140ml', brand: 'Cocoon', category: 'cham-soc-toc', price: 158000, oldPrice: 185000, discount: '15%',
        image: 'https://product.hstatic.net/1000006063/product/dai_dien_dce04d99812b47ada407478149e79841_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/dai_dien_dce04d99812b47ada407478149e79841_1024x1024.jpg'],
        details: 'Sản phẩm thuần chay giúp giảm rụng tóc và kích thích tóc mọc nhanh, chắc khỏe.',
        specs: { 'Dung tích': '140ml', 'Thương hiệu': 'Cocoon (Việt Nam)', 'Đặc tính': 'Thuần chay', 'Hạn dùng': '3 năm' },
        sold: 1250, stock: 200
    },
    {
        _id: "p13", name: 'Dầu Dưỡng Tóc L\'Oreal Elseve Extraordinary Oil 100ml', brand: 'L\'Oreal', category: 'cham-soc-toc', price: 199000, oldPrice: 259000, discount: '23%',
        image: 'https://product.hstatic.net/1000006063/product/l_oreal_elseve_extraordinary_oil_serum_100ml_007ce77196394a61be72d344439c24d9_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/l_oreal_elseve_extraordinary_oil_serum_100ml_007ce77196394a61be72d344439c24d9_1024x1024.jpg'],
        details: 'Dưỡng tóc mềm mượt tức thì với chiết xuất từ 6 loại hoa quý hiếm.',
        specs: { 'Dung tích': '100ml', 'Thương hiệu': 'L\'Oreal (Pháp)', 'Công dụng': 'Dưỡng mượt, bóng tóc', 'Nơi sản xuất': 'Indonesia' },
        sold: 3400, stock: 180
    },
    {
        _id: "p14", name: 'Xịt Dưỡng Tóc Ha\'sol Anagen Active Tonic 100ml', brand: 'Ha\'sol', category: 'cham-soc-toc', price: 455000, oldPrice: 650000, discount: '30%',
        image: 'https://cdn.hstatic.net/products/1000006063/ha_sol_79609e4f4d934ea8b56988ebf2a4c7f0_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/ha_sol_79609e4f4d934ea8b56988ebf2a4c7f0_1024x1024.jpg'],
        details: 'Giải pháp chuyên sâu cho da đầu yếu và tóc dễ rụng đến từ Hàn Quốc.',
        specs: { 'Dung tích': '100ml', 'Thương hiệu': 'Ha\'sol (Hàn Quốc)', 'Công dụng': 'Hỗ trợ mọc tóc', 'Nơi sản xuất': 'Hàn Quốc' },
        sold: 520, stock: 40
    },
    {
        _id: "p15", name: 'Kem Ủ Tóc Dove Intensive Repair 180ml', brand: 'Dove', category: 'cham-soc-toc', price: 159000, oldPrice: 215000, discount: '26%',
        image: 'https://product.hstatic.net/1000006063/product/unilever_e_copy_9016c3502bd9443ab94af880d9e6c06f_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/unilever_e_copy_9016c3502bd9443ab94af880d9e6c06f_1024x1024.jpg'],
        details: 'Phục hồi hư tổn nặng, nuôi dưỡng sợi tóc từ sâu bên trong cho mái tóc chắc khỏe.',
        specs: { 'Dung tích': '180ml', 'Thương hiệu': 'Dove', 'Loại tóc': 'Tóc khô xơ, hư tổn', 'Nơi sản xuất': 'Việt Nam' },
        sold: 1250, stock: 110
    },
    {
        _id: "p16", name: 'Sữa Dưỡng Thể Olay Cellscience B3+ Vitamin C', brand: 'Olay', category: 'bodycare', price: 359000, oldPrice: 420000, discount: '15%',
        image: 'https://cdn.hstatic.net/products/1000006063/olay_a6cd68555dec44639f4795f55046ff84_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/olay_a6cd68555dec44639f4795f55046ff84_1024x1024.jpg'],
        details: 'Sữa dưỡng thể dưỡng trắng sáng da hiệu quả với hàm lượng Niacinamide tinh khiết.',
        specs: { 'Dung tích': '210ml', 'Thương hiệu': 'Olay', 'Thành phần': 'B3, Vitamin C', 'Nơi sản xuất': 'Trung Quốc' },
        sold: 15600, stock: 80
    },
    {
        _id: "p17", name: 'Sữa Dưỡng Thể DrCeutics Niacinamide 10% + Arbutin 2%', brand: 'DrCeutics', category: 'bodycare', price: 216000, oldPrice: 280000, discount: '23%',
        image: 'https://product.hstatic.net/1000006063/product/200g_3daee16554c6439f92568530e2ff9638_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/200g_3daee16554c6439f92568530e2ff9638_1024x1024.jpg'],
        details: 'Cải thiện sắc tố da cơ thể hiệu quả với nồng độ hoạt chất cao, phục hồi da sạm màu.',
        specs: { 'Khối lượng': '200g', 'Thương hiệu': 'DrCeutics (Việt Nam)', 'Nơi sản xuất': 'Việt Nam', 'Công dụng': 'Dưỡng trắng, phục hồi' },
        sold: 8900, stock: 100
    },
    {
        _id: "p18", name: 'Son Tint Merzy Water Fit Blur Tint Mịn Lì', brand: 'Merzy', category: 'trang-diem-son-moi', price: 159000, oldPrice: 250000, discount: '36%',
        image: 'https://cdn.hstatic.net/products/1000006063/thum__1__b21510ab0920480da2f579a24031a569_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/thum__1__b21510ab0920480da2f579a24031a569_1024x1024.jpg'],
        details: 'Chất son mịn lì như nhung, che phủ vân môi hoàn hảo và bền màu suốt cả ngày.',
        specs: { 'Trọng lượng': '4g', 'Thương hiệu': 'Merzy (Hàn Quốc)', 'Kết cấu': 'Blur Tint', 'Nơi sản xuất': 'Hàn Quốc' },
        sold: 12400, stock: 200
    },
    {
        _id: "p19", name: 'Son Tint Fwee Rose Obsession Stay Fit Tint', brand: 'Fwee', category: 'trang-diem-son-moi', price: 289000, oldPrice: 350000, discount: '17%',
        image: 'https://cdn.hstatic.net/products/1000006063/fwee_2819eb38e14d48f680a973f8b7e74d9e_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/fwee_2819eb38e14d48f680a973f8b7e74d9e_1024x1024.jpg'],
        details: 'Dòng son lấy cảm hứng từ hoa hồng, màu sắc lãng mạn và độ bền màu cực tốt.',
        specs: { 'Dung tích': '4.5g', 'Thương hiệu': 'Fwee (Hàn Quốc)', 'Nơi sản xuất': 'Hàn Quốc', 'Loại': 'Son kem lì' },
        sold: 3800, stock: 100
    },
    {
        _id: "p20", name: 'Son Tint Bóng B.O.M Lip Flash Tint Căng Mọng', brand: 'B.O.M', category: 'trang-diem-son-moi', price: 159000, oldPrice: 220000, discount: '28%',
        image: 'https://cdn.hstatic.net/products/1000006063/bom_f36662e5f6da4e8d91acaed985fcd6f3_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/bom_f36662e5f6da4e8d91acaed985fcd6f3_1024x1024.jpg'],
        details: 'Hiệu ứng bóng gương cực đỉnh cho đôi môi căng mọng pha lê mà không bết dính.',
        specs: { 'Trọng lượng': '3g', 'Thương hiệu': 'B.O.M (Hàn Quốc)', 'Hiệu ứng': 'Căng bóng', 'Nơi sản xuất': 'Hàn Quốc' },
        sold: 5200, stock: 150
    },
    {
        _id: "p21", name: 'Son Kem Bùn Judydoll Matte Lip Mud Siêu Lì', brand: 'Judydoll', category: 'trang-diem-son-moi', price: 139000, oldPrice: 195000, discount: '29%',
        image: 'https://cdn.hstatic.net/products/1000006063/judydoll_copy_e3bcc32282d746a48f2184206eca8d7e_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/judydoll_copy_e3bcc32282d746a48f2184206eca8d7e_1024x1024.jpg'],
        details: 'Kết cấu dạng bùn mềm mịn, mờ lì tuyệt đối và che phủ vân môi cực tốt.',
        specs: { 'Thương hiệu': 'Judydoll', 'Nơi sản xuất': 'Trung Quốc', 'Kết cấu': 'Dạng bùn (Lip Mud)', 'Hạn dùng': '3 năm' },
        sold: 18900, stock: 300
    },
    {
        _id: "p22", name: 'Son Tint Gương Colorkey Airy Lip Mirror Series', brand: 'Colorkey', category: 'trang-diem-son-moi', price: 165000, oldPrice: 210000, discount: '21%',
        image: 'https://cdn.hstatic.net/products/1000006063/colorkey_78ec67e8ef2d4ddebde815145977f9e3_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/colorkey_78ec67e8ef2d4ddebde815145977f9e3_1024x1024.jpg'],
        details: 'Dòng son bóng gương nổi tiếng với lớp màng phim giữ màu, không trôi khi ăn nhẹ.',
        specs: { 'Dung tích': '3.5ml', 'Thương hiệu': 'Colorkey', 'Hiệu ứng': 'Phủ gương', 'Nơi sản xuất': 'Trung Quốc' },
        sold: 32400, stock: 500
    },
    {
        _id: "p23", name: 'Mặt Nạ Giấy Klairs Freshly Vitamin Skin Prep Pads Sáng Da', brand: 'Klairs', category: 'skincare', price: 350000, oldPrice: 450000, discount: '22%',
        image: 'https://cdn.hstatic.net/products/1000006063/hdd_1_19407937876b40abb537d599e97ed2e5_1024x1024.jpg',
        images: ['https://cdn.hstatic.net/products/1000006063/hdd_1_19407937876b40abb537d599e97ed2e5_1024x1024.jpg', 'https://cdn.hstatic.net/products/1000006063/565653434_1201546382071482_33934_7767e302a3414875a2d3ceb64efa4ba2_1024x1024.jpg'],
        details: 'Miếng toner pad chứa Vitamin giúp làm sáng da, mờ thâm và tẩy tế bào chết nhẹ nhàng.',
        specs: { 'Quy cách': '50 miếng', 'Thương hiệu': 'Klairs (Hàn Quốc)', 'Nơi sản xuất': 'Hàn Quốc', 'Thành phần': 'Vitamin C, E' },
        sold: 1200, stock: 150
    },
    {
        _id: "p24", name: 'Mặt Nạ Đất Sét Aperire Spa Relief Pore Mask Se Khít Lỗ Chân Lông', brand: 'Aperire', category: 'skincare', price: 259000, oldPrice: 380000, discount: '32%',
        image: 'https://product.hstatic.net/1000006063/product/hdd_1f4c7fa0b34347dabc855ce0707df457_1024x1024.jpg',
        images: ['https://product.hstatic.net/1000006063/product/hdd_1f4c7fa0b34347dabc855ce0707df457_1024x1024.jpg', 'https://product.hstatic.net/1000006063/product/download__1__474e48abd34b478f8931ed2c0ac11559_1024x1024.jpg'],
        details: 'Hút sạch bã nhờn sâu trong lỗ chân lông, làm dịu da và se khít lỗ chân lông hiệu quả.',
        specs: { 'Khối lượng': '120g', 'Thương hiệu': 'Aperire (Hàn Quốc)', 'Thành phần': 'Đất sét Alaska', 'Nơi sản xuất': 'Hàn Quốc' },
        sold: 850, stock: 120
    },
    {
        _id: "p25", name: 'Mặt Nạ Dưỡng Ẩm Chiết Xuất Mật Ong Và Sữa B.O.M Honey & Milk Mask 25ml', brand: 'B.O.M', category: 'cham-soc-da', price: 19000, oldPrice: 30000, discount: '37%',
        image: 'https://cdn.hstatic.net/products/1000006063/29_626508f41adf4988875fe8d5ca022e8c_1024x1024.png',
        images: ['https://cdn.hstatic.net/products/1000006063/29_626508f41adf4988875fe8d5ca022e8c_1024x1024.png', 'https://product.hstatic.net/1000006063/product/untitled-1_87d859435cbc447d864323b7b8fe88f6_1024x1024.jpg', 'https://product.hstatic.net/1000006063/product/sg-11134201-22100-5z94njq6h2ivff_2c98017ae89d402fbe9b3d92c296df84_1024x1024.jpg'],
        details: 'Mặt nạ chứa chiết xuất mật ong và sữa giúp cấp ẩm sâu, nuôi dưỡng làn da mềm mại và sáng mịn tức thì.',
        specs: { 'Dung tích': '25ml', 'Thương hiệu': 'B.O.M (Hàn Quốc)', 'Thành phần': 'Mật ong, Sữa tươi', 'Loại da': 'Mọi loại da' },
        sold: 1200, stock: 500
    },
    {
        _id: "p26",
        name: 'Son Kem Lì Bền Màu, Lâu Trôi Merzy Puffer Velvet Tint 3.7g',
        brand: 'Merzy',
        category: 'trang-diem-son-moi',
        price: 169000,
        oldPrice: 280000,
        discount: '40%',
        image: 'https://product.hstatic.net/1000006063/product/thum_3e5a7c11b45444c6bb35c6727751ce6f_1024x1024.jpg',
        images: [
            'https://product.hstatic.net/1000006063/product/thum_3e5a7c11b45444c6bb35c6727751ce6f_1024x1024.jpg',
            'https://product.hstatic.net/1000006063/product/hinh_son_5ecbd0ea1b9d4a5281bccb05294097dc_1024x1024.jpg',
            'https://product.hstatic.net/1000006063/product/untitled-1_c8f7c634730d4939b82325acccef4803_1024x1024.jpg'
        ],
        details: 'Son Kem Lì Bền Màu, Lâu Trôi Merzy Puffer Velvet Tint 3.7g với kết cấu xốp mịn, mỏng nhẹ, độ bám màu cực cao giúp đôi môi luôn rạng rỡ suốt ngày dài.',
        specs: { 'Khối lượng': '3.7g', 'Thương hiệu': 'Merzy (Hàn Quốc)', 'Nơi sản xuất': 'Hàn Quốc', 'Hạn sử dụng': '3 năm' },
        sold: 1200,
        stock: 100
    },
    {
        _id: "p27",
        name: 'Son Kem Lì Mịn Mướt Nhẹ Môi Bền Màu Merzy Cyber Mellow Tint 4g',
        brand: 'Merzy',
        category: 'trang-diem-son-moi',
        price: 159000,
        oldPrice: 250000,
        discount: '36%',
        image: 'https://cdn.hstatic.net/products/1000006063/19_a90426028a164b06a558394b6b49731c_1024x1024.png',
        images: ['https://cdn.hstatic.net/products/1000006063/19_a90426028a164b06a558394b6b49731c_1024x1024.png', 'https://product.hstatic.net/1000006063/product/merzy_cyber_mellow_tint_4g_e084f_5107aee8ff8f41dbbe8f13f701e820d6_1024x1024.jpg', 'https://product.hstatic.net/1000006063/product/merzy_cyber_mellow_tint_4g_e084fc059ce1486daab899d9c949c00b_1024x1024.jpg'],
        details: 'Merzy Cyber Mellow Tint là dòng son kem lì mới với thiết kế hiện đại, chất son xốp mịn dễ tán.',
        specs: { 'Khối lượng': '4g', 'Thương hiệu': 'Merzy (Hàn Quốc)', 'Nơi sản xuất': 'Hàn Quốc', 'Hạn sử dụng': '3 năm' },
        sold: 1100, stock: 150
    }
]; // Thêm nhiều sản phẩm hơn nếu cần

let mockCategories = [
    { id: 1, name: 'Trang điểm', slug: 'trang-diem' },
    { id: 2, name: 'Chăm sóc da', slug: 'skincare' },
    { id: 3, name: 'Dưỡng thể', slug: 'bodycare' },
    { id: 4, name: 'Tóc & Da đầu', slug: 'haircare' }
];

// API Sản phẩm
app.get(['/api/products', '/products'], (req, res) => res.json(mockProducts));

app.post(['/api/products', '/products'], (req, res) => {
    const newProd = { ...req.body, _id: "P-" + Date.now() };
    mockProducts.push(newProd);
    res.status(201).json(newProd);
});

app.put(['/api/products/:id', '/products/:id'], (req, res) => {
    const index = mockProducts.findIndex(p => p._id === req.params.id);
    if (index !== -1) {
        mockProducts[index] = { ...mockProducts[index], ...req.body };
        res.json(mockProducts[index]);
    } else {
        res.status(404).json({ message: "Không tìm thấy SP" });
    }
});

app.delete(['/api/products/:id', '/products/:id'], (req, res) => {
    mockProducts = mockProducts.filter(p => p._id !== req.params.id);
    res.json({ message: "Đã xóa" });
});

// API Danh mục
app.get(['/api/categories', '/categories'], (req, res) => res.json(mockCategories));
app.post(['/api/categories', '/categories'], (req, res) => {
    const newCat = { ...req.body };
    mockCategories.push(newCat);
    res.status(201).json(newCat);
});
app.delete('/api/categories/:id', (req, res) => {
    mockCategories = mockCategories.filter(c => c.id != req.params.id);
    res.json({ message: "Đã xóa danh mục" });
});

// Mock Data cho Bài viết & Người dùng
let mockOrders = [];
let mockMagazine = [];
let mockUsers = [
    { _id: "u1", name: "Nguyễn Văn A", email: "customer@example.com", role: "Khách hàng", createdAt: new Date() },
    { _id: "u2", name: "Admin", email: "admin@qh.com", role: "Quản trị viên", createdAt: new Date() }
];
let mockConfig = {
    hotline: "1900 636 510", email: "contact@qhskinlab.com", banners: []
};

// Route đăng nhập (Mô phỏng)
app.post('/api/users/login', (req, res) => {
    const { email, password } = req.body;
    
    // Giả lập: admin@qh.com / 123456 là Admin
    const isAdmin = email === 'admin@qh.com' && password === '123456';
    const name = isAdmin ? 'Admin Hệ Thống' : (email ? email.split('@')[0] : 'Người dùng');

    // Tạo token giả (Base64) để Frontend có thể giải mã kiểm tra quyền
    const payload = Buffer.from(JSON.stringify({ id: "mock-id", name, isAdmin })).toString('base64');
    const token = `mockHeader.${payload}.mockSignature`;

    res.json({ token, name, email: email || 'user@example.com', isAdmin });
});

// Route đăng ký (Mô phỏng)
app.post('/api/users', (req, res) => {
    const { name, email } = req.body;
    const payload = Buffer.from(JSON.stringify({ id: "mock-id", name, isAdmin: false })).toString('base64');
    const token = `mockHeader.${payload}.mockSignature`;

    res.status(201).json({ token, name, email, isAdmin: false });
});

// Quản lý Người dùng (Chỉ xem)
app.get('/api/users', (req, res) => res.json(mockUsers));

// Quản lý Bài viết (Magazine)
app.get(['/api/magazine', '/magazine'], (req, res) => res.json(mockMagazine));
app.post('/api/magazine', (req, res) => {
    const post = { ...req.body, _id: "MAG-" + Date.now(), createdAt: new Date() };
    mockMagazine.push(post);
    res.status(201).json(post);
});
app.delete('/api/magazine/:id', (req, res) => {
    mockMagazine = mockMagazine.filter(m => m._id !== req.params.id);
    res.json({ message: "Đã xóa bài viết" });
});

// Quản lý Cấu hình
app.get('/api/config', (req, res) => res.json(mockConfig));
app.post('/api/config', (req, res) => {
    mockConfig = { ...mockConfig, ...req.body };
    res.json(mockConfig);
});

// Route kiểm tra quyền Admin (Dùng cho admin.html)
app.get('/api/users/admin-check', (req, res) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.includes('.')) {
        try {
            const token = authHeader.split(' ')[1];
            const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf8'));
            if (payload.isAdmin) return res.json({ isAdmin: true });
        } catch (e) {}
    }
    res.status(401).json({ message: "Không có quyền Admin" });
});

// Lấy danh sách đơn hàng (Cho Admin)
app.get(['/api/orders', '/orders'], (req, res) => res.json(mockOrders));

// Route đặt hàng
app.post(['/api/orders', '/orders'], (req, res) => {
    const { customerInfo, items, paymentMethod, totalPrice: clientTotal } = req.body;
    
    const newOrder = {
        _id: "ORDER-" + Date.now() + Math.floor(Math.random() * 1000),
        customerInfo,
        items,
        paymentMethod,
        totalPrice: clientTotal || items.reduce((sum, i) => sum + (i.price || 0) * i.quantity, 0),
        status: "Chờ xác nhận",
        isPaid: false,
        createdAt: new Date()
    };

    mockOrders.push(newOrder);
    res.status(201).json(newOrder);
});

// 3. ĐỊNH TUYẾN TRANG (Explicit Routing để tránh 404)
const pages = ['index', 'product-detail', 'admin', 'category', 'magazine', 'magazine-detail', 'policy', 'about', 'contact', 'support'];
pages.forEach(page => {
    const route = page === 'index' ? '/' : `/${page}`;
    app.get(route, (req, res) => res.sendFile(path.join(root, `${page}.html`)));
    // Hỗ trợ cả link có đuôi .html
    app.get(`/${page}.html`, (req, res) => res.sendFile(path.join(root, `${page}.html`)));
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Local Server running on port ${PORT}`));
}

module.exports = app;