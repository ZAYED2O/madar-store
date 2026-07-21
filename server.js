const express = require('express');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const multer = require('multer');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const { createClient } = require('@libsql/client');

const JWT_SECRET = process.env.JWT_SECRET || 'madar_secret_key_123456';

const app = express();
const PORT = process.env.PORT || 8080;
const isVercel = !!process.env.VERCEL;

// ─── DATABASE: Turso (cloud) or local SQLite ─────────────────────────────────
let dbUrl = process.env.TURSO_DB_URL ||
  'file:' + path.join(__dirname, 'dxlr.db').replace(/\\/g, '/');
dbUrl = dbUrl.trim().replace(/^\uFEFF/, '').replace(/^['"]|['"]$/g, '');

let dbToken = process.env.TURSO_DB_TOKEN;
if (dbToken) {
  dbToken = dbToken.trim().replace(/^\uFEFF/, '').replace(/^['"]|['"]$/g, '');
}

const client = createClient({ url: dbUrl, authToken: dbToken });

// Compatibility wrapper - mimics sqlite3 callback API so no other code changes needed
const db = {
  all(sql, params, cb) {
    client.execute({ sql, args: params || [] })
      .then(r => cb(null, r.rows.map(row => Object.assign({}, row))))
      .catch(err => {
        console.error('DB.all Error:', err.message, 'SQL:', sql, 'Params:', params);
        cb(err);
      });
  },
  get(sql, params, cb) {
    client.execute({ sql, args: params || [] })
      .then(r => cb(null, r.rows[0] ? Object.assign({}, r.rows[0]) : undefined))
      .catch(err => {
        console.error('DB.get Error:', err.message, 'SQL:', sql, 'Params:', params);
        cb(err);
      });
  },
  run(sql, params, cb) {
    client.execute({ sql, args: params || [] })
      .then(r => {
        const ctx = { lastID: Number(r.lastInsertRowid || 0), changes: r.rowsAffected || 0 };
        if (typeof cb === 'function') cb.call(ctx, null);
      })
      .catch(err => {
        console.error('DB.run Error:', err.message, 'SQL:', sql, 'Params:', params);
        if (typeof cb === 'function') cb.call(null, err);
      });
  }
};

// Ensure new columns exist (errors silently ignored if column already exists)
['ALTER TABLE users ADD COLUMN avatar_url TEXT',
 'ALTER TABLE users ADD COLUMN points INTEGER DEFAULT 0',
 'ALTER TABLE orders ADD COLUMN customer_name TEXT',
 'ALTER TABLE orders ADD COLUMN customer_phone TEXT',
 'ALTER TABLE orders ADD COLUMN customer_address TEXT',
 'ALTER TABLE orders ADD COLUMN customer_city TEXT',
 'ALTER TABLE orders ADD COLUMN payment_method TEXT DEFAULT \'cod\'',
 'ALTER TABLE products ADD COLUMN additional_images TEXT DEFAULT \'[]\'',
 'ALTER TABLE contact_messages ADD COLUMN sender_type TEXT DEFAULT \'user\'',
 'ALTER TABLE contact_messages ADD COLUMN is_read INTEGER DEFAULT 0',
].forEach(sql => client.execute(sql).catch(() => {}));

// Ensure categories table exists
client.execute(`CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_en TEXT NOT NULL UNIQUE,
  name_ar TEXT NOT NULL UNIQUE,
  image_url TEXT NOT NULL DEFAULT 'assets/waffle_shirt_1.png'
)`).then(() => {
  db.get('SELECT COUNT(*) AS cnt FROM categories', [], (err, row) => {
    if (!err && row && row.cnt === 0) {
      const starterCategories = [
        { name_en: 'T-Shirts', name_ar: 'تيشرتات', image_url: 'assets/waffle_shirt_1.png' },
        { name_en: 'Sweatpants', name_ar: 'بناطيل رياضية', image_url: 'assets/grey_sweatpants_1.png' },
        { name_en: 'Outfits', name_ar: 'ملابس كاملة', image_url: 'assets/developer_hoodie_1.png' },
        { name_en: 'Ringer Tees', name_ar: 'تيشرتات رينجر', image_url: 'assets/ringer_tee_1.png' },
        { name_en: 'Tank Tops', name_ar: 'تيشرتات حمالات', image_url: 'assets/tank_top_1.png' },
        { name_en: 'Knitted Wear', name_ar: 'تريكو ومحبوكات', image_url: 'assets/knitted_sweater_1.png' },
        { name_en: 'Denim', name_ar: 'جينز ودنيم', image_url: 'assets/denim_jacket_1.png' },
        { name_en: 'Striped Shirts', name_ar: 'قمصان مخططة', image_url: 'assets/striped_shirt_1.png' }
      ];
      starterCategories.forEach(cat => {
        db.run('INSERT INTO categories (name_en, name_ar, image_url) VALUES (?,?,?)', [cat.name_en, cat.name_ar, cat.image_url]);
      });
    }
  });
}).catch((err) => {
  console.error('Error creating categories table:', err);
});

// Ensure notifications table exists
client.execute(`CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  type TEXT NOT NULL,
  title_ar TEXT NOT NULL,
  title_en TEXT NOT NULL,
  message_ar TEXT NOT NULL,
  message_en TEXT NOT NULL,
  target_id TEXT,
  is_read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).catch(() => {});

// Ensure shipping_settings table exists with Egyptian governorates
client.execute(`CREATE TABLE IF NOT EXISTS shipping_settings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  key_name TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL
)`).then(() => {
  // Insert default free shipping threshold if not exists
  client.execute(`INSERT OR IGNORE INTO shipping_settings (key_name, value) VALUES ('free_shipping_threshold', '1500')`).catch(() => {});
}).catch(() => {});

client.execute(`CREATE TABLE IF NOT EXISTS shipping_governorates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name_ar TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL UNIQUE,
  shipping_cost REAL NOT NULL DEFAULT 60
)`).then(() => {
  // Seed default Egyptian governorates if table is empty
  client.execute(`SELECT COUNT(*) as cnt FROM shipping_governorates`).then(r => {
    const cnt = r.rows[0]?.cnt;
    if (cnt === 0 || cnt === '0') {
      const governorates = [
        { ar: 'القاهرة', en: 'Cairo', cost: 50 },
        { ar: 'الجيزة', en: 'Giza', cost: 50 },
        { ar: 'الإسكندرية', en: 'Alexandria', cost: 60 },
        { ar: 'الدقهلية', en: 'Dakahlia', cost: 70 },
        { ar: 'البحر الأحمر', en: 'Red Sea', cost: 90 },
        { ar: 'البحيرة', en: 'Beheira', cost: 70 },
        { ar: 'الفيوم', en: 'Faiyum', cost: 70 },
        { ar: 'الغربية', en: 'Gharbia', cost: 70 },
        { ar: 'الإسماعيلية', en: 'Ismailia', cost: 70 },
        { ar: 'المنوفية', en: 'Menofia', cost: 70 },
        { ar: 'المنيا', en: 'Minya', cost: 75 },
        { ar: 'القليوبية', en: 'Qalyubia', cost: 55 },
        { ar: 'الوادي الجديد', en: 'New Valley', cost: 100 },
        { ar: 'الشرقية', en: 'Sharkia', cost: 70 },
        { ar: 'سوهاج', en: 'Sohag', cost: 80 },
        { ar: 'جنوب سيناء', en: 'South Sinai', cost: 95 },
        { ar: 'كفر الشيخ', en: 'Kafr El Sheikh', cost: 70 },
        { ar: 'مطروح', en: 'Matrouh', cost: 95 },
        { ar: 'الأقصر', en: 'Luxor', cost: 85 },
        { ar: 'قنا', en: 'Qena', cost: 85 },
        { ar: 'شمال سيناء', en: 'North Sinai', cost: 95 },
        { ar: 'بورسعيد', en: 'Port Said', cost: 75 },
        { ar: 'دمياط', en: 'Damietta', cost: 75 },
        { ar: 'أسوان', en: 'Aswan', cost: 90 },
        { ar: 'أسيوط', en: 'Asyut', cost: 80 },
        { ar: 'بني سويف', en: 'Beni Suef', cost: 70 },
        { ar: 'السويس', en: 'Suez', cost: 75 }
      ];
      governorates.forEach(g => {
        client.execute({
          sql: `INSERT OR IGNORE INTO shipping_governorates (name_ar, name_en, shipping_cost) VALUES (?,?,?)`,
          args: [g.ar, g.en, g.cost]
        }).catch(() => {});
      });
    }
  }).catch(() => {});
}).catch(() => {});

// Ensure reviews table exists
client.execute(`CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  product_id INTEGER NOT NULL,
  user_id INTEGER,
  user_name TEXT NOT NULL,
  rating REAL NOT NULL,
  comment TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).then(() => {
  db.get('SELECT COUNT(*) AS cnt FROM reviews', [], (err, row) => {
    if (!err && row && row.cnt === 0) {
      const starterReviews = [
        { product_id: 1, user_name: 'أحمد محمود', rating: 5.0, comment: 'خامة الوافل ممتازة ومريحة جداً في اللبس.' },
        { product_id: 1, user_name: 'Sarah K.', rating: 4.0, comment: 'Very nice structure and breathable. Recommend it.' },
        { product_id: 2, user_name: 'كريم خالد', rating: 5.0, comment: 'البنطلون تقيل ومناسب جداً للشتا والجيوب بسوستة عملية جداً.' },
        { product_id: 3, user_name: 'Mohamed A.', rating: 5.0, comment: 'Best oversized hoodie I have ever bought. Super soft inside.' },
        { product_id: 4, user_name: 'يوسف علي', rating: 4.0, comment: 'تيشرت رينجر جميل جداً وألوانه متناسقة.' },
        { product_id: 5, user_name: 'عمر فاروق', rating: 5.0, comment: 'خفيف ومريح للتمارين اليومية.' },
        { product_id: 6, user_name: 'Hassan', rating: 5.0, comment: 'التريكو خامته تقيلة وقيمته عالية جداً بالنسبة للسعر.' },
        { product_id: 7, user_name: 'مصطفى رجب', rating: 5.0, comment: 'جاكيت جينز تحفة ولونه غامق وشيك جداً.' },
        { product_id: 8, user_name: 'عماد سليمان', rating: 4.0, comment: 'قميص كتان مريح ومناسب للصيف.' }
      ];
      starterReviews.forEach(r => {
        db.run('INSERT INTO reviews (product_id, user_name, rating, comment) VALUES (?,?,?,?)', [r.product_id, r.user_name, r.rating, r.comment]);
      });
      // Sync product rating stats
      const productsToSync = [1, 2, 3, 4, 5, 6, 7, 8];
      productsToSync.forEach(pid => {
        db.all('SELECT rating FROM reviews WHERE product_id = ?', [pid], (err, rows) => {
          if (!err && rows.length > 0) {
            const count = rows.length;
            const avg = rows.reduce((sum, row) => sum + row.rating, 0) / count;
            db.run('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?', [avg.toFixed(1), count, pid]);
          }
        });
      });
    }
  });
}).catch((err) => {
  console.error('Error creating reviews table:', err);
});

// Ensure size guide keys exist in site_content table
client.execute(`CREATE TABLE IF NOT EXISTS site_content (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  section TEXT NOT NULL,
  key_name TEXT NOT NULL UNIQUE,
  value_ar TEXT,
  value_en TEXT,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`).then(() => {
  const defaultSizes = [
    { size: 'M', chest: '96–101', waist: '81–86', hip: '99–104' },
    { size: 'L', chest: '104–109', waist: '89–94', hip: '107–112' },
    { size: 'XL', chest: '112–117', waist: '97–102', hip: '115–120' },
    { size: '2XL', chest: '120–125', waist: '105–110', hip: '123–128' }
  ];
  const defaultSizesJson = JSON.stringify(defaultSizes);
  const defaultNoteAr = '💡 في حالة الشك، نوصي باختيار المقاس الأكبر للحصول على قصة أكثر راحة.';
  const defaultNoteEn = '💡 In case of doubt, we recommend choosing the larger size for a more comfortable fit.';

  db.run(`INSERT OR IGNORE INTO site_content (section, key_name, value_ar, value_en) VALUES (?, ?, ?, ?)`,
    ['دليل المقاسات', 'size_guide_json', defaultSizesJson, defaultSizesJson]);
  db.run(`INSERT OR IGNORE INTO site_content (section, key_name, value_ar, value_en) VALUES (?, ?, ?, ?)`,
    ['دليل المقاسات', 'size_guide_note', defaultNoteAr, defaultNoteEn]);
}).catch((err) => {
  console.error('Error ensuring site_content size_guide seeds:', err);
});

console.log('Connected to:', dbUrl.startsWith('file:') ? 'Local SQLite' : 'Turso Cloud DB');

app.use(cors());
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(express.static(__dirname));

// Multer storage configuration for product images
const storage = isVercel
  ? multer.memoryStorage()
  : multer.diskStorage({
      destination: function (req, file, cb) {
        const dir = path.join(__dirname, 'assets');
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
      },
      filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, 'product-' + uniqueSuffix + ext);
      }
    });
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('الملف ليس صورة صالحة!'), false);
  }
});

// ─── MIDDLEWARE: Auth token validation ───────────────────────────────────────
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

async function verifyToken(req, res, next) {
  const token = req.headers['x-auth-token'] || req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    console.log('JWT Verification: No token provided');
    return res.status(401).json({ error: 'مطلوب رمز المصادقة' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    console.error('JWT Verification Failed for token:', token.substring(0, 15) + '...', 'Error:', err.message);
    return res.status(401).json({ error: 'رمز مصادقة منتهي أو غير صالح' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(403).json({ error: 'صلاحيات المدير مطلوبة' });
  }
  db.get('SELECT role FROM users WHERE id = ?', [req.user.id], (err, row) => {
    if (err || !row || row.role !== 'admin') {
      return res.status(403).json({ error: 'صلاحيات المدير مطلوبة أو تم سحبها' });
    }
    next();
  });
}

// ─── FILE UPLOAD ─────────────────────────────────────────────────────────────
app.post('/api/upload', verifyToken, requireAdmin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'لم يتم تحميل أي ملف' });
  const filePath = req.file.buffer
    ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    : 'assets/' + req.file.filename;
  res.json({ success: true, filePath });
});

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const { q, category, lang } = req.query;
  let query = 'SELECT * FROM products WHERE 1=1';
  const params = [];

  if (q && q.trim()) {
    query += ' AND (LOWER(name_en) LIKE LOWER(?) OR LOWER(name_ar) LIKE ? OR LOWER(category_en) LIKE LOWER(?) OR LOWER(category_ar) LIKE ?)';
    const term = `%${q.trim()}%`;
    params.push(term, term, term, term);
  }

  if (category) {
    query += ' AND (category_en = ? OR category_ar = ?)';
    params.push(category, category);
  }

  db.all(query, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب المنتجات' });
    res.json(rows.map(formatProduct));
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err || !row) return res.status(404).json({ error: 'المنتج غير موجود' });
    res.json(formatProduct(row));
  });
});

app.get('/api/products/:id/reviews', (req, res) => {
  db.all('SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC', [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب التقييمات' });
    res.json(rows);
  });
});

app.post('/api/products/:id/reviews', verifyToken, (req, res) => {
  const { rating, comment } = req.body;
  const productId = req.params.id;
  const userName = req.user.name;
  const userId = req.user.id;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'الرجاء تحديد التقييم من 1 إلى 5 نجوم' });
  }
  if (!comment || !comment.trim()) {
    return res.status(400).json({ error: 'الرجاء كتابة تعليق' });
  }

  // Check if user already reviewed this product
  db.get('SELECT id FROM reviews WHERE product_id = ? AND user_id = ?', [productId, userId], (err, existing) => {
    if (err) return res.status(500).json({ error: 'خطأ في التحقق من التقييمات السابقة' });
    if (existing) {
      return res.status(400).json({ error: 'لقد قمت بتقييم هذا المنتج مسبقاً. يُسمح بتقييم واحد فقط لكل منتج.' });
    }

    db.run('INSERT INTO reviews (product_id, user_id, user_name, rating, comment) VALUES (?,?,?,?,?)',
      [productId, userId, userName, rating, comment.trim()], function(err) {
        if (err) return res.status(500).json({ error: 'خطأ في إضافة التقييم' });

        // Re-calculate average rating and reviews count for the product
        db.all('SELECT rating FROM reviews WHERE product_id = ?', [productId], (err, rows) => {
          if (!err && rows.length > 0) {
            const count = rows.length;
            const avg = rows.reduce((sum, r) => sum + r.rating, 0) / count;
            db.run('UPDATE products SET rating = ?, reviews_count = ? WHERE id = ?', [avg.toFixed(1), count, productId], (err2) => {
              if (err2) console.error('Failed to update product rating stats:', err2);
            });
          }
        });

        res.status(201).json({ success: true, message: 'تم إضافة التقييم بنجاح' });
      });
  });
});

function formatProduct(row) {
  let sizes = [];
  try { sizes = JSON.parse(row.sizes); } catch { sizes = row.sizes ? row.sizes.split(',') : []; }
  let additionalImages = [];
  try { additionalImages = JSON.parse(row.additional_images || '[]'); } catch { additionalImages = []; }
  const images = [row.image_primary];
  if (row.image_secondary) images.push(row.image_secondary);
  additionalImages.forEach(img => {
    if (img && !images.includes(img)) images.push(img);
  });
  return {
    id: row.id,
    nameEn: row.name_en, nameAr: row.name_ar,
    handle: row.handle,
    price: row.price, originalPrice: row.original_price,
    categoryEn: row.category_en, categoryAr: row.category_ar,
    badgeEn: row.badge_en, badgeAr: row.badge_ar,
    images: images,
    sizes, lowStock: !!row.low_stock,
    rating: row.rating, reviewsCount: row.reviews_count,
    descriptionEn: row.description_en, descriptionAr: row.description_ar
  };
}

// ─── AUTH: Register ───────────────────────────────────────────────────────────
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  if (password.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });

  db.get('SELECT id FROM users WHERE email = ?', [email], async (err, row) => {
    if (row) return res.status(409).json({ error: 'البريد الإلكتروني مسجل مسبقاً' });

    const hash = await bcrypt.hash(password, 10);
    const initials = name.charAt(0).toUpperCase();
    const role = email.endsWith('@madar.com') ? 'admin' : 'customer';

    db.run('INSERT INTO users (name,email,password_hash,role,avatar_initials) VALUES (?,?,?,?,?)',
      [name, email, hash, role, initials], function(err) {
        if (err) return res.status(500).json({ error: 'خطأ في إنشاء الحساب' });

        const token = jwt.sign(
          { id: this.lastID, name, email, role },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        res.status(201).json({ success: true, token, user: { id: this.lastID, name, email, role, avatarInitials: initials, avatarUrl: null, points: 0 } });
      });
  });
});

// ─── AUTH: Login ──────────────────────────────────────────────────────────────
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'البريد وكلمة المرور مطلوبان' });

  db.get('SELECT * FROM users WHERE LOWER(email) = LOWER(?)', [email.trim()], async (err, user) => {
    if (err) {
      console.error('Login DB error:', err.message);
      return res.status(500).json({ error: 'خطأ في الخادم' });
    }
    if (!user) {
      console.log('Login failed: user not found for email:', email);
      return res.status(401).json({ error: 'البريد الإلكتروني غير مسجل' });
    }

    try {
      const valid = await bcrypt.compare(password, user.password_hash);
      if (!valid) {
        console.log('Login failed: wrong password for:', email);
        return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
      }
    } catch (bcryptErr) {
      console.error('bcrypt compare error:', bcryptErr.message, 'hash:', user.password_hash?.substring(0, 20));
      return res.status(500).json({ error: 'خطأ في التحقق من كلمة المرور' });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true, token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role, avatarInitials: user.avatar_initials || user.name.charAt(0), avatarUrl: user.avatar_url || null, phone: user.phone, address: user.address, points: user.points || 0 }
    });
  });
});

// ─── ADMIN: Reset user password ───────────────────────────────────────────────
app.put('/api/admin/users/:id/reset-password', verifyToken, requireAdmin, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });
  }
  const hash = await bcrypt.hash(newPassword, 10);
  db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'خطأ في إعادة تعيين كلمة المرور' });
    if (this.changes === 0) return res.status(404).json({ error: 'المستخدم غير موجود' });
    res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور بنجاح' });
  });
});



// ─── AUTH: Logout ─────────────────────────────────────────────────────────────
app.post('/api/logout', verifyToken, (req, res) => {
  res.json({ success: true, message: 'تم تسجيل الخروج' });
});

// ─── USER: Get Profile ────────────────────────────────────────────────────────
app.get('/api/profile', verifyToken, (req, res) => {
  db.get('SELECT id,name,email,role,avatar_initials,avatar_url,phone,address,points,created_at FROM users WHERE id = ?',
    [req.user.id], (err, user) => {
      if (err || !user) return res.status(404).json({ error: 'المستخدم غير موجود' });
      res.json(user);
    });
});

// ─── USER: Update Profile ─────────────────────────────────────────────────────
app.put('/api/profile', verifyToken, (req, res) => {
  const { name, phone, address, avatarUrl } = req.body;
  if (!name) return res.status(400).json({ error: 'الاسم مطلوب' });

  const initials = name.charAt(0).toUpperCase();
  db.run('UPDATE users SET name=?, phone=?, address=?, avatar_initials=?, avatar_url=? WHERE id=?',
    [name, phone || null, address || null, initials, avatarUrl || null, req.user.id], err => {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث البيانات' });
      res.json({ success: true, name, avatarInitials: initials, avatarUrl: avatarUrl || null });
    });
});

// ─── USER: Upload Avatar ──────────────────────────────────────────────────────
app.post('/api/profile/upload-avatar', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'لم يتم تحميل أي ملف' });
  const filePath = req.file.buffer
    ? `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`
    : 'assets/' + req.file.filename;
  res.json({ success: true, filePath });
});

// ─── USER: Get My Support Messages (Chat) ──────────────────────────────────────
app.get('/api/profile/messages', verifyToken, (req, res) => {
  db.all('SELECT * FROM contact_messages WHERE email = ? ORDER BY id ASC', [req.user.email], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الرسائل' });
    res.json(rows);
  });
});

app.get('/api/profile/messages/unread-count', verifyToken, (req, res) => {
  db.get("SELECT COUNT(*) as count FROM contact_messages WHERE email = ? AND sender_type = 'admin' AND is_read = 0",
    [req.user.email], (err, row) => {
      if (err) return res.status(500).json({ error: 'خطأ في حساب الرسائل غير المقروءة' });
      res.json({ count: row ? row.count : 0 });
    });
});

app.put('/api/profile/messages/read', verifyToken, (req, res) => {
  db.run("UPDATE contact_messages SET is_read = 1 WHERE email = ? AND sender_type = 'admin'",
    [req.user.email], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث حالة الرسائل' });
      res.json({ success: true });
    });
});

// ─── USER: Change Password ────────────────────────────────────────────────────
app.put('/api/profile/password', verifyToken, async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) return res.status(400).json({ error: 'جميع الحقول مطلوبة' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' });

  db.get('SELECT password_hash FROM users WHERE id = ?', [req.user.id], async (err, user) => {
    if (err || !user) return res.status(404).json({ error: 'المستخدم غير موجود' });

    const valid = await bcrypt.compare(currentPassword, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'كلمة المرور الحالية غير صحيحة' });

    const newHash = await bcrypt.hash(newPassword, 10);
    db.run('UPDATE users SET password_hash = ? WHERE id = ?', [newHash, req.user.id], err => {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث كلمة المرور' });
      const token = req.headers['x-auth-token'] || req.headers['authorization']?.replace('Bearer ', '');
      db.run('DELETE FROM sessions WHERE user_id = ? AND token != ?', [req.user.id, token]);
      res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' });
    });
  });
});

// ─── USER: Get My Orders ──────────────────────────────────────────────────────
app.get('/api/profile/orders', verifyToken, (req, res) => {
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الطلبات' });
    res.json(rows.map(r => { try { r.items = JSON.parse(r.items); } catch {} return r; }));
  });
});

// ─── USER: Request Order Return ────────────────────────────────────────────────
app.post('/api/profile/orders/:id/return', verifyToken, (req, res) => {
  db.get('SELECT * FROM orders WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], (err, order) => {
    if (err || !order) return res.status(404).json({ error: 'الطلب غير موجود' });
    if (order.status !== 'تم الشحن' && order.status !== 'Shipped') {
      return res.status(400).json({ error: 'لا يمكن تقديم طلب استرجاع إلا للطلبات المشحونة فقط' });
    }
    db.run('UPDATE orders SET status = ? WHERE id = ?', ['طلب استرجاع', req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في تقديم طلب الاسترجاع' });

      // Insert admin notification
      const customerName = order.customer_name || req.user.name;
      const titleAr = 'طلب استرجاع جديد';
      const titleEn = 'New Return Request';
      const msgAr = `قام العميل ${customerName} بطلب استرجاع للطلب رقم ${order.order_id}`;
      const msgEn = `Customer ${customerName} requested a return for order #${order.order_id}`;
      
      db.run('INSERT INTO notifications (type, title_ar, title_en, message_ar, message_en, target_id) VALUES (?,?,?,?,?,?)',
        ['return_request', titleAr, titleEn, msgAr, msgEn, order.order_id], function(err) {
          if (err) console.error('Failed to create notification:', err.message);
        });

      res.json({ success: true, status: 'طلب استرجاع' });
    });
  });
});

async function optionalVerifyToken(req, res, next) {
  const token = req.headers['x-auth-token'] || req.headers['authorization']?.replace('Bearer ', '');
  if (!token) {
    req.user = null;
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = { id: decoded.id, name: decoded.name, email: decoded.email, role: decoded.role };
    next();
  } catch (err) {
    req.user = null;
    next();
  }
}

// ─── CONTACT MESSAGES ──────────────────────────────────────────────────────────
app.get('/api/contact', (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ error: 'البريد الإلكتروني مطلوب' });
  
  db.all('SELECT * FROM contact_messages WHERE email = ? ORDER BY id ASC', [email.trim()], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الرسائل' });
    res.json(rows);
  });
});

app.post('/api/contact', optionalVerifyToken, (req, res) => {
  let { name, email, message } = req.body;

  if (req.user) {
    name = req.user.name;
    email = req.user.email;
  }

  if (!name || !email || !message || !message.trim()) {
    return res.status(400).json({ error: 'الاسم والبريد والرسالة حقول مطلوبة' });
  }

  db.run('INSERT INTO contact_messages (name, email, message, sender_type, is_read) VALUES (?,?,?,?,0)',
    [name.trim(), email.trim(), message.trim(), 'user'], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في حفظ رسالتك' });

      // Create admin notification
      const msgAr = `رسالة دردشة جديدة من ${name}`;
      const msgEn = `New chat message from ${name}`;
      db.run('INSERT INTO notifications (type, title_ar, title_en, message_ar, message_en, target_id) VALUES (?,?,?,?,?,?)',
        ['chat_message', 'رسالة دردشة جديدة', 'New Chat Message', msgAr, msgEn, email.trim()], function(e) {
          if (e) console.error('Failed to create chat notification:', e.message);
        });

      res.status(201).json({ success: true, messageId: this.lastID });
    });
});

// ─── ORDERS: Create ───────────────────────────────────────────────────────────
app.post('/api/orders', verifyToken, (req, res) => {
  const { items, note, subtotal, shipping, total, customerName, customerPhone, customerAddress, customerCity, paymentMethod } = req.body;
  
  if (!items || !total) return res.status(400).json({ error: 'بيانات الطلب ناقصة' });
  if (!customerName || !customerPhone || !customerAddress || !customerCity) {
    return res.status(400).json({ error: 'الرجاء ملء جميع معلومات الشحن والاتصال' });
  }

  const orderId = `MADAR-${Math.floor(10000 + Math.random() * 90000)}`;
  const itemsStr = typeof items === 'string' ? items : JSON.stringify(items);
  const userId = req.user.id;

  const saveOrder = (pm = 'cod') => {
    db.run(
      'INSERT INTO orders (order_id,user_id,items,note,subtotal,shipping,total,customer_name,customer_phone,customer_address,customer_city,payment_method) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)',
      [orderId, userId, itemsStr, note, subtotal, shipping, total, customerName, customerPhone, customerAddress, customerCity, pm],
      function(err) {
        if (err) {
          console.error('Error saving order:', err.message);
          return res.status(500).json({ error: 'خطأ في حفظ الطلب' });
        }
        
        // Auto-update user's profile with phone and address if not already set
        if (userId) {
          db.run(
            'UPDATE users SET phone = COALESCE(phone, ?), address = COALESCE(address, ?) WHERE id = ? AND (phone IS NULL OR address IS NULL)',
            [customerPhone, customerCity + ' - ' + customerAddress, userId]
          );
        }

        res.status(201).json({ success: true, orderId, dbRowId: this.lastID, total });
      }
    );
  };

  if (userId && paymentMethod === 'points') {
    db.get('SELECT points FROM users WHERE id = ?', [userId], (err, user) => {
      if (err || !user) {
        return res.status(500).json({ error: 'خطأ في التحقق من الحساب' });
      }
      const userPoints = user.points || 0;
      if (userPoints < total) {
        return res.status(400).json({ error: 'رصيد نقاطك غير كافٍ لإتمام هذا الطلب بالنقاط' });
      }
      db.run('UPDATE users SET points = points - ? WHERE id = ?', [total, userId], function(err) {
        if (err) {
          return res.status(500).json({ error: 'خطأ في خصم النقاط' });
        }
        saveOrder('points');
      });
    });
  } else {
    saveOrder('cod');
  }
});
// ─── ADMIN: Get All Users ─────────────────────────────────────────────────────
app.get('/api/admin/users', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT id,name,email,role,avatar_initials,phone,created_at FROM users ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب المستخدمين' });
    res.json(rows);
  });
});

// ─── ADMIN: Set User Role ─────────────────────────────────────────────────────
app.put('/api/admin/users/:id/role', verifyToken, requireAdmin, (req, res) => {
  const { role } = req.body;
  if (!['admin', 'customer'].includes(role)) return res.status(400).json({ error: 'الدور غير صالح' });
  if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: 'لا يمكنك تغيير دورك الخاص' });

  db.run('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id], function(err) {
    if (err || this.changes === 0) return res.status(500).json({ error: 'خطأ في تحديث الدور' });
    res.json({ success: true, message: `تم تعيين الدور إلى ${role}` });
  });
});

// ─── ADMIN: Reset User Password ───────────────────────────────────────────────
app.put('/api/admin/users/:id/password', verifyToken, requireAdmin, async (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' });

  const hash = await bcrypt.hash(newPassword, 10);
  db.run('UPDATE users SET password_hash = ? WHERE id = ?', [hash, req.params.id], function(err) {
    if (err || this.changes === 0) return res.status(500).json({ error: 'خطأ في إعادة تعيين كلمة المرور' });
    db.run('DELETE FROM sessions WHERE user_id = ?', [req.params.id]);
    res.json({ success: true, message: 'تم إعادة تعيين كلمة المرور وإلغاء جميع جلسات المستخدم' });
  });
});

// ─── ADMIN: Get All Orders ────────────────────────────────────────────────────
app.get('/api/admin/orders', verifyToken, requireAdmin, (req, res) => {
  db.all(`SELECT o.*, u.name as user_name, u.email as user_email 
          FROM orders o LEFT JOIN users u ON o.user_id = u.id 
          ORDER BY o.id DESC`, [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الطلبات' });
    res.json(rows.map(r => { try { r.items = JSON.parse(r.items); } catch {} return r; }));
  });
});

// ─── ADMIN: Update Order Status ───────────────────────────────────────────────
app.put('/api/admin/orders/:id', verifyToken, requireAdmin, (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'الحالة مطلوبة' });

  if (status === 'تم الاسترجاع') {
    db.get('SELECT user_id, total, status FROM orders WHERE id = ?', [req.params.id], (err, order) => {
      if (err || !order) return res.status(404).json({ error: 'الطلب غير موجود' });
      if (order.status === 'تم الاسترجاع') {
        return res.status(400).json({ error: 'هذا الطلب تم استرجاعه بالفعل' });
      }

      const pointsToEarn = Math.floor(order.total);
      db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
        if (err) return res.status(500).json({ error: 'خطأ في تحديث الحالة' });

        if (order.user_id) {
          db.run('UPDATE users SET points = COALESCE(points, 0) + ? WHERE id = ?', [pointsToEarn, order.user_id], function(err) {
            if (err) console.error('Failed to credit points:', err.message);
            res.json({ success: true, pointsCredited: pointsToEarn });
          });
        } else {
          res.json({ success: true, message: 'تم التحديث بنجاح (طلب زائر بدون حساب)' });
        }
      });
    });
  } else {
    db.run('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث الحالة' });
      res.json({ success: true });
    });
  }
});

// ─── ADMIN: Products CRUD ─────────────────────────────────────────────────────
app.post('/api/admin/products', verifyToken, requireAdmin, (req, res) => {
  const { nameEn, nameAr, handle, price, originalPrice, categoryEn, categoryAr, badgeEn, badgeAr, imagePrimary, imageSecondary, additionalImages, sizes, lowStock, descriptionEn, descriptionAr } = req.body;
  if (!nameEn || !nameAr || !price || !imagePrimary) return res.status(400).json({ error: 'الاسم والسعر والصورة مطلوبة' });

  const finalHandle = handle || nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'product';
  const sizesStr = Array.isArray(sizes) ? JSON.stringify(sizes) : sizes;
  const additionalImagesStr = Array.isArray(additionalImages) ? JSON.stringify(additionalImages) : JSON.stringify([]);

  db.run(`INSERT INTO products (name_en,name_ar,handle,price,original_price,category_en,category_ar,badge_en,badge_ar,image_primary,image_secondary,sizes,low_stock,rating,reviews_count,description_en,description_ar,additional_images) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,5.0,0,?,?,?)`,
    [nameEn, nameAr, finalHandle, price, originalPrice||price, categoryEn||'T-Shirts', categoryAr||'تيشرتات', badgeEn||null, badgeAr||null, imagePrimary, imageSecondary||imagePrimary, sizesStr||'["M","L","XL"]', lowStock?1:0, descriptionEn||'', descriptionAr||'', additionalImagesStr],
    function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في إضافة المنتج' });
      res.status(201).json({ success: true, productId: this.lastID });
    });
});

app.put('/api/admin/products/:id', verifyToken, requireAdmin, (req, res) => {
  const { nameEn, nameAr, handle, price, originalPrice, categoryEn, categoryAr, badgeEn, badgeAr, imagePrimary, imageSecondary, additionalImages, sizes, lowStock, descriptionEn, descriptionAr } = req.body;
  const finalHandle = handle || (nameEn ? nameEn.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : 'product');
  const sizesStr = Array.isArray(sizes) ? JSON.stringify(sizes) : sizes;
  const additionalImagesStr = Array.isArray(additionalImages) ? JSON.stringify(additionalImages) : JSON.stringify([]);

  db.run(`UPDATE products SET name_en=?,name_ar=?,handle=?,price=?,original_price=?,category_en=?,category_ar=?,badge_en=?,badge_ar=?,image_primary=?,image_secondary=?,sizes=?,low_stock=?,description_en=?,description_ar=?,additional_images=? WHERE id=?`,
    [nameEn, nameAr, finalHandle, price, originalPrice, categoryEn, categoryAr, badgeEn, badgeAr, imagePrimary, imageSecondary, sizesStr, lowStock?1:0, descriptionEn, descriptionAr, additionalImagesStr, req.params.id],
    err => {
      if (err) {
        console.error('Error updating product:', err);
        return res.status(500).json({ error: 'خطأ في تحديث المنتج' });
      }
      res.json({ success: true });
    });
});

app.delete('/api/admin/products/:id', verifyToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], err => {
    if (err) return res.status(500).json({ error: 'خطأ في حذف المنتج' });
    res.json({ success: true });
  });
});

// ─── CATEGORIES API ───────────────────────────────────────────────────────────
app.get('/api/categories', (req, res) => {
  db.all('SELECT * FROM categories ORDER BY id ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الأقسام' });
    res.json(rows);
  });
});

app.post('/api/admin/categories', verifyToken, requireAdmin, (req, res) => {
  const { nameEn, nameAr, imageUrl } = req.body;
  if (!nameEn || !nameAr) return res.status(400).json({ error: 'الاسم باللغتين مطلوب' });
  db.run('INSERT INTO categories (name_en, name_ar, image_url) VALUES (?,?,?)',
    [nameEn.trim(), nameAr.trim(), imageUrl || 'assets/waffle_shirt_1.png'], function(err) {
      if (err) return res.status(500).json({ error: 'القسم موجود بالفعل أو حدث خطأ' });
      res.status(201).json({ success: true, id: this.lastID });
    });
});

app.put('/api/admin/categories/:id', verifyToken, requireAdmin, (req, res) => {
  const { nameEn, nameAr, imageUrl } = req.body;
  const catId = req.params.id;
  if (!nameEn || !nameAr) return res.status(400).json({ error: 'الاسم باللغتين مطلوب' });

  db.get('SELECT * FROM categories WHERE id = ?', [catId], (err, oldCat) => {
    if (err || !oldCat) return res.status(404).json({ error: 'القسم غير موجود' });

    db.run('UPDATE categories SET name_en = ?, name_ar = ?, image_url = ? WHERE id = ?',
      [nameEn.trim(), nameAr.trim(), imageUrl || oldCat.image_url, catId], function(err) {
        if (err) return res.status(500).json({ error: 'فشل تحديث القسم' });

        // Update products using the old category names
        db.run('UPDATE products SET category_en = ? WHERE category_en = ?', [nameEn.trim(), oldCat.name_en]);
        db.run('UPDATE products SET category_ar = ? WHERE category_ar = ?', [nameAr.trim(), oldCat.name_ar]);

        res.json({ success: true });
      });
  });
});

app.delete('/api/admin/categories/:id', verifyToken, requireAdmin, (req, res) => {
  const catId = req.params.id;
  db.get('SELECT * FROM categories WHERE id = ?', [catId], (err, cat) => {
    if (err || !cat) return res.status(404).json({ error: 'القسم غير موجود' });

    db.run('DELETE FROM categories WHERE id = ?', [catId], function(err) {
      if (err) return res.status(500).json({ error: 'فشل حذف القسم' });
      res.json({ success: true });
    });
  });
});

// ─── ADMIN: Contact Messages & Chat Inbox ───────────────────────────────────────
// Compatibility endpoint
app.get('/api/admin/messages', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM contact_messages ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب رسائل التواصل' });
    res.json(rows);
  });
});

// Admin: Get all active threads
app.get('/api/admin/messages/threads', verifyToken, requireAdmin, (req, res) => {
  const sql = `
    SELECT 
      m.email,
      m.name,
      m.message as last_message,
      m.created_at,
      (SELECT COUNT(*) FROM contact_messages WHERE email = m.email AND sender_type = 'user' AND is_read = 0) as unread_count
    FROM contact_messages m
    INNER JOIN (
      SELECT email, MAX(id) as max_id
      FROM contact_messages
      GROUP BY email
    ) latest ON m.id = latest.max_id
    ORDER BY m.created_at DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching admin chat threads:', err);
      return res.status(500).json({ error: 'خطأ في جلب المحادثات' });
    }
    res.json(rows);
  });
});

// Admin: Get all messages in a specific thread
app.get('/api/admin/messages/thread/:email', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM contact_messages WHERE email = ? ORDER BY id ASC', [req.params.email], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب رسائل المحادثة' });
    res.json(rows);
  });
});

// Admin: Send message to a thread
app.post('/api/admin/messages/thread/:email/send', verifyToken, requireAdmin, (req, res) => {
  const { message } = req.body;
  const email = req.params.email;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: 'محتوى الرسالة لا يمكن أن يكون فارغاً' });
  }

  db.get('SELECT name FROM contact_messages WHERE email = ? LIMIT 1', [email], (err, row) => {
    const name = row ? row.name : 'Customer';

    db.run('INSERT INTO contact_messages (name, email, message, sender_type, is_read) VALUES (?,?,?,?,0)',
      [name, email, message.trim(), 'admin'], function(err) {
        if (err) return res.status(500).json({ error: 'خطأ في إرسال الرسالة' });
        res.status(201).json({ success: true, messageId: this.lastID });
      });
  });
});

// Admin: Mark customer messages as read in a thread
app.put('/api/admin/messages/thread/:email/read', verifyToken, requireAdmin, (req, res) => {
  db.run("UPDATE contact_messages SET is_read = 1 WHERE email = ? AND sender_type = 'user'",
    [req.params.email], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث حالة الرسائل' });
      res.json({ success: true });
    });
});

// Legacy Admin reply compat
app.post('/api/admin/messages/:id/reply', verifyToken, requireAdmin, (req, res) => {
  const { replyText } = req.body;
  if (!replyText || !replyText.trim()) return res.status(400).json({ error: 'محتوى الرد لا يمكن أن يكون فارغاً' });

  db.get('SELECT * FROM contact_messages WHERE id = ?', [req.params.id], (err, msg) => {
    if (err || !msg) return res.status(404).json({ error: 'الرسالة غير موجودة' });

    db.run('UPDATE contact_messages SET reply_text = ?, status = ? WHERE id = ?',
      [replyText.trim(), 'تم الرد', req.params.id], function(err2) {
        if (err2) return res.status(500).json({ error: 'خطأ في تحديث الرسالة' });

        // Also insert a message in the chat thread as an admin message for visual continuity
        db.run('INSERT INTO contact_messages (name, email, message, sender_type, is_read) VALUES (?,?,?,?,0)',
          ['Admin', msg.email, replyText.trim(), 'admin'], function(err3) {
            res.json({ success: true, message: 'تم إرسال الرد وتحديث حالة الرسالة بنجاح' });
          });
      });
  });
});

// ─── STATS ────────────────────────────────────────────────────────────────────
app.get('/api/admin/stats', verifyToken, requireAdmin, (req, res) => {
  const stats = {};
  db.get("SELECT COALESCE(SUM(total),0) as revenue, COUNT(*) as total_orders FROM orders WHERE status NOT IN ('ملغي', 'Cancelled', 'تم الاسترجاع', 'Returned')", [], (err, row) => {
    stats.revenue = row?.revenue || 0;
    stats.totalOrders = row?.total_orders || 0;
    db.get('SELECT COUNT(*) as c FROM products', [], (e2, r2) => {
      stats.totalProducts = r2?.c || 0;
      db.get("SELECT COUNT(*) as c FROM users WHERE role='customer'", [], (e3, r3) => {
        stats.totalCustomers = r3?.c || 0;
        res.json(stats);
      });
    });
  });
});

// ─── CMS SITE CONTENT ──────────────────────────────────────────────────────────
app.get('/api/content', (req, res) => {
  db.all('SELECT key_name, value_ar, value_en FROM site_content', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب محتوى الموقع' });
    const content = { ar: {}, en: {} };
    rows.forEach(r => {
      content.ar[r.key_name] = r.value_ar;
      content.en[r.key_name] = r.value_en;
    });
    res.json(content);
  });
});

app.get('/api/admin/content', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM site_content ORDER BY section, id', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب بيانات CMS' });
    res.json(rows);
  });
});

app.put('/api/admin/content/:key', verifyToken, requireAdmin, (req, res) => {
  const { valueAr, valueEn } = req.body;
  db.run('UPDATE site_content SET value_ar = ?, value_en = ?, updated_at = CURRENT_TIMESTAMP WHERE key_name = ?',
    [valueAr, valueEn, req.params.key], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث محتوى الموقع' });
      res.json({ success: true });
    });
});

// ─── ANNOUNCEMENTS ──────────────────────────────────────────────────────────
// Public: get active announcements ordered
app.get('/api/announcements', (req, res) => {
  db.all('SELECT * FROM announcements WHERE active = 1 ORDER BY order_num ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الإعلانات' });
    res.json(rows);
  });
});

// Admin: get all announcements
app.get('/api/admin/announcements', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM announcements ORDER BY order_num ASC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الإعلانات' });
    res.json(rows);
  });
});

// Admin: create announcement
app.post('/api/admin/announcements', verifyToken, requireAdmin, (req, res) => {
  const { text_ar, text_en, active, order_num } = req.body;
  if (!text_ar || !text_en) return res.status(400).json({ error: 'النص العربي والإنجليزي مطلوبان' });
  db.run('INSERT INTO announcements (text_ar, text_en, active, order_num) VALUES (?,?,?,?)',
    [text_ar, text_en, active ?? 1, order_num ?? 0], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في إضافة الإعلان' });
      res.json({ id: this.lastID, text_ar, text_en, active: active ?? 1, order_num: order_num ?? 0 });
    });
});

// Admin: update announcement
app.put('/api/admin/announcements/:id', verifyToken, requireAdmin, (req, res) => {
  const { text_ar, text_en, active, order_num } = req.body;
  db.run('UPDATE announcements SET text_ar=?, text_en=?, active=?, order_num=? WHERE id=?',
    [text_ar, text_en, active, order_num, req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في تحديث الإعلان' });
      if (this.changes === 0) return res.status(404).json({ error: 'الإعلان غير موجود' });
      res.json({ success: true });
    });
});

// Admin: delete announcement
app.delete('/api/admin/announcements/:id', verifyToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM announcements WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'خطأ في حذف الإعلان' });
    res.json({ success: true });
  });
});

// ─── ADMIN: Notifications ─────────────────────────────────────────────────────
app.get('/api/admin/notifications', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM notifications ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب الإشعارات' });
    res.json(rows);
  });
});

app.get('/api/admin/notifications/unread-count', verifyToken, requireAdmin, (req, res) => {
  db.get('SELECT COUNT(*) as cnt FROM notifications WHERE is_read = 0', [], (err, row) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب عدد الإشعارات' });
    res.json({ count: row ? row.cnt : 0 });
  });
});

app.put('/api/admin/notifications/:id/read', verifyToken, requireAdmin, (req, res) => {
  db.run('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'خطأ في تحديث حالة الإشعار' });
    res.json({ success: true });
  });
});

app.put('/api/admin/notifications/read-all', verifyToken, requireAdmin, (req, res) => {
  db.run('UPDATE notifications SET is_read = 1', [], function(err) {
    if (err) return res.status(500).json({ error: 'خطأ في تحديث الإشعارات' });
    res.json({ success: true });
  });
});

// ─── SHIPPING: Public get all governorates + config ──────────────────────────
app.get('/api/shipping', (req, res) => {
  db.all('SELECT * FROM shipping_governorates ORDER BY name_ar ASC', [], (err, govs) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب بيانات الشحن' });
    db.get("SELECT value FROM shipping_settings WHERE key_name = 'free_shipping_threshold'", [], (err2, row) => {
      res.json({
        governorates: govs,
        freeShippingThreshold: row ? parseFloat(row.value) : 1500
      });
    });
  });
});

// ─── ADMIN: Shipping Management ──────────────────────────────────────────────
// Get all governorates + config
app.get('/api/admin/shipping', verifyToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM shipping_governorates ORDER BY name_ar ASC', [], (err, govs) => {
    if (err) return res.status(500).json({ error: 'خطأ في جلب المحافظات' });
    db.get("SELECT value FROM shipping_settings WHERE key_name = 'free_shipping_threshold'", [], (err2, row) => {
      res.json({
        governorates: govs,
        freeShippingThreshold: row ? parseFloat(row.value) : 1500
      });
    });
  });
});

// Update governorate shipping cost
app.put('/api/admin/shipping/governorate/:id', verifyToken, requireAdmin, (req, res) => {
  const { shipping_cost } = req.body;
  if (shipping_cost === undefined || isNaN(parseFloat(shipping_cost))) {
    return res.status(400).json({ error: 'سعر الشحن غير صالح' });
  }
  db.run('UPDATE shipping_governorates SET shipping_cost = ? WHERE id = ?',
    [parseFloat(shipping_cost), req.params.id], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في التحديث' });
      if (this.changes === 0) return res.status(404).json({ error: 'المحافظة غير موجودة' });
      res.json({ success: true });
    });
});

// Add new governorate
app.post('/api/admin/shipping/governorate', verifyToken, requireAdmin, (req, res) => {
  const { name_ar, name_en, shipping_cost } = req.body;
  if (!name_ar || !name_en) return res.status(400).json({ error: 'الاسم مطلوب بالعربي والإنجليزي' });
  db.run('INSERT INTO shipping_governorates (name_ar, name_en, shipping_cost) VALUES (?,?,?)',
    [name_ar.trim(), name_en.trim(), parseFloat(shipping_cost) || 60], function(err) {
      if (err) return res.status(500).json({ error: 'المحافظة موجودة بالفعل أو حدث خطأ' });
      res.status(201).json({ success: true, id: this.lastID });
    });
});

// Delete governorate
app.delete('/api/admin/shipping/governorate/:id', verifyToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM shipping_governorates WHERE id = ?', [req.params.id], function(err) {
    if (err) return res.status(500).json({ error: 'خطأ في الحذف' });
    res.json({ success: true });
  });
});

// Update free shipping threshold
app.put('/api/admin/shipping/config', verifyToken, requireAdmin, (req, res) => {
  const { freeShippingThreshold } = req.body;
  if (freeShippingThreshold === undefined || isNaN(parseFloat(freeShippingThreshold))) {
    return res.status(400).json({ error: 'قيمة الشحن المجاني غير صالحة' });
  }
  db.run("INSERT OR REPLACE INTO shipping_settings (key_name, value) VALUES ('free_shipping_threshold', ?)",
    [String(parseFloat(freeShippingThreshold))], function(err) {
      if (err) return res.status(500).json({ error: 'خطأ في الحفظ' });
      res.json({ success: true });
    });
});

// Fallback to SPA
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'خطأ داخلي في الخادم' });
});

// Vercel uses module.exports; local dev uses app.listen
if (!process.env.VERCEL) {
  app.listen(PORT, () => console.log(`🚀 متجر مدار يعمل على http://localhost:${PORT}`));
}

module.exports = app;
