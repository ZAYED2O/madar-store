const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, 'dxlr.db');

if (fs.existsSync(dbPath)) {
  if (process.argv.includes('--force')) {
    fs.unlinkSync(dbPath);
    console.log('✓ حذف قاعدة البيانات القديمة بطلب صريح');
  } else {
    console.log('✓ قاعدة البيانات موجودة بالفعل. تم تخطي التهيئة لحماية البيانات.');
    process.exit(0);
  }
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) { console.error('خطأ:', err.message); process.exit(1); }
  console.log('✓ الاتصال بقاعدة البيانات');
});

db.serialize(async () => {
  // 1. Products Table (Bilingual)
  db.run(`CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_en TEXT NOT NULL,
    name_ar TEXT NOT NULL,
    handle TEXT NOT NULL,
    price REAL NOT NULL,
    original_price REAL NOT NULL,
    category_en TEXT NOT NULL,
    category_ar TEXT NOT NULL,
    badge_en TEXT,
    badge_ar TEXT,
    image_primary TEXT NOT NULL,
    image_secondary TEXT,
    sizes TEXT NOT NULL,
    low_stock INTEGER NOT NULL DEFAULT 0,
    rating REAL NOT NULL DEFAULT 5.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    description_en TEXT NOT NULL,
    description_ar TEXT NOT NULL
  )`, err => { if (!err) console.log('✓ جدول المنتجات'); });

  // 2. Users Table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT DEFAULT 'customer',
    avatar_initials TEXT,
    phone TEXT,
    address TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => { if (!err) console.log('✓ جدول المستخدمين'); });

  // 3. Orders Table
  db.run(`CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id TEXT NOT NULL UNIQUE,
    user_id INTEGER,
    items TEXT NOT NULL,
    note TEXT,
    subtotal REAL NOT NULL,
    shipping REAL NOT NULL,
    total REAL NOT NULL,
    status TEXT DEFAULT 'قيد الانتظار',
    customer_name TEXT,
    customer_phone TEXT,
    customer_address TEXT,
    customer_city TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => { if (!err) console.log('✓ جدول الطلبات'); });

  // 4. Sessions Table
  db.run(`CREATE TABLE IF NOT EXISTS sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => { if (!err) console.log('✓ جدول الجلسات'); });

  // 5b. Announcements Table
  db.run(`CREATE TABLE IF NOT EXISTS announcements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text_ar TEXT NOT NULL,
    text_en TEXT NOT NULL,
    active INTEGER DEFAULT 1,
    order_num INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => { if (!err) console.log('✓ جدول الإعلانات'); });

  // 5. Site Content CMS Table
  db.run(`CREATE TABLE IF NOT EXISTS site_content (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    section TEXT NOT NULL,
    key_name TEXT NOT NULL UNIQUE,
    value_ar TEXT,
    value_en TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => { if (!err) console.log('✓ جدول محتوى الموقع (CMS)'); });

  // 6. Contact Messages Table
  db.run(`CREATE TABLE IF NOT EXISTS contact_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT,
    message TEXT NOT NULL,
    reply_text TEXT,
    status TEXT DEFAULT 'قيد الانتظار',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`, err => { if (!err) console.log('✓ جدول رسائل التواصل'); });

  // ─── Seed Products ───────────────────────────────────────────────────────
  const products = [
    { name_en:"Minimalist Waffle Knit T-Shirt", name_ar:"تيشرت محبوك وافل بسيط", handle:"waffle-knit-tshirt", price:490, original_price:650, category_en:"T-Shirts", category_ar:"تيشرتات", badge_en:"Sale 25%", badge_ar:"خصم ٢٥٪", image_primary:"assets/waffle_shirt_1.png", image_secondary:"assets/waffle_shirt_2.png", sizes:'["M","L","XL","2XL"]', low_stock:1, rating:4.9, reviews_count:38, description_en:"Premium waffle texture fabric, breathable and structured.", description_ar:"قماش وافل فاخر مسامي ومهيكل." },
    { name_en:"Aesthetic Grey Sweatpants", name_ar:"بنطلون رياضي رمادي أنيق", handle:"grey-sweatpants", price:680, original_price:850, category_en:"Sweatpants", category_ar:"بناطيل رياضية", badge_en:"Best Seller", badge_ar:"الأكثر مبيعاً", image_primary:"assets/grey_sweatpants_1.png", image_secondary:"assets/grey_sweatpants_2.png", sizes:'["M","L","XL","2XL"]', low_stock:0, rating:4.8, reviews_count:52, description_en:"Heavyweight fleece cotton blend. Zippered side pockets.", description_ar:"قطن فليس ثقيل. جيوب جانبية بسحاب." },
    { name_en:"Developer Oversized Hoodie", name_ar:"هودي مطور واسع مريح", handle:"developer-oversized-hoodie", price:950, original_price:1200, category_en:"Outfits", category_ar:"ملابس كاملة", badge_en:"Sale 20%", badge_ar:"خصم ٢٠٪", image_primary:"assets/developer_hoodie_1.png", image_secondary:"assets/developer_hoodie_2.png", sizes:'["M","L","XL","2XL"]', low_stock:1, rating:5.0, reviews_count:89, description_en:"Super-soft oversized hoodie with console bracket embroidery.", description_ar:"هودي واسع ناعم بتطريز أيقوني." },
    { name_en:"Classic Ringer Tech Tee", name_ar:"تيشرت رينجر كلاسيكي", handle:"ringer-tech-tee", price:450, original_price:550, category_en:"Ringer Tees", category_ar:"تيشرتات رينجر", badge_en:"Sale 18%", badge_ar:"خصم ١٨٪", image_primary:"assets/ringer_tee_1.png", image_secondary:"assets/ringer_tee_2.png", sizes:'["M","L","XL"]', low_stock:0, rating:4.7, reviews_count:17, description_en:"Retro contrast ribbing meets digital aesthetics.", description_ar:"تصميم كلاسيكي مع جماليات رقمية." },
    { name_en:"Minimal Comfort Tank Top", name_ar:"تيشرت حمالات مريح", handle:"minimal-tank-top", price:350, original_price:450, category_en:"Tank Tops", category_ar:"تيشرتات حمالات", badge_en:"Sale", badge_ar:"خصم", image_primary:"assets/tank_top_1.png", image_secondary:"assets/tank_top_2.png", sizes:'["M","L","XL"]', low_stock:0, rating:4.6, reviews_count:14, description_en:"Breathable comfort with flatlock stitching.", description_ar:"راحة مسامية وخياطة مسطحة." },
    { name_en:"Textured Knitted Sweater", name_ar:"سترة محبوكة ذات ملمس", handle:"knitted-sweater", price:890, original_price:1100, category_en:"Knitted Wear", category_ar:"تريكو ومحبوكات", badge_en:"New", badge_ar:"جديد", image_primary:"assets/knitted_sweater_1.png", image_secondary:"assets/knitted_sweater_2.png", sizes:'["M","L","XL","2XL"]', low_stock:1, rating:4.8, reviews_count:21, description_en:"Heavy-weight knit with organic cotton texture.", description_ar:"تريكو ثقيل بملمس قطن عضوي." },
    { name_en:"Vintage Indigo Denim Jacket", name_ar:"جاكيت جينز نيلي كلاسيكي", handle:"denim-jacket", price:1150, original_price:1500, category_en:"Denim", category_ar:"جينز ودنيم", badge_en:"Sale 23%", badge_ar:"خصم ٢٣٪", image_primary:"assets/denim_jacket_1.png", image_secondary:"assets/denim_jacket_2.png", sizes:'["M","L","XL"]', low_stock:0, rating:4.9, reviews_count:33, description_en:"Authentic raw indigo denim with matte-black hardware.", description_ar:"دنيم نيلي أصيل بأزرار فولاذية سوداء." },
    { name_en:"Linear Striped Relaxed Shirt", name_ar:"قميص مخطط مريح", handle:"striped-relaxed-shirt", price:520, original_price:650, category_en:"Striped Shirts", category_ar:"قمصان مخططة", badge_en:"Sale 20%", badge_ar:"خصم ٢٠٪", image_primary:"assets/striped_shirt_1.png", image_secondary:"assets/striped_shirt_2.png", sizes:'["M","L","XL","2XL"]', low_stock:0, rating:4.7, reviews_count:19, description_en:"Thin vertical stripes. Linen-cotton blend.", description_ar:"خطوط عمودية رفيعة. مزيج كتان وقطن." }
  ];

  const insertProduct = db.prepare(`INSERT INTO products (name_en,name_ar,handle,price,original_price,category_en,category_ar,badge_en,badge_ar,image_primary,image_secondary,sizes,low_stock,rating,reviews_count,description_en,description_ar) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`);
  products.forEach(p => insertProduct.run(p.name_en,p.name_ar,p.handle,p.price,p.original_price,p.category_en,p.category_ar,p.badge_en,p.badge_ar,p.image_primary,p.image_secondary,p.sizes,p.low_stock,p.rating,p.reviews_count,p.description_en,p.description_ar));
  insertProduct.finalize(() => console.log('✓ تم زرع ٨ منتجات'));

  // ─── Seed Users ──────────────────────────────────────────────────────────
  const adminHash = bcrypt.hashSync('adminpassword', 10);
  const customerHash = bcrypt.hashSync('mypassword', 10);
  const insertUser = db.prepare(`INSERT INTO users (name,email,password_hash,role,avatar_initials) VALUES (?,?,?,?,?)`);
  insertUser.run('مدير متجر مدار', 'admin@madar.com', adminHash, 'admin', 'م');
  insertUser.run('عميل تجريبي', 'customer@test.com', customerHash, 'customer', 'ع');
  insertUser.finalize(() => console.log('✓ تم زرع المستخدمين'));

  // ─── Seed Site Content (CMS) ─────────────────────────────────────────────
  const contentRows = [
    // Announcement Bar
    ['الإعلانات', 'ann1', 'شحن مجاني للطلبات فوق 1500 جنيه', 'Free shipping on orders over 1500 EGP'],
    ['الإعلانات', 'ann2', 'مجموعات جديدة كل موسم', 'New collections every season'],
    ['الإعلانات', 'ann3', 'مصنوع في مصر بأعلى معايير الجودة', 'Made in Egypt to the highest quality standards'],
    // Hero Section
    ['الصفحة الرئيسية', 'heroEyebrow', 'مجموعة 2025', 'Collection 2025'],
    ['الصفحة الرئيسية', 'heroTitleLine1', 'اللبس الذي', 'Clothes That'],
    ['الصفحة الرئيسية', 'heroTitleLine2', 'يعبّر عنك', 'Express You'],
    ['الصفحة الرئيسية', 'heroSubtitle', 'ملابس مصممة للمطورين وعشاق التقنية والمبدعين — حيث الأناقة تلتقي بالهوية الرقمية', 'Designed for developers, tech enthusiasts and creators — where elegance meets digital identity'],
    ['الصفحة الرئيسية', 'shopNowBtn', 'تسوق الآن', 'Shop Now'],
    ['الصفحة الرئيسية', 'ourStoryBtn', 'قصتنا', 'Our Story'],
    // Featured Section
    ['الصفحة الرئيسية', 'featuredHeading', 'منتجات مختارة', 'Featured Products'],
    ['الصفحة الرئيسية', 'featuredSubheading', 'قطع يتم اختيارها بعناية لتناسب أسلوبك', 'Hand-picked pieces curated for your style'],
    // Collections Section
    ['الصفحة الرئيسية', 'collectionsHeading', 'المجموعات', 'Collections'],
    ['الصفحة الرئيسية', 'collectionsSubheading', 'استكشف مجموعاتنا المنتقاة بعناية', 'Explore our carefully curated collections'],
    // Narrative
    ['الصفحة الرئيسية', 'narrativeTitle', 'مدار — أكثر من مجرد لبس', 'Madar — More Than Just Clothes'],
    ['الصفحة الرئيسية', 'narrativeText', 'نؤمن أن ما ترتديه امتداد لهويتك. لهذا صممنا مدار ليكون الخيار الأول لمن يقدّرون الجمال البسيط والجودة الحقيقية.', 'We believe what you wear is an extension of your identity. Madar is designed for those who value simplicity and real quality.'],
    // Features
    ['الصفحة الرئيسية', 'feat1Title', 'خامات صديقة للبيئة', 'Eco-Friendly Materials'],
    ['الصفحة الرئيسية', 'feat1Desc', 'قطن عضوي ومواد مستدامة بالكامل', 'Organic cotton and fully sustainable materials'],
    ['الصفحة الرئيسية', 'feat2Title', 'جودة يدوية عالية', 'Premium Craft Quality'],
    ['الصفحة الرئيسية', 'feat2Desc', 'كل قطعة تُصنع بدقة واهتمام شديد', 'Every piece crafted with precision and care'],
    ['الصفحة الرئيسية', 'feat3Title', 'شحن سريع وآمن', 'Fast & Safe Shipping'],
    ['الصفحة الرئيسية', 'feat3Desc', 'توصيل خلال 2-5 أيام عمل لكل مصر', '2-5 business day delivery across Egypt'],
    // About Page
    ['صفحة من نحن', 'aboutTitle', 'عن مدار', 'About Madar'],
    ['صفحة من نحن', 'aboutSubtitle', 'نحكي قصة الملابس التي تتحدث بلغتك', 'The story of clothes that speak your language'],
    ['صفحة من نحن', 'story1', 'بدأت مدار بفكرة بسيطة: لماذا لا يوجد لبس يعبّر حقاً عن عشاق التقنية والإبداع؟', 'Madar started with a simple idea: why isn\'t there clothing that truly expresses tech enthusiasts and creators?'],
    ['صفحة من نحن', 'story2', 'انطلقنا من القاهرة بفريق صغير من المصممين والمطورين الذين يعيشون ثقافة التقنية.', 'We launched from Cairo with a small team of designers and developers who live tech culture.'],
    ['صفحة من نحن', 'story3', 'اليوم، مدار أصبحت علامة تجارية مصرية تصدّر ملابسها لعشاق التقنية في أكثر من دولة عربية.', 'Today, Madar is an Egyptian brand exporting to tech enthusiasts across the Arab world.'],
    ['صفحة من نحن', 'val1', 'الأصالة: نصنع ما نصدّق به حقاً', 'Authenticity: We make what we truly believe in'],
    ['صفحة من نحن', 'val2', 'الجودة: لا تنازل عن المعايير العالية', 'Quality: No compromise on high standards'],
    ['صفحة من نحن', 'val3', 'الاستدامة: مسؤولية تجاه بيئتنا', 'Sustainability: Responsibility toward our environment'],
    ['صفحة من نحن', 'val4', 'المجتمع: نبني مع عملائنا، لا لهم فقط', 'Community: We build with our customers, not just for them'],
    // Contact Page
    ['صفحة التواصل', 'contactTitle', 'تواصل معنا', 'Contact Us'],
    ['صفحة التواصل', 'contactDesc', 'نحن هنا دائماً للمساعدة', "We're always here to help"],
    ['صفحة التواصل', 'contactEmail', 'hello@madar.com', 'hello@madar.com'],
    ['صفحة التواصل', 'contactPhone', '01000000000', '01000000000'],
    ['صفحة التواصل', 'contactAddress', 'القاهرة، مصر', 'Cairo, Egypt'],
    // Footer
    ['الفوتر', 'footerBrand', 'ملابس للمطورين وعشاق التقنية — جودة حقيقية وتصميم يعبّر عنك.', 'Minimalist clothing for developers and tech enthusiasts — real quality.'],
    ['الفوتر', 'newsletterDesc', 'اشترك وكن أول من يعرف بالمجموعات والعروض الجديدة', 'Subscribe to be first to know about new collections and offers'],
    ['الفوتر', 'copyright', '© 2025 مدار. جميع الحقوق محفوظة.', '© 2025 Madar. All rights reserved.'],
    // Shop
    ['المتجر', 'shopHeading', 'المتجر', 'Shop'],
    ['المتجر', 'shopDesc', 'اكتشف مجموعتنا الكاملة', 'Explore our full collection'],
    // Logo
    ['عام', 'siteLogo', 'مدار', 'MADAR'],
    ['عام', 'siteTagline', 'الأناقة تلتقي بالهوية الرقمية', 'Where elegance meets digital identity'],
  ];

  const insertContent = db.prepare(`INSERT OR IGNORE INTO site_content (section, key_name, value_ar, value_en) VALUES (?,?,?,?)`);
  contentRows.forEach(row => insertContent.run(...row));
  insertContent.finalize(() => console.log(`✓ تم زرع ${contentRows.length} عنصر محتوى`));

  // Seed Announcements
  const insertAnn = db.prepare(`INSERT OR IGNORE INTO announcements (text_ar, text_en, active, order_num) VALUES (?,?,?,?)`);
  insertAnn.run('شحن مجاني للطلبات فوق 1500 جنيه', 'Free shipping on orders over 1500 EGP', 1, 1);
  insertAnn.run('مجموعات جديدة كل موسم', 'New collections every season', 1, 2);
  insertAnn.run('مصنوع في مصر بأعلى معايير الجودة', 'Made in Egypt with the highest quality standards', 1, 3);
  insertAnn.finalize(() => console.log('✓ تم زرع الإعلانات'));

  // Seed Contact Messages
  const insertMessage = db.prepare(`INSERT INTO contact_messages (name, email, subject, message) VALUES (?,?,?,?)`);
  insertMessage.run('أحمد علي', 'ahmed@gmail.com', 'استفسار عن المقاسات', 'هل يتوفر مقاس 3XL للتيشرتات قريباً؟');
  insertMessage.run('سارة محمود', 'sara@outlook.com', 'تأخير في التوصيل', 'مرحباً، طلبت منذ 5 أيام ولم يصلني الطلب بعد. رقم الطلب MADAR-12492');
  insertMessage.finalize(() => console.log('✓ تم زرع رسائل تواصل تجريبية'));
});

db.close(err => {
  if (err) console.error(err.message);
  else console.log('\n🚀 قاعدة البيانات جاهزة — node server.js\n');
});
