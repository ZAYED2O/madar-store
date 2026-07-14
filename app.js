/* ==========================================================================
   MADAR STORE — app.js v2.0
   Features: Real Auth (JWT tokens), Profile Page, Bilingual Admin Panel,
   Bilingual Search (AR+EN), Change Password, Role Assignment
   ========================================================================== */

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const translations = {
  ar: {
    navHome: 'الرئيسية', navShop: 'المتجر', navAbout: 'عن مدار', navContact: 'تواصل',
    heroEyebrow: 'مجموعة 2025',
    heroTitleLine1: 'اللبس الذي', heroTitleLine2: 'يعبّر عنك',
    heroSubtitle: 'ملابس مصممة للمطورين وعشاق التقنية والمبدعين',
    shopNow: 'تسوق الآن', ourStory: 'قصتنا', viewAll: 'عرض الكل',
    featuredProducts: 'منتجات مختارة', featuredDesc: 'قطع يتم اختيارها بعناية لتناسب أسلوبك',
    collections: 'المجموعات', collectionsDesc: 'استكشف مجموعاتنا المنتقاة',
    colTShirts: 'تيشرتات', colOutfits: 'هوديات وسويتشيرت', colDenim: 'جينز وجاكيت دنيم',
    shopCollection: 'تسوق المجموعة',
    narrativeTitle: 'مدار — أكثر من مجرد لبس',
    narrativeText: 'نؤمن أن ما ترتديه امتداد لهويتك.',
    feat1Title: 'خامات صديقة للبيئة', feat1Desc: 'قطن عضوي ومواد مستدامة',
    feat2Title: 'جودة يدوية عالية', feat2Desc: 'كل قطعة تُصنع بدقة واهتمام',
    feat3Title: 'شحن سريع وآمن', feat3Desc: 'توصيل خلال 2-5 أيام لكل مصر',
    shopDesc: 'اكتشف مجموعتنا الكاملة',
    filter: 'تصفية وترتيب', sortBy: 'ترتيب حسب',
    sortDefault: 'الترتيب الافتراضي', sortPriceAsc: 'السعر: من الأقل',
    sortPriceDesc: 'السعر: من الأعلى', sortRating: 'الأعلى تقييماً', sortName: 'الاسم أ-ي',
    filterCategory: 'الفئة', filterSize: 'المقاس', filterPrice: 'السعر',
    clearFilters: 'مسح الكل', applyFilters: 'تطبيق', filterTitle: 'تصفية وترتيب',
    cartTitle: 'السلة', cartEmpty: 'سلتك فارغة',
    orderNote: 'إضافة ملاحظة للطلب', subtotal: 'الإجمالي الجزئي',
    taxInfo: 'الشحن يُحسب عند الدفع', checkout: 'إتمام الشراء', viewCart: 'عرض السلة',
    product: 'المنتج', quantity: 'الكمية', total: 'الإجمالي',
    orderSummary: 'ملخص الطلب', shipping: 'الشحن', continueShopping: 'متابعة التسوق',
    wishlistTitle: 'المفضلة', wishlistEmpty: 'قائمة المفضلة فارغة',
    size: 'المقاس', sizeGuide: 'دليل المقاسات', sizeGuideDesc: 'المقاسات بالسنتيمتر',
    chest: 'الصدر', waist: 'الخصر', hip: 'الورك',
    sizeGuideNote: '💡 في حالة الشك، نوصي باختيار المقاس الأكبر.',
    addToCart: 'إضافة للسلة', buyNow: 'شراء الآن', addToWishlist: 'إضافة للمفضلة',
    removeFromWishlist: 'إزالة من المفضلة', descDetails: 'وصف المنتج',
    shippingInfo: 'الشحن والإرجاع',
    shippingInfoDetails: 'شحن سريع 2-5 أيام. إرجاع مجاني خلال 14 يوم.',
    searchTitle: 'ابحث في المتجر', search: 'بحث',
    login: 'تسجيل الدخول', register: 'إنشاء حساب',
    email: 'البريد الإلكتروني', password: 'كلمة المرور', fullName: 'الاسم الكامل',
    forgotPassword: 'نسيت كلمة المرور؟', myAccount: 'حسابي', myWishlist: 'المفضلة',
    logout: 'تسجيل الخروج',
    // Profile
    profileInfo: 'بياناتي', myOrders: 'طلباتي', security: 'الأمان',
    saveChanges: 'حفظ التغييرات', phone: 'رقم الهاتف', address: 'العنوان',
    changePassword: 'تغيير كلمة المرور', currentPassword: 'كلمة المرور الحالية',
    newPassword: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور',
    orderId: 'رقم الطلب', orderDate: 'التاريخ', items: 'المنتجات', status: 'الحالة',
    noOrders: 'لا توجد طلبات بعد',
    mySupportMessages: 'الدعم والرسائل', changeAvatar: 'تغيير الصورة',
    avatarSizeHint: 'JPG, PNG أو WebP. بحد أقصى 2 ميجابايت.', noMessages: 'لم ترسل أي رسائل بعد',
    subject: 'الموضوع', message: 'الرسالة', noReplyYet: 'لم يتم الرد بعد',
    roleAdmin: 'مدير', roleCustomer: 'عميل',
    // Admin (ARABIC)
    adminTitle: 'لوحة تحكم مدار', adminSubtitle: 'إدارة شاملة للمتجر',
    manageOrders: 'إدارة الطلبات', manageInventory: 'إدارة المنتجات', manageUsers: 'إدارة المستخدمين',
    manageMessages: 'الرسائل الواردة', manageContent: 'محتوى الموقع',
    manageAnnouncements: 'شريط الإعلانات', addAnnouncement: 'إضافة إعلان',
    annTextAr: 'النص العربي', annTextEn: 'النص الإنجليزي',
    save: 'حفظ', active: 'نشط', order: 'الترتيب',
    replyMessage: 'الرد على الرسالة', replyText: 'نص الرد', send: 'إرسال الرد',
    revenue: 'إجمالي المبيعات', totalOrders: 'عدد الطلبات', totalProducts: 'المنتجات', customers: 'العملاء',
    addProduct: 'إضافة منتج', saveProduct: 'حفظ المنتج', cancel: 'إلغاء', editProduct: 'تعديل',
    deleteProduct: 'حذف', productName: 'اسم المنتج', category: 'الفئة', actions: 'الإجراءات',
    productNameEn: 'اسم المنتج (English)', productNameAr: 'اسم المنتج (عربي)',
    price: 'السعر', originalPrice: 'السعر الأصلي', categoryAr: 'الفئة (عربي)', categoryEn: 'الفئة (English)',
    badgeEn: 'الشارة (English)', badgeAr: 'الشارة (عربي)',
    imagePrimary: 'الصورة الرئيسية', imageSecondary: 'الصورة الثانوية',
    descEn: 'الوصف (English)', descAr: 'الوصف (عربي)',
    customer: 'العميل', userId: 'المعرف', name: 'الاسم', role: 'الدور',
    joinDate: 'تاريخ التسجيل', makeAdmin: 'تعيين كمدير', makeCustomer: 'تحويل لعميل',
    resetPassword: 'إعادة تعيين كلمة المرور',
    subject: 'الموضوع', message: 'الرسالة', sendMessage: 'إرسال الرسالة',
    contactInfo: 'معلومات التواصل', contactDesc: 'نحن هنا دائماً للمساعدة',
    aboutTitle: 'عن مدار', aboutSubtitle: 'نحكي قصة الملابس التي تتحدث بلغتك',
    orderSuccess: 'تم استلام طلبك!', shippingDetails: 'تفاصيل الشحن', checkoutDetails: 'معلومات الشحن والتوصيل', city: 'المحافظة / المدينة', orderNotes: 'ملاحظات الطلب (اختياري)', confirmOrder: 'تأكيد وإتمام الطلب',
    footerBrand: 'ملابس للمطورين وعشاق التقنية — جودة حقيقية وتصميم يعبّر عنك.',
    footerShop: 'المتجر', footerHelp: 'مساعدة', newsletter: 'النشرة البريدية',
    newsletterDesc: 'اشترك وكن أول من يعرف بالمجموعات والعروض الجديدة',
    newsletterSuccess: '✓ تم الاشتراك بنجاح!', footerReturn: 'سياسة الإرجاع',
    newArrivals: 'وصل حديثاً', footerSale: 'العروض',
    copyright: '© 2025 مدار. جميع الحقوق محفوظة.',
    ann1: 'شحن مجاني للطلبات فوق 1500 جنيه', ann2: 'مجموعات جديدة كل موسم',
    ann3: 'مصنوع في مصر بأعلى معايير الجودة',
    logoMain: 'مدار',
    // Password strength
    passWeak: 'ضعيفة', passFair: 'مقبولة', passGood: 'جيدة', passStrong: 'قوية',
    orderStatusPending: 'قيد الانتظار', orderStatusPackaging: 'قيد التجهيز',
    orderStatusShipped: 'تم الشحن', orderStatusCancelled: 'ملغي',
  },
  en: {
    navHome: 'Home', navShop: 'Shop', navAbout: 'About', navContact: 'Contact',
    heroEyebrow: 'Collection 2025',
    heroTitleLine1: 'Clothes That', heroTitleLine2: 'Express You',
    heroSubtitle: 'Designed for developers, tech enthusiasts and creators',
    shopNow: 'Shop Now', ourStory: 'Our Story', viewAll: 'View All',
    featuredProducts: 'Featured Products', featuredDesc: 'Hand-picked pieces for your style',
    collections: 'Collections', collectionsDesc: 'Explore our curated collections',
    colTShirts: 'T-Shirts', colOutfits: 'Hoodies & Sweatshirts', colDenim: 'Denim & Jackets',
    shopCollection: 'Shop Collection',
    narrativeTitle: 'Madar — More Than Just Clothes',
    narrativeText: 'We believe what you wear is an extension of your identity.',
    feat1Title: 'Eco Materials', feat1Desc: 'Organic cotton and fully sustainable',
    feat2Title: 'Premium Craft', feat2Desc: 'Every piece made with care and precision',
    feat3Title: 'Fast & Safe Shipping', feat3Desc: '2-5 business day delivery across Egypt',
    shopDesc: 'Explore our full collection',
    filter: 'Filter & Sort', sortBy: 'Sort By',
    sortDefault: 'Default', sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low', sortRating: 'Top Rated', sortName: 'Name A-Z',
    filterCategory: 'Category', filterSize: 'Size', filterPrice: 'Price',
    clearFilters: 'Clear All', applyFilters: 'Apply', filterTitle: 'Filter & Sort',
    cartTitle: 'Cart', cartEmpty: 'Your cart is empty',
    orderNote: 'Add Order Note', subtotal: 'Subtotal',
    taxInfo: 'Shipping calculated at checkout', checkout: 'Checkout', viewCart: 'View Cart',
    product: 'Product', quantity: 'Quantity', total: 'Total',
    orderSummary: 'Order Summary', shipping: 'Shipping', continueShopping: 'Continue Shopping',
    wishlistTitle: 'Wishlist', wishlistEmpty: 'Your wishlist is empty',
    size: 'Size', sizeGuide: 'Size Guide', sizeGuideDesc: 'Measurements in cm',
    chest: 'Chest', waist: 'Waist', hip: 'Hip',
    sizeGuideNote: '💡 When in doubt, we recommend sizing up for a more relaxed fit.',
    addToCart: 'Add to Cart', buyNow: 'Buy Now', addToWishlist: 'Add to Wishlist',
    removeFromWishlist: 'Remove from Wishlist', descDetails: 'Product Description',
    shippingInfo: 'Shipping & Returns',
    shippingInfoDetails: 'Fast 2-5 day shipping. Free returns within 14 days.',
    searchTitle: 'Search the Store', search: 'Search',
    login: 'Login', register: 'Create Account',
    email: 'Email', password: 'Password', fullName: 'Full Name',
    forgotPassword: 'Forgot password?', myAccount: 'My Account', myWishlist: 'Wishlist',
    logout: 'Sign Out',
    // Profile
    profileInfo: 'My Info', myOrders: 'My Orders', security: 'Security',
    saveChanges: 'Save Changes', phone: 'Phone Number', address: 'Address',
    changePassword: 'Change Password', currentPassword: 'Current Password',
    newPassword: 'New Password', confirmPassword: 'Confirm Password',
    orderId: 'Order ID', orderDate: 'Date', items: 'Items', status: 'Status',
    noOrders: 'No orders yet',
    mySupportMessages: 'Support & Messages', changeAvatar: 'Change Photo',
    avatarSizeHint: 'JPG, PNG or WebP. Max 2MB.', noMessages: 'No messages sent yet',
    subject: 'Subject', message: 'Message', noReplyYet: 'No reply yet',
    roleAdmin: 'Admin', roleCustomer: 'Customer',
    // Admin (English)
    adminTitle: 'Madar Admin Panel', adminSubtitle: 'Full Store Management',
    manageOrders: 'Manage Orders', manageInventory: 'Manage Inventory', manageUsers: 'Manage Users',
    manageMessages: 'Inbox Messages', manageContent: 'Site Content',
    manageAnnouncements: 'Announcement Bar', addAnnouncement: 'Add Announcement',
    annTextAr: 'Arabic Text', annTextEn: 'English Text',
    save: 'Save', active: 'Active', order: 'Order',
    replyMessage: 'Reply to Message', replyText: 'Reply Text', send: 'Send Reply',
    revenue: 'Total Revenue', totalOrders: 'Orders', totalProducts: 'Products', customers: 'Customers',
    addProduct: 'Add Product', saveProduct: 'Save Product', cancel: 'Cancel', editProduct: 'Edit',
    deleteProduct: 'Delete', productName: 'Product Name', category: 'Category', actions: 'Actions',
    productNameEn: 'Name (English)', productNameAr: 'Name (Arabic)',
    price: 'Price', originalPrice: 'Original Price', categoryAr: 'Category (Arabic)', categoryEn: 'Category (English)',
    badgeEn: 'Badge (English)', badgeAr: 'Badge (Arabic)',
    imagePrimary: 'Primary Image', imageSecondary: 'Secondary Image',
    descEn: 'Description (English)', descAr: 'Description (Arabic)',
    customer: 'Customer', userId: 'ID', name: 'Name', role: 'Role',
    joinDate: 'Joined', makeAdmin: 'Make Admin', makeCustomer: 'Make Customer',
    resetPassword: 'Reset Password',
    subject: 'Subject', message: 'Message', sendMessage: 'Send Message',
    contactInfo: 'Contact Info', contactDesc: "We're always here to help",
    aboutTitle: 'About Madar', aboutSubtitle: 'The story of clothes that speak your language',
    orderSuccess: 'Order Received!', shippingDetails: 'Shipping Details', checkoutDetails: 'Shipping & Delivery Info', city: 'City / Governorate', orderNotes: 'Order Notes (optional)', confirmOrder: 'Confirm & Place Order',
    footerBrand: 'Minimalist clothing for developers and tech enthusiasts — real quality.',
    footerShop: 'Shop', footerHelp: 'Help', newsletter: 'Newsletter',
    newsletterDesc: 'Subscribe to be first to know about new collections and offers',
    newsletterSuccess: '✓ Subscribed successfully!', footerReturn: 'Return Policy',
    newArrivals: 'New Arrivals', footerSale: 'Sale',
    copyright: '© 2025 Madar. All rights reserved.',
    ann1: 'Free shipping on orders over 1500 EGP', ann2: 'New collections every season',
    ann3: 'Made in Egypt to the highest quality standards',
    logoMain: 'MADAR',
    passWeak: 'Weak', passFair: 'Fair', passGood: 'Good', passStrong: 'Strong',
    orderStatusPending: 'Pending', orderStatusPackaging: 'Packaging',
    orderStatusShipped: 'Shipped', orderStatusCancelled: 'Cancelled',
  }
};

// ─── STATE ────────────────────────────────────────────────────────────────────
let currentLang = localStorage.getItem('madar_lang') || 'ar';
let currentRoute = 'home';
let products = [];
let cart = JSON.parse(localStorage.getItem('madar_cart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('madar_wishlist') || '[]');
let currentModalProduct = null;
let selectedSize = null;
let filterState = { sort: 'default', categories: [], sizes: [], maxPrice: 2000 };
let authToken = localStorage.getItem('madar_token') || null;
let currentUser = JSON.parse(localStorage.getItem('madar_user') || 'null');
let editingProductId = null;

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const t = key => (translations[currentLang] && translations[currentLang][key]) || translations['ar'][key] || key;
const $ = id => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);
const apiHeaders = () => ({ 'Content-Type': 'application/json', 'x-auth-token': authToken || '' });

// ── Centralized fetch: auto-handle 401 (expired/invalid token) ──
async function apiFetch(url, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { ...apiHeaders(), ...(options.headers || {}) }
  });
  if (res.status === 401) {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('madar_token');
    localStorage.removeItem('madar_user');
    updateAuthUI();
    showToast(currentLang === 'ar' ? 'انتهت جلستك — سجّل الدخول مجدداً' : 'Session expired — please log in again', 'error', 5000);
    openModal('account-modal');
    return null;
  }
  return res;
}

function showToast(message, type = 'success', duration = 3500) {
  const container = $('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transform = 'translateY(10px)'; toast.style.transition = '0.4s'; setTimeout(() => toast.remove(), 400); }, duration);
}

function formatCurrency(amount) {
  return currentLang === 'ar' ? `${amount.toLocaleString('ar-EG')} جنيه` : `${amount.toLocaleString()} EGP`;
}

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(currentLang === 'ar' ? 'ar-EG' : 'en-GB', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusBadgeClass(s) {
  if (s === 'قيد الانتظار' || s === 'Pending') return 'status-pending';
  if (s === 'قيد التجهيز' || s === 'Packaging') return 'status-packaging';
  if (s === 'تم الشحن' || s === 'Shipped') return 'status-shipped';
  if (s === 'ملغي' || s === 'Cancelled') return 'status-cancelled';
  if (s === 'طلب استرجاع') return 'status-pending';
  if (s === 'تم الاسترجاع') return 'status-shipped';
  return 'status-pending';
}

async function fetchCMSContent() {
  try {
    const res = await fetch('/api/content');
    const dynamicContent = await res.json();
    if (dynamicContent && dynamicContent.ar && dynamicContent.en) {
      translations.ar = { ...translations.ar, ...dynamicContent.ar };
      translations.en = { ...translations.en, ...dynamicContent.en };
    }
  } catch (e) {
    console.error('Failed to load CMS content:', e);
  }
}

// ─── TRANSLATIONS ENGINE ──────────────────────────────────────────────────────
function applyTranslations() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  $$('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[currentLang] && translations[currentLang][key]) {
      el.textContent = translations[currentLang][key];
    }
  });
  $$('[data-i18n-placeholder]').forEach(el => {
    const key = el.getAttribute('data-i18n-placeholder');
    if (translations[currentLang] && translations[currentLang][key]) el.placeholder = translations[currentLang][key];
  });
  // Logo
  const logoEl = $('logo-text');
  if (logoEl) {
    if (translations[currentLang] && translations[currentLang]['siteLogo']) {
      logoEl.textContent = translations[currentLang]['siteLogo'];
    } else {
      logoEl.textContent = currentLang === 'ar' ? 'مدار' : 'MADAR';
    }
  }
  // Lang toggle buttons
  $$('#lang-toggle-btn, #mobile-lang-toggle').forEach(b => b.textContent = currentLang === 'ar' ? 'EN' : 'عر');
  // Update nav active states
  updateNavActive();
  // Re-render if needed
  renderCartBadge();
  renderWishlistBadge();
  renderAnnouncements();
}

// ─── ROUTER ───────────────────────────────────────────────────────────────────
function navigate(route) {
  // Guard admin route
  if (route === 'admin') {
    if (!currentUser || currentUser.role !== 'admin') {
      showToast(currentLang === 'ar' ? 'يجب تسجيل الدخول كمدير' : 'Admin access required', 'error');
      openModal('account-modal');
      return;
    }
  }
  // Guard profile route
  if (route === 'profile' && !currentUser) {
    showToast(currentLang === 'ar' ? 'يجب تسجيل الدخول أولاً' : 'Please login first', 'error');
    openModal('account-modal');
    return;
  }

  currentRoute = route;
  window.location.hash = route;

  $$('.page-view').forEach(v => v.classList.remove('active'));
  const target = $(`view-${route}`);
  if (target) target.classList.add('active');

  updateNavActive();
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Page-specific initialization
  if (route === 'shop') { loadProducts(); }
  else if (route === 'home') { loadHomeProducts(); }
  else if (route === 'admin') { loadAdminData(); }
  else if (route === 'profile') { loadProfileData(); }
  else if (route === 'cart') { renderCartPage(); }
}

function updateNavActive() {
  $$('.nav-link, .drawer-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    link.classList.toggle('active', href === `#${currentRoute}`);
  });
}

window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);
});

// ─── PRODUCTS API ─────────────────────────────────────────────────────────────
async function fetchProducts(query = '') {
  try {
    const url = query ? `/api/products?q=${encodeURIComponent(query)}` : '/api/products';
    const res = await fetch(url);
    const data = await res.json();
    return data;
  } catch (e) {
    console.error('Failed to fetch products:', e);
    return [];
  }
}

// ─── PRODUCT CARD RENDERER ────────────────────────────────────────────────────
function createProductCard(p) {
  const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
  const category = currentLang === 'ar' ? p.categoryAr : p.categoryEn;
  const badge = currentLang === 'ar' ? p.badgeAr : p.badgeEn;
  const price = formatCurrency(p.price);
  const origPrice = p.originalPrice > p.price ? formatCurrency(p.originalPrice) : '';
  const inWishlist = wishlist.some(w => w.id === p.id);
  const badgeClass = badge && badge.toLowerCase().includes('new') ? 'new-badge' : badge && badge.toLowerCase().includes('best') ? 'best-badge' : 'sale-badge';

  const card = document.createElement('div');
  card.className = 'product-card';
  card.dataset.productId = p.id;
  card.innerHTML = `
    <div class="product-image-wrapper">
      <img class="product-card-img primary-img" src="${p.images[0]}" alt="${name}" loading="lazy">
      <img class="product-card-img secondary-img" src="${p.images[1]}" alt="${name}" loading="lazy">
      ${badge ? `<span class="product-badge ${badgeClass}">${badge}</span>` : ''}
      <button class="wishlist-add-btn ${inWishlist ? 'wishlisted' : ''}" data-id="${p.id}" title="${t(inWishlist ? 'removeFromWishlist' : 'addToWishlist')}">
        <i class="fa-${inWishlist ? 'solid' : 'regular'} fa-heart"></i>
      </button>
      <div class="product-card-actions">
        <button class="btn secondary-btn quick-view-btn btn-sm" data-id="${p.id}">${t('viewAll')}</button>
        <button class="btn primary-btn add-to-cart-card-btn btn-sm" data-id="${p.id}">${t('addToCart')}</button>
      </div>
    </div>
    <div class="product-card-info">
      <p class="product-card-category">${category}</p>
      <h3 class="product-card-title">${name}</h3>
      <div class="product-card-price-row">
        <span class="product-price">${price}</span>
        ${origPrice ? `<span class="original-price">${origPrice}</span>` : ''}
      </div>
    </div>
  `;

  // Events
  card.querySelector('.quick-view-btn').addEventListener('click', () => openProductModal(p));
  card.querySelector('.product-image-wrapper').addEventListener('click', e => { if (!e.target.closest('button')) openProductModal(p); });
  card.querySelector('.wishlist-add-btn').addEventListener('click', () => toggleWishlist(p));
  card.querySelector('.add-to-cart-card-btn').addEventListener('click', () => {
    const size = p.sizes[0] || 'M';
    addToCart(p, size, 1);
  });

  return card;
}

// ─── HOME PAGE PRODUCTS ───────────────────────────────────────────────────────
async function loadHomeProducts() {
  products = await fetchProducts();
  const grid = $('home-products-grid');
  if (!grid) return;
  grid.innerHTML = '';
  products.slice(0, 4).forEach(p => grid.appendChild(createProductCard(p)));
}

// ─── SHOP PAGE PRODUCTS ───────────────────────────────────────────────────────
async function loadProducts() {
  if (products.length === 0) products = await fetchProducts();
  renderShopProducts();
  buildCategoryFilters();
}

function renderShopProducts() {
  let filtered = [...products];

  // Category filter
  if (filterState.categories.length > 0) {
    filtered = filtered.filter(p => filterState.categories.includes(p.categoryAr) || filterState.categories.includes(p.categoryEn));
  }
  // Size filter
  if (filterState.sizes.length > 0) {
    filtered = filtered.filter(p => filterState.sizes.some(s => p.sizes.includes(s)));
  }
  // Price filter
  filtered = filtered.filter(p => p.price <= filterState.maxPrice);
  // Sort
  if (filterState.sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
  else if (filterState.sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
  else if (filterState.sort === 'rating') filtered.sort((a, b) => b.rating - a.rating);
  else if (filterState.sort === 'name') filtered.sort((a, b) => (currentLang === 'ar' ? a.nameAr.localeCompare(b.nameAr, 'ar') : a.nameEn.localeCompare(b.nameEn)));

  const grid = $('shop-products-grid');
  grid.innerHTML = '';
  if (filtered.length === 0) {
    grid.innerHTML = `<div style="text-align:center;padding:6rem;color:var(--text-muted);grid-column:1/-1"><i class="fa-solid fa-magnifying-glass" style="font-size:3rem;margin-bottom:1.6rem;display:block"></i>${currentLang === 'ar' ? 'لا توجد منتجات مطابقة للفلتر' : 'No products match your filters'}</div>`;
  } else {
    filtered.forEach(p => grid.appendChild(createProductCard(p)));
  }

  const countEl = $('shop-products-count');
  if (countEl) countEl.textContent = currentLang === 'ar' ? `${filtered.length} منتج` : `${filtered.length} products`;
}

function buildCategoryFilters() {
  const cats = [...new Set(products.map(p => currentLang === 'ar' ? p.categoryAr : p.categoryEn))];
  const list = $('category-filter-list');
  if (!list) return;
  list.innerHTML = '';
  cats.forEach(cat => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.innerHTML = `<input type="checkbox" value="${cat}"> ${cat}`;
    label.querySelector('input').addEventListener('change', e => {
      if (e.target.checked) filterState.categories.push(cat);
      else filterState.categories = filterState.categories.filter(c => c !== cat);
    });
    list.appendChild(label);
  });
}

// ─── PRODUCT MODAL ────────────────────────────────────────────────────────────
function openProductModal(p) {
  currentModalProduct = p;
  selectedSize = null;
  const lang = currentLang;
  const name = lang === 'ar' ? p.nameAr : p.nameEn;
  const desc = lang === 'ar' ? p.descriptionAr : p.descriptionEn;
  const category = lang === 'ar' ? p.categoryAr : p.categoryEn;
  const badge = lang === 'ar' ? p.badgeAr : p.badgeEn;

  $('modal-main-img').src = p.images[0];
  $('modal-title').textContent = name;
  $('modal-category').textContent = category;
  $('modal-price').textContent = formatCurrency(p.price);
  $('modal-original-price').textContent = p.originalPrice > p.price ? formatCurrency(p.originalPrice) : '';
  $('modal-desc').textContent = desc;
  $('modal-acc-desc').textContent = desc;

  const badgeEl = $('modal-badge');
  if (badge) { badgeEl.textContent = badge; badgeEl.classList.remove('hidden'); }
  else badgeEl.classList.add('hidden');

  // Stars
  const stars = Math.round(p.rating);
  $('modal-stars').innerHTML = '★'.repeat(stars) + '☆'.repeat(5 - stars);
  $('modal-reviews').textContent = `(${p.reviewsCount} ${lang === 'ar' ? 'تقييم' : 'reviews'})`;

  // Thumbnails
  const thumbs = $('modal-thumbnails');
  thumbs.innerHTML = '';
  p.images.forEach((img, i) => {
    const div = document.createElement('div');
    div.className = `thumb-wrapper ${i === 0 ? 'active' : ''}`;
    div.innerHTML = `<img src="${img}" alt="">`;
    div.addEventListener('click', () => {
      $('modal-main-img').src = img;
      $$('#modal-thumbnails .thumb-wrapper').forEach(t => t.classList.remove('active'));
      div.classList.add('active');
    });
    thumbs.appendChild(div);
  });

  // Sizes
  const sizesDiv = $('modal-sizes');
  sizesDiv.innerHTML = '';
  p.sizes.forEach(s => {
    const btn = document.createElement('button');
    btn.className = 'size-btn';
    btn.textContent = s;
    btn.addEventListener('click', () => {
      $$('#modal-sizes .size-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedSize = s;
    });
    sizesDiv.appendChild(btn);
  });

  // Wishlist button state
  const inWishlist = wishlist.some(w => w.id === p.id);
  const wishBtn = $('modal-wishlist-toggle');
  wishBtn.textContent = t(inWishlist ? 'removeFromWishlist' : 'addToWishlist');

  $('modal-qty-input').value = 1;
  openModal('product-modal');
}

// ─── CART SYSTEM ──────────────────────────────────────────────────────────────
function addToCart(product, size, qty = 1) {
  if (!size) { showToast(currentLang === 'ar' ? 'الرجاء اختيار المقاس' : 'Please select a size', 'error'); return; }
  const existing = cart.find(c => c.id === product.id && c.size === size);
  if (existing) existing.qty = Math.min(existing.qty + qty, 10);
  else cart.push({ id: product.id, nameEn: product.nameEn, nameAr: product.nameAr, price: product.price, image: product.images[0], size, qty });
  saveCart();
  renderCartBadge();
  showToast(currentLang === 'ar' ? 'تمت الإضافة للسلة ✓' : 'Added to cart ✓');
  openDrawer('cart-drawer');
  renderCartDrawer();
}

function saveCart() { localStorage.setItem('madar_cart', JSON.stringify(cart)); }

function renderCartBadge() {
  const count = cart.reduce((acc, c) => acc + c.qty, 0);
  $$('#cart-count-badge, #mobile-cart-badge').forEach(el => {
    el.textContent = count;
    el.classList.toggle('hidden', count === 0);
  });
}

function renderCartDrawer() {
  const list = $('cart-items-list');
  if (!list) return;
  list.innerHTML = '';

  if (cart.length === 0) {
    list.innerHTML = `<div class="empty-cart-message"><i class="fa-solid fa-bag-shopping empty-cart-icon"></i><p>${t('cartEmpty')}</p></div>`;
  } else {
    cart.forEach((item, idx) => {
      const name = currentLang === 'ar' ? item.nameAr : item.nameEn;
      const el = document.createElement('div');
      el.className = 'cart-item';
      el.innerHTML = `
        <div class="cart-item-img-wrapper"><img src="${item.image}" alt="${name}"></div>
        <div class="cart-item-details">
          <p class="cart-item-title">${name}</p>
          <p class="cart-item-meta">${t('size')}: ${item.size}</p>
          <p class="cart-item-price">${formatCurrency(item.price * item.qty)}</p>
          <div class="cart-item-actions">
            <div class="quantity-picker">
              <button class="qty-adjust-btn" data-idx="${idx}" data-delta="-1"><i class="fa-solid fa-minus fa-sm"></i></button>
              <input type="number" class="qty-input-box" value="${item.qty}" min="1" max="10" data-idx="${idx}">
              <button class="qty-adjust-btn" data-idx="${idx}" data-delta="1"><i class="fa-solid fa-plus fa-sm"></i></button>
            </div>
            <button class="remove-cart-item-btn" data-idx="${idx}">${t('deleteProduct')}</button>
          </div>
        </div>
      `;
      list.appendChild(el);
    });
  }

  // Shipping progress
  const sub = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  const threshold = 1500;
  const remaining = Math.max(0, threshold - sub);
  const progress = Math.min((sub / threshold) * 100, 100);
  const info = $('shipping-info-text');
  const progBar = $('shipping-progress');
  if (info) info.textContent = remaining > 0 ? (currentLang === 'ar' ? `أضف ${formatCurrency(remaining)} للشحن المجاني!` : `Add ${formatCurrency(remaining)} for free shipping!`) : (currentLang === 'ar' ? '🎉 حصلت على شحن مجاني!' : '🎉 You got free shipping!');
  if (progBar) progBar.style.width = progress + '%';

  // Subtotal
  const subtotalEl = $('cart-subtotal-val');
  if (subtotalEl) subtotalEl.textContent = formatCurrency(sub);

  // Event delegation
  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-idx]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx);
    if (btn.classList.contains('qty-adjust-btn')) {
      const delta = parseInt(btn.dataset.delta);
      cart[idx].qty = Math.max(1, Math.min(10, cart[idx].qty + delta));
    } else if (btn.classList.contains('remove-cart-item-btn')) {
      cart.splice(idx, 1);
    }
    saveCart(); renderCartBadge(); renderCartDrawer();
  }, { once: false });
}

function renderCartPage() {
  const list = $('cart-page-items-list');
  if (!list) return;
  list.innerHTML = '';
  let sub = 0;
  cart.forEach((item, idx) => {
    const name = currentLang === 'ar' ? item.nameAr : item.nameEn;
    const lineTotal = item.price * item.qty;
    sub += lineTotal;
    const row = document.createElement('div');
    row.className = 'cart-page-row';
    row.innerHTML = `
      <div class="cart-page-product">
        <div class="cart-page-img"><img src="${item.image}" alt="${name}"></div>
        <div class="cart-page-title-meta"><h3>${name}</h3><p>${t('size')}: ${item.size}</p></div>
      </div>
      <div class="cart-page-qty">
        <div class="quantity-picker">
          <button class="qty-adjust-btn" data-idx="${idx}" data-delta="-1"><i class="fa-solid fa-minus fa-sm"></i></button>
          <input type="number" class="qty-input-box" value="${item.qty}" min="1" max="10">
          <button class="qty-adjust-btn" data-idx="${idx}" data-delta="1"><i class="fa-solid fa-plus fa-sm"></i></button>
        </div>
      </div>
      <div class="cart-page-price">
        ${formatCurrency(lineTotal)}
        <button class="remove-cart-item-btn" data-idx="${idx}" style="font-size:1.3rem">✕</button>
      </div>
    `;
    list.appendChild(row);
  });
  const shipping = sub >= 1500 ? 0 : 80;
  const total = sub + shipping;
  const cpSub = $('cp-subtotal'), cpShip = $('cp-shipping'), cpTotal = $('cp-total');
  if (cpSub) cpSub.textContent = formatCurrency(sub);
  if (cpShip) cpShip.textContent = shipping === 0 ? (currentLang === 'ar' ? 'مجاني' : 'Free') : formatCurrency(shipping);
  if (cpTotal) cpTotal.textContent = formatCurrency(total);

  list.addEventListener('click', e => {
    const btn = e.target.closest('[data-idx]');
    if (!btn) return;
    const idx = parseInt(btn.dataset.idx);
    if (btn.classList.contains('qty-adjust-btn')) {
      const delta = parseInt(btn.dataset.delta);
      cart[idx].qty = Math.max(1, Math.min(10, cart[idx].qty + delta));
    } else if (btn.classList.contains('remove-cart-item-btn')) {
      cart.splice(idx, 1);
    }
    saveCart(); renderCartBadge(); renderCartPage();
  });
}

// ─── CHECKOUT ─────────────────────────────────────────────────────────────────
async function processCheckout() {
  if (cart.length === 0) { showToast(currentLang === 'ar' ? 'السلة فارغة' : 'Cart is empty', 'error'); return; }
  
  // Pre-fill fields if user is logged in
  if (currentUser) {
    if ($('checkout-name')) $('checkout-name').value = currentUser.name || '';
    if ($('checkout-phone')) $('checkout-phone').value = currentUser.phone || '';
    if ($('checkout-address')) $('checkout-address').value = currentUser.address || '';
    if ($('checkout-city')) $('checkout-city').value = currentUser.city || '';
  } else {
    // Clear fields for guest
    if ($('checkout-name')) $('checkout-name').value = '';
    if ($('checkout-phone')) $('checkout-phone').value = '';
    if ($('checkout-address')) $('checkout-address').value = '';
    if ($('checkout-city')) $('checkout-city').value = '';
  }
  
  // Set the note in the form from the note field in the cart if any
  if ($('checkout-notes') && $('order-note-field')) {
    $('checkout-notes').value = $('order-note-field').value || '';
  }

  // Open the checkout details modal!
  openModal('checkout-info-modal');
}

async function submitOrder() {
  if (cart.length === 0) { showToast(currentLang === 'ar' ? 'السلة فارغة' : 'Cart is empty', 'error'); return; }
  
  const customerName = $('checkout-name').value.trim();
  const customerPhone = $('checkout-phone').value.trim();
  const customerCity = $('checkout-city').value.trim();
  const customerAddress = $('checkout-address').value.trim();
  const note = $('checkout-notes').value.trim();

  if (!customerName || !customerPhone || !customerCity || !customerAddress) {
    showToast(currentLang === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields', 'error');
    return;
  }

  const sub = cart.reduce((acc, c) => acc + c.price * c.qty, 0);
  const shipping = sub >= 1500 ? 0 : 80;
  const total = sub + shipping;

  try {
    // Close the info modal to prevent double click
    closeModal('checkout-info-modal');
    
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-auth-token': authToken || '' },
      body: JSON.stringify({
        items: cart,
        note,
        subtotal: sub,
        shipping,
        total,
        customerName,
        customerPhone,
        customerAddress,
        customerCity
      })
    });
    const data = await res.json();
    if (data.success) {
      closeDrawer('cart-drawer');
      cart = []; saveCart(); renderCartBadge();
      const successMsg = $('checkout-success-msg');
      const orderIdEl = $('checkout-order-id');
      if (successMsg) successMsg.textContent = currentLang === 'ar' ? `سيتم الشحن خلال 2-5 أيام عمل. الإجمالي: ${formatCurrency(total)}` : `Will ship within 2-5 business days. Total: ${formatCurrency(total)}`;
      if (orderIdEl) orderIdEl.textContent = data.orderId;
      openModal('checkout-success-modal');
    } else {
      showToast(data.error || 'Checkout error', 'error');
    }
  } catch (e) {
    showToast(currentLang === 'ar' ? 'خطأ في معالجة الطلب' : 'Checkout error', 'error');
  }
}

// ─── WISHLIST ─────────────────────────────────────────────────────────────────
function toggleWishlist(p) {
  const idx = wishlist.findIndex(w => w.id === p.id);
  if (idx > -1) {
    wishlist.splice(idx, 1);
    showToast(currentLang === 'ar' ? 'تمت الإزالة من المفضلة' : 'Removed from wishlist');
  } else {
    wishlist.push({ id: p.id, nameEn: p.nameEn, nameAr: p.nameAr, price: p.price, image: p.images[0] });
    showToast(currentLang === 'ar' ? 'تمت الإضافة للمفضلة ❤️' : 'Added to wishlist ❤️');
  }
  localStorage.setItem('madar_wishlist', JSON.stringify(wishlist));
  renderWishlistBadge();
  renderWishlistDrawer();

  // Update buttons in cards and modal
  $$(`[data-id="${p.id}"].wishlist-add-btn`).forEach(btn => {
    btn.classList.toggle('wishlisted', wishlist.some(w => w.id === p.id));
    btn.innerHTML = `<i class="fa-${wishlist.some(w => w.id === p.id) ? 'solid' : 'regular'} fa-heart"></i>`;
  });
  if (currentModalProduct?.id === p.id) {
    const wb = $('modal-wishlist-toggle');
    if (wb) wb.textContent = t(wishlist.some(w => w.id === p.id) ? 'removeFromWishlist' : 'addToWishlist');
  }
}

function renderWishlistBadge() {
  const count = wishlist.length;
  const badge = $('wishlist-count-badge');
  if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); }
}

function renderWishlistDrawer() {
  const list = $('wishlist-items-list');
  if (!list) return;
  list.innerHTML = '';
  if (wishlist.length === 0) {
    list.innerHTML = `<div class="empty-cart-message"><i class="fa-regular fa-heart empty-cart-icon"></i><p>${t('wishlistEmpty')}</p></div>`;
    return;
  }
  wishlist.forEach(item => {
    const name = currentLang === 'ar' ? item.nameAr : item.nameEn;
    const el = document.createElement('div');
    el.className = 'wishlist-item';
    el.innerHTML = `
      <div class="wishlist-img"><img src="${item.image}" alt="${name}"></div>
      <div class="wishlist-details"><p class="wishlist-title">${name}</p><p class="wishlist-price">${formatCurrency(item.price)}</p></div>
      <div class="wishlist-actions">
        <button class="btn primary-btn btn-sm" onclick="addToCart(products.find(p=>p.id===${item.id})||item, '${products.find(p=>p.id===item.id)?.sizes[0] || 'M'}', 1)">${t('addToCart')}</button>
        <button class="wishlist-remove-btn" onclick="toggleWishlist({id:${item.id}, nameEn:'${item.nameEn}', nameAr:'${item.nameAr}', price:${item.price}, images:['${item.image}']})">${t('deleteProduct')}</button>
      </div>
    `;
    list.appendChild(el);
  });
}

// ─── SEARCH ───────────────────────────────────────────────────────────────────
async function handleSearch(q) {
  const container = $('search-results');
  if (!container) return;
  if (!q.trim()) { container.innerHTML = ''; return; }

  const results = await fetchProducts(q);
  container.innerHTML = '';

  if (results.length === 0) {
    container.innerHTML = `<p style="text-align:center;color:var(--text-muted);padding:2rem">${currentLang === 'ar' ? 'لا توجد نتائج' : 'No results found'}</p>`;
    return;
  }

  results.slice(0, 6).forEach(p => {
    const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
    const category = currentLang === 'ar' ? p.categoryAr : p.categoryEn;
    const item = document.createElement('div');
    item.style.cssText = 'display:flex;gap:1.6rem;align-items:center;padding:1.2rem;border-radius:var(--r-sm);cursor:pointer;transition:var(--t-fast)';
    item.innerHTML = `
      <div style="width:6rem;height:6rem;border-radius:var(--r-sm);overflow:hidden;flex-shrink:0"><img src="${p.images[0]}" alt="${name}" style="width:100%;height:100%;object-fit:cover"></div>
      <div>
        <p style="font-weight:700;color:#fff;margin-bottom:0.4rem">${name}</p>
        <p style="font-size:1.2rem;color:var(--text-muted)">${category}</p>
        <p style="font-size:1.4rem;font-weight:800;color:var(--cyan)">${formatCurrency(p.price)}</p>
      </div>
    `;
    item.addEventListener('mouseover', () => item.style.background = 'var(--bg-2)');
    item.addEventListener('mouseout', () => item.style.background = '');
    item.addEventListener('click', () => {
      closeSearchOverlay();
      openProductModal(p);
    });
    container.appendChild(item);
  });
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
async function handleLogin() {
  const email = $('login-email').value.trim();
  const pass = $('login-password').value;
  if (!email || !pass) { showToast(currentLang === 'ar' ? 'أدخل البريد وكلمة المرور' : 'Enter email and password', 'error'); return; }

  try {
    const res = await fetch('/api/login', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const data = await res.json();
    if (data.success) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('madar_token', authToken);
      localStorage.setItem('madar_user', JSON.stringify(currentUser));
      closeModal('account-modal');
      updateAuthUI();
      showToast(currentLang === 'ar' ? `مرحباً ${data.user.name} 👋` : `Welcome ${data.user.name} 👋`);
      if (data.user.role === 'admin') {
        navigate('admin');
        checkUnreadNotifications();
        setInterval(checkUnreadNotifications, 30000);
      }
    } else {
      showToast(data.error || 'Login failed', 'error');
    }
  } catch (e) { showToast(currentLang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Server error', 'error'); }
}

async function handleRegister() {
  const name = $('reg-name').value.trim();
  const email = $('reg-email').value.trim();
  const pass = $('reg-password').value;
  if (!name || !email || !pass) { showToast(currentLang === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields required', 'error'); return; }
  if (pass.length < 6) { showToast(currentLang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters', 'error'); return; }

  try {
    const res = await fetch('/api/register', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password: pass })
    });
    const data = await res.json();
    if (data.success) {
      authToken = data.token;
      currentUser = data.user;
      localStorage.setItem('madar_token', authToken);
      localStorage.setItem('madar_user', JSON.stringify(currentUser));
      closeModal('account-modal');
      updateAuthUI();
      showToast(currentLang === 'ar' ? `تم إنشاء حسابك يا ${name} 🎉` : `Account created for ${name} 🎉`);
    } else {
      showToast(data.error || 'Registration failed', 'error');
    }
  } catch (e) { showToast(currentLang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Server error', 'error'); }
}

async function handleLogout() {
  try { await fetch('/api/logout', { method: 'POST', headers: apiHeaders() }); } catch {}
  authToken = null; currentUser = null;
  localStorage.removeItem('madar_token'); localStorage.removeItem('madar_user');
  updateAuthUI();
  navigate('home');
  showToast(currentLang === 'ar' ? 'تم تسجيل الخروج' : 'Logged out');
}

function updateAuthUI() {
  const adminBtn = $('admin-panel-btn');
  const accountBtn = $('account-btn');
  if (currentUser) {
    if (adminBtn) adminBtn.classList.toggle('hidden', currentUser.role !== 'admin');
    if (accountBtn) {
      if (currentUser.avatarUrl) {
        accountBtn.innerHTML = `<img src="${currentUser.avatarUrl}" style="width:2.4rem;height:2.4rem;border-radius:50%;object-fit:cover;display:block">`;
      } else {
        accountBtn.innerHTML = `<span style="font-size:1.4rem;font-weight:800;color:var(--cyan)">${currentUser.avatarInitials || currentUser.name.charAt(0)}</span>`;
      }
      accountBtn.onclick = () => navigate('profile');
    }
  } else {
    if (adminBtn) adminBtn.classList.add('hidden');
    if (accountBtn) {
      accountBtn.innerHTML = '<i class="fa-regular fa-user"></i>';
      accountBtn.onclick = () => openModal('account-modal');
    }
  }
}

// ─── PROFILE PAGE ─────────────────────────────────────────────────────────────
async function loadProfileData() {
  if (!currentUser || !authToken) return;

  // Update header
  const avatarEl = $('profile-avatar-circle');
  const nameEl = $('profile-name-display');
  const emailEl = $('profile-email-display');
  const roleBadge = $('profile-role-badge');
  const joinDate = $('profile-join-date');

  if (avatarEl) { avatarEl.textContent = currentUser.avatarInitials || currentUser.name.charAt(0); }
  if (nameEl) nameEl.textContent = currentUser.name;
  if (emailEl) emailEl.textContent = currentUser.email;
  if (roleBadge) {
    roleBadge.textContent = currentUser.role === 'admin' ? t('roleAdmin') : t('roleCustomer');
    roleBadge.className = `profile-role-badge ${currentUser.role === 'admin' ? 'role-admin' : 'role-customer'}`;
  }

  // Fetch fresh profile from server
  try {
    const res = await apiFetch('/api/profile');
    if (!res) return;
    const data = await res.json();
    if (!data.error) {
      currentUser = { ...currentUser, ...data, avatarInitials: data.avatar_initials, avatarUrl: data.avatar_url };
      localStorage.setItem('madar_user', JSON.stringify(currentUser));
      if ($('prof-name')) $('prof-name').value = data.name;
      if ($('prof-email')) $('prof-email').value = data.email;
      if ($('prof-phone')) $('prof-phone').value = data.phone || '';
      if ($('prof-address')) $('prof-address').value = data.address || '';
      if ($('prof-avatar-url')) $('prof-avatar-url').value = data.avatar_url || '';
      if (joinDate) joinDate.textContent = `${currentLang === 'ar' ? 'عضو منذ' : 'Member since'} ${formatDate(data.created_at)}`;
      const pointsDisplay = $('profile-points-display');
      if (pointsDisplay) {
        pointsDisplay.textContent = currentLang === 'ar' ? `${data.points || 0} نقطة` : `${data.points || 0} points`;
      }

      // Show avatar image or initials
      updateProfileAvatar(data.avatar_url, data.avatar_initials || data.name.charAt(0));
    }
  } catch {}

  // Load orders + messages
  loadProfileOrders();
  loadProfileMessages();
}

function updateProfileAvatar(avatarUrl, initials) {
  const imgEl = $('prof-avatar-img');
  const textEl = $('prof-avatar-text');
  const headerAvatar = $('profile-avatar-circle');

  if (avatarUrl) {
    if (imgEl) { imgEl.src = avatarUrl; imgEl.style.display = 'block'; }
    if (textEl) textEl.style.display = 'none';
    if (headerAvatar) { headerAvatar.innerHTML = `<img src="${avatarUrl}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`; }
  } else {
    if (imgEl) imgEl.style.display = 'none';
    if (textEl) { textEl.style.display = ''; textEl.textContent = initials || 'م'; }
    if (headerAvatar) { headerAvatar.textContent = initials || 'م'; }
  }
}

async function loadProfileOrders() {
  try {
    const res = await apiFetch('/api/profile/orders');
    if (!res) return;
    const orders = await res.json();
    const tbody = $('profile-orders-tbody');
    if (!tbody) return;
    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:3rem">${t('noOrders')}</td></tr>`;
      return;
    }
    tbody.innerHTML = '';
    orders.forEach(o => {
      const itemCount = Array.isArray(o.items) ? o.items.reduce((a, i) => a + i.qty, 0) : '—';
      const tr = document.createElement('tr');
      
      let actionHtml = '—';
      if (o.status === 'تم الشحن' || o.status === 'Shipped') {
        actionHtml = `<button class="btn primary-btn btn-xs return-order-btn" style="padding:0.4rem 1rem;font-size:1.15rem" data-id="${o.id}">${currentLang === 'ar' ? 'استرجاع المنتج' : 'Return Order'}</button>`;
      } else if (o.status === 'طلب استرجاع') {
        actionHtml = `<span style="color:var(--gold);font-weight:700;font-size:1.25rem">${currentLang === 'ar' ? 'انتظار المراجعة' : 'Return Pending'}</span>`;
      } else if (o.status === 'تم الاسترجاع') {
        actionHtml = `<span style="color:var(--green);font-weight:700;font-size:1.25rem">${currentLang === 'ar' ? 'تم الاسترجاع (+نقاط)' : 'Returned (+Points)'}</span>`;
      }

      tr.innerHTML = `
        <td style="font-weight:700;color:var(--accent)">${o.order_id}</td>
        <td>${formatDate(o.created_at)}</td>
        <td>${itemCount} ${currentLang === 'ar' ? 'قطعة' : 'items'}</td>
        <td style="color:var(--cyan);font-weight:800">${formatCurrency(o.total)}</td>
        <td><span class="status-badge ${statusBadgeClass(o.status)}">${o.status}</span></td>
        <td>${actionHtml}</td>
      `;
      tbody.appendChild(tr);
    });

    // Attach return click handlers
    tbody.querySelectorAll('.return-order-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const orderDbId = btn.getAttribute('data-id');
        if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من رغبتك في استرجاع هذا الطلب؟ سيتم قيد المبلغ كنقاط في حسابك فور موافقة الإدارة.' : 'Are you sure you want to return this order? The amount will be added to your points balance upon admin approval.')) return;
        
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
        try {
          const retRes = await apiFetch(`/api/profile/orders/${orderDbId}/return`, { method: 'POST' });
          if (!retRes) return;
          const retData = await retRes.json();
          if (retData.success) {
            showToast(currentLang === 'ar' ? 'تم تقديم طلب الاسترجاع بنجاح ✓' : 'Return request submitted successfully ✓');
            loadProfileData(); // Reload profile and orders
          } else {
            showToast(retData.error || 'Request failed', 'error');
            btn.disabled = false;
            btn.textContent = currentLang === 'ar' ? 'استرجاع المنتج' : 'Return Order';
          }
        } catch {
          showToast(currentLang === 'ar' ? 'خطأ في الاتصال' : 'Connection error', 'error');
          btn.disabled = false;
          btn.textContent = currentLang === 'ar' ? 'استرجاع المنتج' : 'Return Order';
        }
      });
    });
  } catch {}
}

async function handleProfileUpdate(e) {
  e.preventDefault();
  const name = $('prof-name').value.trim();
  const phone = $('prof-phone').value.trim();
  const address = $('prof-address').value.trim();
  const avatarUrl = $('prof-avatar-url')?.value.trim() || null;
  if (!name) { showToast(currentLang === 'ar' ? 'الاسم مطلوب' : 'Name is required', 'error'); return; }

  try {
    const res = await apiFetch('/api/profile', {
      method: 'PUT',
      body: JSON.stringify({ name, phone, address, avatarUrl })
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      currentUser.name = name;
      currentUser.avatarInitials = data.avatarInitials;
      currentUser.avatarUrl = data.avatarUrl;
      localStorage.setItem('madar_user', JSON.stringify(currentUser));
      updateAuthUI();
      if ($('profile-name-display')) $('profile-name-display').textContent = name;
      updateProfileAvatar(data.avatarUrl, data.avatarInitials);
      showToast(currentLang === 'ar' ? 'تم حفظ البيانات ✓' : 'Profile saved ✓');
    } else showToast(data.error, 'error');
  } catch { showToast(currentLang === 'ar' ? 'خطأ في الاتصال' : 'Connection error', 'error'); }
}

// ─── AVATAR UPLOAD ────────────────────────────────────────────────────────────
async function handleAvatarUpload(fileInput) {
  const file = fileInput.files[0];
  if (!file) return;

  if (file.size > 2 * 1024 * 1024) {
    showToast(currentLang === 'ar' ? 'حجم الصورة يجب أن يكون أقل من 2 ميجابايت' : 'Image must be under 2MB', 'error');
    return;
  }

  const statusEl = $('prof-avatar-upload-status');
  if (statusEl) statusEl.textContent = currentLang === 'ar' ? 'جاري الرفع...' : 'Uploading...';

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/profile/upload-avatar', {
      method: 'POST',
      headers: { 'x-auth-token': authToken || '' },
      body: formData
    });
    if (res.status === 401) {
      authToken = null; currentUser = null;
      localStorage.removeItem('madar_token'); localStorage.removeItem('madar_user');
      updateAuthUI();
      showToast(currentLang === 'ar' ? 'انتهت جلستك — سجّل الدخول مجدداً' : 'Session expired', 'error');
      openModal('account-modal');
      return;
    }
    const data = await res.json();
    if (data.success) {
      // Update hidden input and preview
      if ($('prof-avatar-url')) $('prof-avatar-url').value = data.filePath;
      updateProfileAvatar(data.filePath, currentUser?.avatarInitials || 'م');
      if (statusEl) statusEl.textContent = currentLang === 'ar' ? '✓ تم رفع الصورة بنجاح' : '✓ Uploaded successfully';
      showToast(currentLang === 'ar' ? 'تم رفع الصورة — اضغط حفظ التغييرات لتأكيدها' : 'Image uploaded — click Save to confirm', 'success');
    } else {
      if (statusEl) statusEl.textContent = '✗ ' + (data.error || 'Upload failed');
      showToast(data.error || 'Upload failed', 'error');
    }
  } catch {
    if (statusEl) statusEl.textContent = '✗ ' + (currentLang === 'ar' ? 'خطأ' : 'Error');
    showToast(currentLang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Connection error', 'error');
  }
}

// ─── PROFILE: SUPPORT MESSAGES ────────────────────────────────────────────────
async function loadProfileMessages() {
  try {
    const res = await apiFetch('/api/profile/messages');
    if (!res) return;
    const msgs = await res.json();
    const tbody = $('profile-messages-tbody');
    if (!tbody) return;

    if (!msgs.length) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:var(--text-muted);padding:3rem">${t('noMessages')}</td></tr>`;
      return;
    }

    tbody.innerHTML = '';
    msgs.forEach(m => {
      const isReplied = m.status === 'تم الرد';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700">${m.subject || '—'}</td>
        <td style="font-size:1.35rem;max-width:240px;white-space:normal;line-height:1.5">${m.message}</td>
        <td>
          <span class="status-badge ${isReplied ? 'status-shipped' : 'status-pending'}">${m.status || (currentLang === 'ar' ? 'قيد الانتظار' : 'Pending')}</span>
        </td>
        <td style="font-size:1.3rem;color:${isReplied ? 'var(--green)' : 'var(--text-muted)'}">
          ${m.reply_text ? `<i class="fa-solid fa-reply" style="margin-inline-end:0.4rem"></i>${m.reply_text}` : `<em>${t('noReplyYet')}</em>`}
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch {}
}

async function handleChangePassword(e) {
  e.preventDefault();
  const curr = $('curr-pass').value;
  const newPass = $('new-pass').value;
  const confirm = $('confirm-pass').value;
  if (!curr || !newPass || !confirm) { showToast(currentLang === 'ar' ? 'جميع الحقول مطلوبة' : 'All fields required', 'error'); return; }
  if (newPass !== confirm) { showToast(currentLang === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match', 'error'); return; }
  if (newPass.length < 6) { showToast(currentLang === 'ar' ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Min 6 characters', 'error'); return; }

  try {
    const res = await apiFetch('/api/profile/password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword: curr, newPassword: newPass })
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      showToast(currentLang === 'ar' ? 'تم تغيير كلمة المرور بنجاح ✓' : 'Password changed ✓');
      $('change-password-form').reset();
    } else showToast(data.error, 'error');
  } catch { showToast(currentLang === 'ar' ? 'خطأ في الاتصال' : 'Connection error', 'error'); }
}

// ─── PASSWORD STRENGTH ────────────────────────────────────────────────────────
function checkPasswordStrength(pass) {
  let score = 0;
  if (pass.length >= 6) score++;
  if (pass.length >= 10) score++;
  if (/[A-Z]/.test(pass) || /[0-9]/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;

  const segments = [1, 2, 3, 4].map(i => document.getElementById(`s${i}`));
  const label = $('strength-label');
  const labels = [t('passWeak'), t('passFair'), t('passGood'), t('passStrong')];

  segments.forEach((seg, i) => {
    seg.className = `strength-bar-segment${i < score ? ` filled-${score}` : ''}`;
  });
  if (label) label.textContent = pass.length > 0 ? labels[Math.max(0, score - 1)] : '';
}

// ─── ADMIN PANEL ──────────────────────────────────────────────────────────────
async function loadAdminData() {
  await Promise.all([loadAdminStats(), loadAdminOrders(), loadAdminProducts(), loadAdminUsers(), loadAdminCMS(), loadAdminMessages(), loadAdminAnnouncements(), loadAdminNotifications()]);
}

async function loadAdminStats() {
  try {
    const res = await apiFetch('/api/admin/stats');
    if (!res) return;
    const s = await res.json();
    if ($('stat-revenue')) $('stat-revenue').textContent = formatCurrency(s.revenue);
    if ($('stat-orders')) $('stat-orders').textContent = s.totalOrders;
    if ($('stat-products')) $('stat-products').textContent = s.totalProducts;
    if ($('stat-customers')) $('stat-customers').textContent = s.totalCustomers;
  } catch {}
}

async function loadAdminOrders() {
  try {
    const res = await apiFetch('/api/admin/orders');
    if (!res) return;
    const orders = await res.json();
    const tbody = $('admin-orders-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    const statusOptions = ['قيد الانتظار','قيد التجهيز','تم الشحن','ملغي','طلب استرجاع','تم الاسترجاع'];

    if (!orders.length) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align:center;color:var(--text-muted);padding:3rem">${currentLang === 'ar' ? 'لا توجد طلبات' : 'No orders yet'}</td></tr>`;
      return;
    }
    orders.forEach(o => {
      const itemCount = Array.isArray(o.items) ? o.items.reduce((a, i) => a + (i.qty || 1), 0) : 1;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;color:var(--accent)">${o.order_id}</td>
        <td>${o.user_name || (currentLang === 'ar' ? 'ضيف' : 'Guest')}</td>
        <td>
          <div style="font-size:0.9em;line-height:1.4">
            <strong>${o.customer_name || ''}</strong><br>
            <span style="color:var(--text-muted)">${o.customer_phone || ''}</span><br>
            <span>${o.customer_city || ''} - ${o.customer_address || ''}</span>
          </div>
        </td>
        <td>${itemCount} ${currentLang === 'ar' ? 'قطعة' : 'items'}</td>
        <td style="color:var(--cyan);font-weight:800">${formatCurrency(o.total)}</td>
        <td>${formatDate(o.created_at)}</td>
        <td>
          <select class="status-select" data-order-id="${o.id}">
            ${statusOptions.map(s => `<option value="${s}" ${o.status === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.addEventListener('change', async e => {
      if (e.target.classList.contains('status-select')) {
        const id = e.target.dataset.orderId;
        await fetch(`/api/admin/orders/${id}`, {
          method: 'PUT', headers: apiHeaders(),
          body: JSON.stringify({ status: e.target.value })
        });
        showToast(currentLang === 'ar' ? 'تم تحديث حالة الطلب' : 'Order status updated');
        loadAdminStats();
      }
    });
  } catch {}
}

async function loadAdminProducts() {
  try {
    const res = await fetch('/api/products', { headers: apiHeaders() });
    const prods = await res.json();
    products = prods;
    const tbody = $('admin-products-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    prods.forEach(p => {
      const name = currentLang === 'ar' ? p.nameAr : p.nameEn;
      const category = currentLang === 'ar' ? p.categoryAr : p.categoryEn;
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><img src="${p.images[0]}" class="admin-table-img" alt="${name}"></td>
        <td style="font-weight:700;color:#fff">${name}</td>
        <td>${category}</td>
        <td style="font-weight:700;color:var(--cyan)">${formatCurrency(p.price)}</td>
        <td>
          <div style="display:flex;gap:0.8rem">
            <button class="btn secondary-btn btn-sm edit-product-btn" data-id="${p.id}" data-i18n="editProduct">${t('editProduct')}</button>
            <button class="btn danger-btn btn-sm delete-product-btn" data-id="${p.id}" data-i18n="deleteProduct">${t('deleteProduct')}</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.addEventListener('click', e => {
      const editBtn = e.target.closest('.edit-product-btn');
      const delBtn = e.target.closest('.delete-product-btn');
      if (editBtn) openProductForm(prods.find(p => p.id == editBtn.dataset.id));
      if (delBtn) deleteProduct(delBtn.dataset.id);
    });
  } catch {}
}

async function loadAdminUsers() {
  try {
    const res = await apiFetch('/api/admin/users');
    if (!res) return;
    const users = await res.json();
    const tbody = $('admin-users-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';
    users.forEach(u => {
      const tr = document.createElement('tr');
      const isAdmin = u.role === 'admin';
      const roleLabel = isAdmin ? (currentLang === 'ar' ? 'مدير' : 'Admin') : (currentLang === 'ar' ? 'عميل' : 'Customer');
      tr.innerHTML = `
        <td style="color:var(--text-muted)">#${u.id}</td>
        <td style="font-weight:700;color:#fff">${u.name}</td>
        <td style="color:var(--text-muted)">${u.email}</td>
        <td><span class="status-badge ${isAdmin ? 'status-shipped' : 'status-pending'}">${roleLabel}</span></td>
        <td>${formatDate(u.created_at)}</td>
        <td>
          <div style="display:flex;gap:0.8rem;flex-wrap:wrap">
            <button class="btn secondary-btn btn-sm toggle-role-btn" data-id="${u.id}" data-role="${u.role}">
              ${isAdmin ? t('makeCustomer') : t('makeAdmin')}
            </button>
            <button class="btn outline-btn btn-sm reset-pass-btn" data-id="${u.id}" data-name="${u.name}">
              ${t('resetPassword')}
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.addEventListener('click', async e => {
      const roleBtn = e.target.closest('.toggle-role-btn');
      const resetBtn = e.target.closest('.reset-pass-btn');
      if (roleBtn) {
        const newRole = roleBtn.dataset.role === 'admin' ? 'customer' : 'admin';
        const res = await apiFetch(`/api/admin/users/${roleBtn.dataset.id}/role`, {
          method: 'PUT', body: JSON.stringify({ role: newRole })
        });
        if (!res) return;
        const data = await res.json();
        if (data.success) { showToast(data.message); loadAdminUsers(); loadAdminStats(); }
        else showToast(data.error, 'error');
      }
      if (resetBtn) {
        const newPass = prompt(`${t('resetPassword')} - ${resetBtn.dataset.name}\n${currentLang === 'ar' ? 'أدخل كلمة المرور الجديدة:' : 'Enter new password:'}`);
        if (!newPass) return;
        const res = await apiFetch(`/api/admin/users/${resetBtn.dataset.id}/password`, {
          method: 'PUT', body: JSON.stringify({ newPassword: newPass })
        });
        if (!res) return;
        const data = await res.json();
        if (data.success) showToast(data.message);
        else showToast(data.error, 'error');
      }
    });
  } catch {}
}

async function loadAdminCMS() {
  try {
    const res = await apiFetch('/api/admin/content');
    if (!res) return;
    const contentList = await res.json();
    const container = $('admin-cms-list');
    if (!container) return;
    container.innerHTML = '';

    // Group contentList by section
    const sections = {};
    contentList.forEach(item => {
      if (!sections[item.section]) sections[item.section] = [];
      sections[item.section].push(item);
    });

    for (const secName in sections) {
      const secDiv = document.createElement('div');
      secDiv.className = 'cms-section-group';
      secDiv.innerHTML = `
        <h3 class="cms-section-title"><i class="fa-solid fa-pen-to-square"></i> ${secName}</h3>
      `;
      sections[secName].forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cms-item';
        itemDiv.innerHTML = `
          <div><span class="cms-key-label">${item.key_name}</span></div>
          <div>
            <textarea class="cms-text-input" dir="rtl" data-key="${item.key_name}" data-lang="ar" placeholder="المحتوى بالعربية...">${item.value_ar || ''}</textarea>
          </div>
          <div>
            <textarea class="cms-text-input" dir="ltr" data-key="${item.key_name}" data-lang="en" placeholder="English content...">${item.value_en || ''}</textarea>
          </div>
          <div>
            <button class="cms-save-btn" data-key="${item.key_name}"><i class="fa-regular fa-floppy-disk"></i> ${currentLang === 'ar' ? 'حفظ' : 'Save'}</button>
          </div>
        `;
        // Save handler
        itemDiv.querySelector('.cms-save-btn').addEventListener('click', async () => {
          const valueAr = itemDiv.querySelector('[data-lang="ar"]').value.trim();
          const valueEn = itemDiv.querySelector('[data-lang="en"]').value.trim();
          const saveBtn = itemDiv.querySelector('.cms-save-btn');
          
          saveBtn.disabled = true;
          saveBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
          try {
            const upRes = await apiFetch(`/api/admin/content/${item.key_name}`, {
              method: 'PUT',
              body: JSON.stringify({ valueAr, valueEn })
            });
            if (!upRes) return;
            const upData = await upRes.json();
            if (upData.success) {
              showToast(currentLang === 'ar' ? 'تم الحفظ بنجاح ✓' : 'Content saved successfully ✓');
              // Update local translations dictionary
              translations.ar[item.key_name] = valueAr;
              translations.en[item.key_name] = valueEn;
              applyTranslations();
            } else {
              showToast(upData.error || 'Save failed', 'error');
            }
          } catch {
            showToast(currentLang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Connection error', 'error');
          } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = `<i class="fa-regular fa-floppy-disk"></i> ${currentLang === 'ar' ? 'حفظ' : 'Save'}`;
          }
        });
        secDiv.appendChild(itemDiv);
      });
      container.appendChild(secDiv);
    }
  } catch (e) {
    console.error('Failed to load admin CMS:', e);
  }
}

// ─── ANNOUNCEMENTS TICKER & CMS ──────────────────────────────────────────────
async function renderAnnouncements() {
  try {
    const res = await fetch('/api/announcements');
    const anns = await res.json();
    const ticker = $('ann-ticker');
    if (!ticker) return;
    if (!Array.isArray(anns) || anns.length === 0) {
      ticker.innerHTML = `
        <span data-i18n="ann1">${currentLang === 'ar' ? 'شحن مجاني للطلبات فوق 1500 جنيه' : 'Free shipping on orders over 1500 EGP'}</span>
        <span class="ticker-divider">✦</span>
        <span data-i18n="ann2">${currentLang === 'ar' ? 'مجموعات جديدة كل موسم' : 'New collections every season'}</span>
        <span class="ticker-divider">✦</span>
        <span data-i18n="ann3">${currentLang === 'ar' ? 'مصنوع في مصر بأعلى معايير الجودة' : 'Made in Egypt to highest quality'}</span>
        <span class="ticker-divider">✦</span>
      `;
      return;
    }
    let html = '';
    // Repeat to ensure marquee fills viewport width and animations slide smoothly
    const repeats = anns.length < 3 ? 4 : 2;
    for (let r = 0; r < repeats; r++) {
      anns.forEach(ann => {
        const text = currentLang === 'ar' ? ann.text_ar : ann.text_en;
        html += `<span>${text}</span><span class="ticker-divider">✦</span>`;
      });
    }
    ticker.innerHTML = html;
  } catch (err) {
    console.error('Error loading announcements ticker:', err);
  }
}

let editingAnnId = null;

async function loadAdminAnnouncements() {
  try {
    const res = await apiFetch('/api/admin/announcements');
    if (!res) return;
    const anns = await res.json();
    const tbody = $('admin-ann-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!res.ok || !Array.isArray(anns)) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--red);padding:3rem">${anns.error || 'Failed to load announcements'}</td></tr>`;
      return;
    }

    if (anns.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:3rem">${currentLang === 'ar' ? 'لا توجد إعلانات حالياً' : 'No announcements found'}</td></tr>`;
      return;
    }

    anns.forEach(ann => {
      const tr = document.createElement('tr');
      const activeText = ann.active ? (currentLang === 'ar' ? 'نشط' : 'Active') : (currentLang === 'ar' ? 'معطل' : 'Disabled');
      const activeClass = ann.active ? 'status-shipped' : 'status-pending';

      tr.innerHTML = `
        <td style="font-weight:600">${ann.text_ar}</td>
        <td>${ann.text_en}</td>
        <td style="text-align:center">${ann.order_num}</td>
        <td style="text-align:center">
          <span class="status-badge ${activeClass}">${activeText}</span>
        </td>
        <td>
          <div style="display:flex;gap:0.8rem">
            <button class="btn secondary-btn btn-sm edit-ann-btn" data-id="${ann.id}"><i class="fa-regular fa-edit"></i> ${currentLang === 'ar' ? 'تعديل' : 'Edit'}</button>
            <button class="btn danger-btn btn-sm delete-ann-btn" data-id="${ann.id}"><i class="fa-regular fa-trash-can"></i> ${currentLang === 'ar' ? 'حذف' : 'Delete'}</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Add event handlers to edit/delete buttons
    tbody.querySelectorAll('.edit-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        const ann = anns.find(x => x.id === id);
        if (ann) openAnnForm(ann);
      });
    });
    tbody.querySelectorAll('.delete-ann-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = parseInt(btn.dataset.id);
        if (confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا الإعلان؟' : 'Are you sure you want to delete this announcement?')) {
          deleteAnnouncement(id);
        }
      });
    });

  } catch (err) {
    console.error('Error loading admin announcements:', err);
  }
}

function openAnnForm(ann = null) {
  const formWrapper = $('ann-form-wrapper');
  const formTitle = $('ann-form-title');
  if (!formWrapper) return;

  if (ann) {
    editingAnnId = ann.id;
    if (formTitle) formTitle.textContent = currentLang === 'ar' ? 'تعديل الإعلان' : 'Edit Announcement';
    $('af-text-ar').value = ann.text_ar;
    $('af-text-en').value = ann.text_en;
    $('af-order').value = ann.order_num;
    $('af-active').checked = !!ann.active;
  } else {
    editingAnnId = null;
    if (formTitle) formTitle.textContent = currentLang === 'ar' ? 'إضافة إعلان جديد' : 'Add New Announcement';
    $('ann-form').reset();
    $('af-order').value = 0;
    $('af-active').checked = true;
  }
  formWrapper.classList.remove('hidden');
  formWrapper.scrollIntoView({ behavior: 'smooth' });
}

async function submitAnnForm(e) {
  e.preventDefault();
  const text_ar = $('af-text-ar').value.trim();
  const text_en = $('af-text-en').value.trim();
  const order_num = parseInt($('af-order').value) || 0;
  const active = $('af-active').checked ? 1 : 0;

  if (!text_ar || !text_en) {
    showToast(currentLang === 'ar' ? 'يرجى كتابة النص باللغتين' : 'Please provide text in both languages', 'error');
    return;
  }

  const url = editingAnnId ? `/api/admin/announcements/${editingAnnId}` : '/api/admin/announcements';
  const method = editingAnnId ? 'PUT' : 'POST';

  try {
    const res = await apiFetch(url, {
      method,
      body: JSON.stringify({ text_ar, text_en, order_num, active })
    });
    if (!res) return;
    const data = await res.json();
    if (res.ok) {
      showToast(currentLang === 'ar' ? 'تم حفظ الإعلان بنجاح' : 'Announcement saved successfully');
      $('ann-form-wrapper').classList.add('hidden');
      $('ann-form').reset();
      editingAnnId = null;
      loadAdminAnnouncements();
      renderAnnouncements();
    } else {
      showToast(data.error || 'Failed to save announcement', 'error');
    }
  } catch (err) {
    showToast(currentLang === 'ar' ? 'حدث خطأ بالاتصال' : 'Connection error', 'error');
  }
}

async function deleteAnnouncement(id) {
  try {
    const res = await apiFetch(`/api/admin/announcements/${id}`, {
      method: 'DELETE'
    });
    if (!res) return;
    const data = await res.json();
    if (res.ok) {
      showToast(currentLang === 'ar' ? 'تم الحذف بنجاح' : 'Announcement deleted successfully');
      loadAdminAnnouncements();
      renderAnnouncements();
    } else {
      showToast(data.error || 'Failed to delete announcement', 'error');
    }
  } catch (err) {
    showToast(currentLang === 'ar' ? 'حدث خطأ بالاتصال' : 'Connection error', 'error');
  }
}

async function loadAdminMessages() {
  try {
    const res = await apiFetch('/api/admin/messages');
    if (!res) return;
    const msgs = await res.json();
    const tbody = $('admin-messages-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!res.ok || !Array.isArray(msgs)) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--red);padding:3rem">${msgs.error || 'Failed to load messages'}</td></tr>`;
      return;
    }

    if (!msgs.length) {
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:var(--text-muted);padding:3rem">${currentLang === 'ar' ? 'لا توجد رسائل واردة' : 'No messages found'}</td></tr>`;
      return;
    }

    msgs.forEach(m => {
      const isReplied = m.status === 'تم الرد';
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="font-weight:700;color:#fff">${m.name}</td>
        <td style="color:var(--text-muted)">${m.email}</td>
        <td style="font-weight:700">${m.subject || '—'}</td>
        <td style="font-size:1.35rem;line-height:1.5;max-width:240px;white-space:normal">${m.message}</td>
        <td>
          <span class="status-badge ${isReplied ? 'status-shipped' : 'status-pending'}">${currentLang === 'ar' ? m.status : (isReplied ? 'Replied' : 'Pending')}</span>
          ${m.reply_text ? `<div style="font-size:1.2rem;color:var(--accent);margin-top:0.4rem;max-width:200px;white-space:normal"><strong>الرد:</strong> ${m.reply_text}</div>` : ''}
        </td>
        <td>
          <button class="btn secondary-btn btn-sm reply-btn" data-id="${m.id}" data-message="${m.message.replace(/"/g, '&quot;')}" ${isReplied ? 'disabled' : ''}>
            <i class="fa-solid fa-reply"></i> ${currentLang === 'ar' ? 'رد' : 'Reply'}
          </button>
        </td>
      `;
      tbody.appendChild(tr);
    });

    tbody.addEventListener('click', e => {
      const replyBtn = e.target.closest('.reply-btn');
      if (replyBtn) {
        const id = replyBtn.dataset.id;
        const msgText = replyBtn.dataset.message;
        openReplyModal(id, msgText);
      }
    });
  } catch {}
}

let activeReplyMessageId = null;
function openReplyModal(id, msgText) {
  activeReplyMessageId = id;
  const origEl = $('reply-orig-message');
  if (origEl) origEl.textContent = msgText;
  const textarea = $('reply-textarea');
  if (textarea) textarea.value = '';
  openModal('reply-modal');
}

async function submitReply() {
  const replyText = $('reply-textarea')?.value.trim();
  if (!replyText || !activeReplyMessageId) {
    showToast(currentLang === 'ar' ? 'اكتب الرد أولاً' : 'Write a reply first', 'error');
    return;
  }

  const submitBtn = $('reply-submit-btn');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  }

  try {
    const res = await apiFetch(`/api/admin/messages/${activeReplyMessageId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyText })
    });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      showToast(data.message);
      closeModal('reply-modal');
      loadAdminMessages();
    } else {
      showToast(data.error || 'Failed to send reply', 'error');
    }
  } catch {
    showToast(currentLang === 'ar' ? 'خطأ في الاتصال' : 'Connection error', 'error');
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = currentLang === 'ar' ? 'إرسال الرد' : 'Send';
    }
  }
}

// ─── ADMIN: Notifications ─────────────────────────────────────────────────────
async function checkUnreadNotifications() {
  if (!currentUser || currentUser.role !== 'admin' || !authToken) return;
  try {
    const res = await apiFetch('/api/admin/notifications/unread-count');
    if (!res) return;
    const data = await res.json();
    const count = data.count || 0;
    
    const headerDot = $('header-admin-notif-dot');
    const tabDot = $('tab-admin-notif-dot');
    
    if (headerDot) headerDot.style.display = count > 0 ? 'block' : 'none';
    if (tabDot) tabDot.style.display = count > 0 ? 'block' : 'none';
  } catch (err) {
    console.error('Error checking unread notifications:', err);
  }
}

async function loadAdminNotifications() {
  try {
    const res = await apiFetch('/api/admin/notifications');
    if (!res) return;
    const notifs = await res.json();
    const tbody = $('admin-notifs-tbody');
    if (!tbody) return;
    tbody.innerHTML = '';

    if (!Array.isArray(notifs)) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--red);padding:3rem">Failed to load notifications</td></tr>`;
      return;
    }

    if (!notifs.length) {
      tbody.innerHTML = `<tr><td colspan="3" style="text-align:center;color:var(--text-muted);padding:3rem">${currentLang === 'ar' ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}</td></tr>`;
      return;
    }

    notifs.forEach(n => {
      const title = currentLang === 'ar' ? n.title_ar : n.title_en;
      const msg = currentLang === 'ar' ? n.message_ar : n.message_en;
      const date = formatDate(n.created_at);
      
      const tr = document.createElement('tr');
      if (n.is_read === 0) {
        tr.style.background = 'rgba(75,63,53,0.04)';
      }
      
      tr.innerHTML = `
        <td>
          <div style="font-weight:700;color:var(--accent);font-size:1.4rem;display:flex;align-items:center;gap:0.8rem">
            ${n.is_read === 0 ? '<span style="width:6px;height:6px;background:var(--red);border-radius:50%"></span>' : ''}
            ${title}
          </div>
          <div style="font-size:1.3rem;color:var(--text-muted);margin-top:0.4rem">${msg}</div>
        </td>
        <td style="font-size:1.25rem">${date}</td>
        <td>
          <div style="display:flex;gap:0.8rem">
            <button class="btn primary-btn btn-sm view-notif-btn" data-target="${n.target_id || ''}" data-id="${n.id}">
              ${currentLang === 'ar' ? 'عرض الطلب' : 'View Order'}
            </button>
            ${n.is_read === 0 ? `
              <button class="btn secondary-btn btn-sm read-notif-btn" data-id="${n.id}">
                ${currentLang === 'ar' ? 'مقروء' : 'Read'}
              </button>
            ` : ''}
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });

    // Attach button listeners
    tbody.querySelectorAll('.read-notif-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        btn.disabled = true;
        await apiFetch(`/api/admin/notifications/${id}/read`, { method: 'PUT' });
        loadAdminNotifications();
        checkUnreadNotifications();
      });
    });

    tbody.querySelectorAll('.view-notif-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.getAttribute('data-id');
        const target = btn.getAttribute('data-target');
        // Mark as read first
        await apiFetch(`/api/admin/notifications/${id}/read`, { method: 'PUT' });
        
        // Switch to Orders tab
        const ordersTabBtn = document.querySelector('[data-admin-tab="orders"]');
        if (ordersTabBtn) ordersTabBtn.click();
        
        // Highlight or filter by that order_id
        const orderSearchInput = $('admin-order-search') || document.querySelector('.admin-orders-table input') || null;
        if (orderSearchInput) {
          orderSearchInput.value = target;
          orderSearchInput.dispatchEvent(new Event('input'));
        }
        
        checkUnreadNotifications();
      });
    });

  } catch (err) {
    console.error('Failed to load notifications:', err);
  }
}

async function markAllNotificationsRead() {
  try {
    const res = await apiFetch('/api/admin/notifications/read-all', { method: 'PUT' });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      loadAdminNotifications();
      checkUnreadNotifications();
      showToast(currentLang === 'ar' ? 'تم تحديد الكل كمقروء' : 'All marked as read');
    }
  } catch {}
}

async function uploadImageFile(fileInput, textInput, labelElement) {
  const file = fileInput.files[0];
  if (!file) return;

  if (labelElement) labelElement.textContent = currentLang === 'ar' ? 'جاري الرفع...' : 'Uploading...';

  const formData = new FormData();
  formData.append('image', file);

  try {
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'x-auth-token': authToken || '' },
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      textInput.value = data.filePath;
      if (labelElement) labelElement.textContent = '✓ ' + (currentLang === 'ar' ? 'تم الرفع' : 'Uploaded');
      showToast(currentLang === 'ar' ? 'تم رفع الصورة بنجاح ✓' : 'Image uploaded successfully ✓');
    } else {
      if (labelElement) labelElement.textContent = '✗ ' + (currentLang === 'ar' ? 'فشل الرفع' : 'Failed');
      showToast(data.error || 'Upload failed', 'error');
    }
  } catch {
    if (labelElement) labelElement.textContent = '✗ ' + (currentLang === 'ar' ? 'خطأ' : 'Error');
    showToast(currentLang === 'ar' ? 'خطأ في الاتصال بالخادم' : 'Connection error', 'error');
  }
}

function openProductForm(product = null) {
  editingProductId = product?.id || null;
  const wrapper = $('product-form-wrapper');
  const titleEl = $('product-form-title');
  if (!wrapper) return;
  wrapper.classList.remove('hidden');
  if (titleEl) titleEl.textContent = product ? t('editProduct') : t('addProduct');

  if (product) {
    $('pf-name-en').value = product.nameEn || '';
    $('pf-name-ar').value = product.nameAr || '';
    $('pf-price').value = product.price || '';
    $('pf-original-price').value = product.originalPrice || '';
    $('pf-category-ar').value = product.categoryAr || 'تيشرتات';
    $('pf-category-en').value = product.categoryEn || 'T-Shirts';
    $('pf-badge-en').value = product.badgeEn || '';
    $('pf-badge-ar').value = product.badgeAr || '';
    $('pf-img-primary').value = product.images?.[0] || '';
    $('pf-img-secondary').value = product.images?.[1] || '';
    $('pf-desc-en').value = product.descriptionEn || '';
    $('pf-desc-ar').value = product.descriptionAr || '';
  } else {
    $('product-form').reset();
  }

  wrapper.scrollIntoView({ behavior: 'smooth' });
}

async function submitProductForm(e) {
  e.preventDefault();
  const body = {
    nameEn: $('pf-name-en').value.trim(),
    nameAr: $('pf-name-ar').value.trim(),
    price: parseFloat($('pf-price').value),
    originalPrice: parseFloat($('pf-original-price').value) || parseFloat($('pf-price').value),
    categoryAr: $('pf-category-ar').value,
    categoryEn: $('pf-category-en').value,
    badgeEn: $('pf-badge-en').value.trim() || null,
    badgeAr: $('pf-badge-ar').value.trim() || null,
    imagePrimary: $('pf-img-primary').value.trim(),
    imageSecondary: $('pf-img-secondary').value.trim() || null,
    descriptionEn: $('pf-desc-en').value.trim(),
    descriptionAr: $('pf-desc-ar').value.trim(),
    sizes: ["M","L","XL","2XL"], lowStock: false
  };

  const isEdit = !!editingProductId;
  const url = isEdit ? `/api/admin/products/${editingProductId}` : '/api/admin/products';
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await apiFetch(url, { method, body: JSON.stringify(body) });
    if (!res) return;
    const data = await res.json();
    if (data.success) {
      $('product-form-wrapper').classList.add('hidden');
      $('product-form').reset();
      editingProductId = null;
      showToast(isEdit ? (currentLang === 'ar' ? 'تم تحديث المنتج ✓' : 'Product updated ✓') : (currentLang === 'ar' ? 'تم إضافة المنتج ✓' : 'Product added ✓'));
      await loadAdminProducts();
      await loadAdminStats();
    } else showToast(data.error, 'error');
  } catch { showToast(currentLang === 'ar' ? 'خطأ في الحفظ' : 'Save error', 'error'); }
}

async function deleteProduct(id) {
  if (!confirm(currentLang === 'ar' ? 'هل أنت متأكد من حذف هذا المنتج؟' : 'Delete this product?')) return;
  try {
    const res = await apiFetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    if (!res) return;
    const data = await res.json();
    if (data.success) { showToast(currentLang === 'ar' ? 'تم حذف المنتج' : 'Product deleted'); loadAdminProducts(); loadAdminStats(); }
    else showToast(data.error, 'error');
  } catch { showToast(currentLang === 'ar' ? 'خطأ في الحفظ' : 'Delete error', 'error'); }
}

// ─── MODALS & DRAWERS ─────────────────────────────────────────────────────────
function openModal(id) { $(id)?.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { $(id)?.classList.remove('active'); document.body.style.overflow = ''; }
function openDrawer(id) { $(id)?.classList.add('active'); document.body.style.overflow = 'hidden'; }
function closeDrawer(id) { $(id)?.classList.remove('active'); document.body.style.overflow = ''; }
function openSearchOverlay() { $('search-overlay')?.classList.add('active'); $('search-input')?.focus(); }
function closeSearchOverlay() { $('search-overlay')?.classList.remove('active'); if ($('search-input')) $('search-input').value = ''; if ($('search-results')) $('search-results').innerHTML = ''; }

// ─── FILTERS ──────────────────────────────────────────────────────────────────
function setupFilters() {
  const slider = $('price-range-slider');
  const priceVal = $('price-range-val');
  if (slider) slider.addEventListener('input', () => {
    filterState.maxPrice = parseInt(slider.value);
    if (priceVal) priceVal.textContent = `${slider.value} ${currentLang === 'ar' ? 'جنيه' : 'EGP'}`;
  });

  $$('.size-filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.toggle('active');
      const s = btn.dataset.size;
      if (filterState.sizes.includes(s)) filterState.sizes = filterState.sizes.filter(x => x !== s);
      else filterState.sizes.push(s);
    });
  });

  $('apply-filters-btn')?.addEventListener('click', () => { filterState.sort = $('sort-select').value; closeDrawer('filter-drawer'); renderShopProducts(); });
  $('clear-filters-btn')?.addEventListener('click', () => {
    filterState = { sort: 'default', categories: [], sizes: [], maxPrice: 2000 };
    $$('.size-filter-btn').forEach(b => b.classList.remove('active'));
    $$('#category-filter-list input').forEach(cb => cb.checked = false);
    if (slider) slider.value = 2000;
    if (priceVal) priceVal.textContent = `2000 ${currentLang === 'ar' ? 'جنيه' : 'EGP'}`;
    if ($('sort-select')) $('sort-select').value = 'default';
  });
}

// ─── COLLECTION CARDS ─────────────────────────────────────────────────────────
function setupCollectionCards() {
  $$('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
      const catAr = card.dataset.cat;
      const catEn = card.dataset.catEn;
      filterState.categories = [catAr, catEn];
      navigate('shop');
    });
  });
}

function setupAdminTabs() {
  $$('.admin-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.admin-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tab = btn.dataset.adminTab;
      $$('[id^="admin-tab-"]').forEach(p => p.classList.add('hidden'));
      $(`admin-tab-${tab}`)?.classList.remove('hidden');
      if (tab === 'notifications') {
        loadAdminNotifications();
      }
    });
  });
  $('admin-clear-notifs-btn')?.addEventListener('click', markAllNotificationsRead);
}

// ─── PROFILE TABS ─────────────────────────────────────────────────────────────
function setupProfileTabs() {
  $$('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.profile-tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      $$('.profile-tab-panel').forEach(p => p.classList.remove('active'));
      $(`profile-tab-${btn.dataset.tab}`)?.classList.add('active');
    });
  });
}

// ─── CONTACT FORM ─────────────────────────────────────────────────────────────
function setupContactForm() {
  $('contact-form')?.addEventListener('submit', async e => {
    e.preventDefault();
    const name = $('cf-name').value.trim();
    const email = $('cf-email').value.trim();
    const subject = $('cf-subject').value.trim();
    const message = $('cf-message').value.trim();
    if (!name || !email || !message) return;

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      if (data.success) {
        const wrapper = $('contact-form-wrapper');
        if (wrapper) wrapper.innerHTML = `
          <div class="contact-success-alert">
            <div class="success-icon-circle"><i class="fa-solid fa-paper-plane"></i></div>
            <h3 data-i18n="orderSuccess">${currentLang === 'ar' ? 'تم الإرسال!' : 'Message Sent!'}</h3>
            <p>${currentLang === 'ar' ? 'شكراً لتواصلك معنا. تم حفظ رسالتك وسيرد عليك الإدارة قريباً.' : 'Thank you! Your message has been saved, we will reply soon.'}</p>
            <button class="btn primary-btn" onclick="window.location.hash='contact'">${t('continueShopping')}</button>
          </div>`;
      } else {
        showToast(data.error || 'Failed to send message', 'error');
      }
    } catch {
      showToast(currentLang === 'ar' ? 'خطأ في الاتصال' : 'Connection error', 'error');
    }
  });
}

// ─── NEWSLETTER ───────────────────────────────────────────────────────────────
function setupNewsletter() {
  $('newsletter-btn')?.addEventListener('click', () => {
    const input = $('newsletter-input');
    if (input?.value) { input.value = ''; $('newsletter-msg')?.classList.remove('hidden'); }
  });
}

// ─── ACCOUNT MODAL TABS ───────────────────────────────────────────────────────
function setupAccountTabs() {
  $('login-tab-btn')?.addEventListener('click', () => {
    $('login-tab-btn').classList.add('active');
    $('register-tab-btn').classList.remove('active');
    $('login-form-panel').classList.remove('hidden');
    $('register-form-panel').classList.add('hidden');
  });
  $('register-tab-btn')?.addEventListener('click', () => {
    $('register-tab-btn').classList.add('active');
    $('login-tab-btn').classList.remove('active');
    $('register-form-panel').classList.remove('hidden');
    $('login-form-panel').classList.add('hidden');
  });
}

// ─── ACCORDION ────────────────────────────────────────────────────────────────
function setupAccordions() {
  $$('.accordion-trigger, .accordion-header').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const content = trigger.nextElementSibling;
      if (content) content.classList.toggle('show');
      const icon = trigger.querySelector('.fa-chevron-down');
      if (icon) icon.style.transform = content?.classList.contains('show') ? 'rotate(180deg)' : '';
    });
  });
}

// ─── MAIN INIT ────────────────────────────────────────────────────────────────
async function init() {
  // Load CMS content and then apply translations
  await fetchCMSContent();
  applyTranslations();

  // Router: read hash
  const hash = window.location.hash.replace('#', '') || 'home';
  navigate(hash);

  // Auth state
  if (authToken && currentUser) {
    updateAuthUI();
    if (currentUser.role === 'admin') {
      checkUnreadNotifications();
      setInterval(checkUnreadNotifications, 30000); // Check every 30s
    }
  }

  // ── Header Actions ──
  $('lang-toggle-btn')?.addEventListener('click', () => {
    currentLang = currentLang === 'ar' ? 'en' : 'ar';
    localStorage.setItem('madar_lang', currentLang);
    applyTranslations();
    if (currentRoute === 'shop') renderShopProducts();
    else if (currentRoute === 'home') loadHomeProducts();
    else if (currentRoute === 'admin') loadAdminData();
    buildCategoryFilters();
    renderCartDrawer();
    renderWishlistDrawer();
  });
  $('mobile-lang-toggle')?.addEventListener('click', () => $('lang-toggle-btn')?.click());

  $('cart-toggle-btn')?.addEventListener('click', () => { renderCartDrawer(); openDrawer('cart-drawer'); });
  $('wishlist-toggle-btn')?.addEventListener('click', () => { renderWishlistDrawer(); openDrawer('wishlist-drawer'); });
  $('search-toggle-btn')?.addEventListener('click', openSearchOverlay);
  $('account-btn')?.addEventListener('click', () => { if (!currentUser) openModal('account-modal'); else navigate('profile'); });
  $('admin-panel-btn')?.addEventListener('click', () => navigate('admin'));
  $('mobile-menu-toggle')?.addEventListener('click', () => openDrawer('mobile-nav-drawer'));

  // ── Mobile Nav ──
  $('mobile-account-link')?.addEventListener('click', e => { e.preventDefault(); closeDrawer('mobile-nav-drawer'); if (currentUser) navigate('profile'); else openModal('account-modal'); });
  $('mobile-wishlist-link')?.addEventListener('click', e => { e.preventDefault(); closeDrawer('mobile-nav-drawer'); renderWishlistDrawer(); openDrawer('wishlist-drawer'); });

  // ── Drawer Closes ──
  ['cart', 'wishlist', 'mobile-nav', 'filter'].forEach(name => {
    $(`${name}-close-btn`)?.addEventListener('click', () => closeDrawer(`${name}-drawer`));
    $(`${name}-overlay`)?.addEventListener('click', () => closeDrawer(`${name}-drawer`));
  });

  // ── Modal Closes ──
  ['account', 'product', 'size-guide', 'checkout-success', 'checkout-info'].forEach(name => {
    $(`${name}-modal-close`)?.addEventListener('click', () => closeModal(`${name}-modal`));
    $(`${name}-overlay`)?.addEventListener('click', () => closeModal(`${name}-modal`));
    $(`${name}-close`)?.addEventListener('click', () => closeModal(`${name}-modal`));
  });
  $('checkout-success-close')?.addEventListener('click', () => { closeModal('checkout-success-modal'); navigate('home'); });

  // ── Cart Actions ──
  $('cart-note-toggle')?.addEventListener('click', () => $('cart-note-body')?.classList.toggle('show'));
  $('checkout-btn')?.addEventListener('click', processCheckout);
  $('cart-page-checkout-btn')?.addEventListener('click', processCheckout);
  $('view-cart-btn')?.addEventListener('click', () => { closeDrawer('cart-drawer'); navigate('cart'); });

  // ── Modal Qty ──
  $('modal-qty-minus')?.addEventListener('click', () => { const inp = $('modal-qty-input'); if (inp.value > 1) inp.value = parseInt(inp.value) - 1; });
  $('modal-qty-plus')?.addEventListener('click', () => { const inp = $('modal-qty-input'); if (inp.value < 10) inp.value = parseInt(inp.value) + 1; });
  $('modal-add-to-cart')?.addEventListener('click', () => {
    if (!currentModalProduct) return;
    if (!selectedSize && currentModalProduct.sizes.length > 0) { showToast(currentLang === 'ar' ? 'اختر المقاس أولاً' : 'Select a size first', 'error'); return; }
    addToCart(currentModalProduct, selectedSize || currentModalProduct.sizes[0], parseInt($('modal-qty-input')?.value) || 1);
    closeModal('product-modal');
  });
  $('modal-buy-now')?.addEventListener('click', () => {
    if (!currentModalProduct) return;
    addToCart(currentModalProduct, selectedSize || currentModalProduct.sizes[0], parseInt($('modal-qty-input')?.value) || 1);
    closeModal('product-modal');
    closeDrawer('cart-drawer');
    navigate('cart');
  });
  $('modal-wishlist-toggle')?.addEventListener('click', () => { if (currentModalProduct) toggleWishlist(currentModalProduct); });
  $('size-chart-btn')?.addEventListener('click', () => openModal('size-guide-modal'));

  // ── Search ──
  $('search-close-btn')?.addEventListener('click', closeSearchOverlay);
  let searchTimeout;
  $('search-input')?.addEventListener('input', e => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => handleSearch(e.target.value), 300);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeSearchOverlay(); closeModal('product-modal'); closeModal('account-modal'); } });

  // ── Auth ──
  $('login-submit-btn')?.addEventListener('click', handleLogin);
  $('register-submit-btn')?.addEventListener('click', handleRegister);
  $('logout-btn')?.addEventListener('click', handleLogout);
  $('login-password')?.addEventListener('keydown', e => { if (e.key === 'Enter') handleLogin(); });
  $('reg-password')?.addEventListener('input', e => checkPasswordStrength(e.target.value));

  // ── Profile Forms ──
  $('profile-info-form')?.addEventListener('submit', handleProfileUpdate);
  $('change-password-form')?.addEventListener('submit', handleChangePassword);
  $('prof-avatar-file')?.addEventListener('change', function() { handleAvatarUpload(this); });

  // ── Admin ──
  $('add-product-btn')?.addEventListener('click', () => openProductForm(null));
  $('product-form')?.addEventListener('submit', submitProductForm);
  $('pf-cancel-btn')?.addEventListener('click', () => { $('product-form-wrapper').classList.add('hidden'); $('product-form').reset(); editingProductId = null; });

  // ── File Uploads ──
  $('pf-file-primary')?.addEventListener('change', () => uploadImageFile(
    $('pf-file-primary'), $('pf-img-primary'), $('pf-file-primary-name')
  ));
  $('pf-file-secondary')?.addEventListener('change', () => uploadImageFile(
    $('pf-file-secondary'), $('pf-img-secondary'), $('pf-file-secondary-name')
  ));

  // ── Reply Modal ──
  $('reply-submit-btn')?.addEventListener('click', submitReply);
  $('reply-cancel-btn')?.addEventListener('click', () => closeModal('reply-modal'));
  $('reply-modal-close')?.addEventListener('click', () => closeModal('reply-modal'));
  $('reply-overlay')?.addEventListener('click', () => closeModal('reply-modal'));

  // ── Announcement Admin ──
  $('add-ann-btn')?.addEventListener('click', () => openAnnForm(null));
  $('ann-form')?.addEventListener('submit', submitAnnForm);
  $('af-cancel-btn')?.addEventListener('click', () => { $('ann-form-wrapper').classList.add('hidden'); $('ann-form').reset(); editingAnnId = null; });

  // ── Filter toggle ──
  $('filter-toggle-btn')?.addEventListener('click', () => openDrawer('filter-drawer'));

  // ── Layout toggle ──
  $('grid-view-btn')?.addEventListener('click', () => {
    $('grid-view-btn').classList.add('active'); $('list-view-btn').classList.remove('active');
    $('shop-products-grid').classList.remove('list-layout');
  });
  $('list-view-btn')?.addEventListener('click', () => {
    $('list-view-btn').classList.add('active'); $('grid-view-btn').classList.remove('active');
    $('shop-products-grid').classList.add('list-layout');
  });

  // ── Nav links ──
  $$('.nav-link, .drawer-link, [data-route]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href') || `#${link.dataset.route}`;
      if (href && href.startsWith('#')) { e.preventDefault(); closeDrawer('mobile-nav-drawer'); navigate(href.replace('#', '')); }
    });
  });
  $$('[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = a.getAttribute('href').replace('#', '');
      if (['home','shop','about','contact','cart','profile','admin'].includes(target)) { e.preventDefault(); navigate(target); }
    });
  });

  // ── Mobile toolbar ──
  $$('.toolbar-tab[data-route]').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.route)));
  $('mobile-search-tab')?.addEventListener('click', openSearchOverlay);
  $('mobile-cart-tab')?.addEventListener('click', () => { renderCartDrawer(); openDrawer('cart-drawer'); });
  $('mobile-account-tab')?.addEventListener('click', () => { if (currentUser) navigate('profile'); else openModal('account-modal'); });

  // ── Logo ──
  $$('.logo-link, .footer-logo').forEach(link => link.addEventListener('click', e => { e.preventDefault(); navigate('home'); }));

  // ── Setup all modules ──
  setupAccordions();
  setupFilters();
  setupCollectionCards();
  setupAdminTabs();
  setupProfileTabs();
  setupAccountTabs();
  setupContactForm();
  setupNewsletter();

  // Initialize badges
  renderCartBadge();
  renderWishlistBadge();
}

// ─── BOOT ─────────────────────────────────────────────────────────────────────
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();
