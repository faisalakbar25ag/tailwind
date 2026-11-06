import React, { useState } from 'react';

// TypeScript Interfaces
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  stock: number;
  availableSizes: string[];
  availableColors: string[];
}

interface CartItem extends Product {
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

interface OrderDetails {
  orderId: string;
  customerName: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  courier: string;
  totalPrice: number;
  paymentMethod: string;
  date: string;
  status: 'Diproses' | 'Dikirim' | 'Selesai';
  trackingNumber?: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: 'admin' | 'customer';
  avatar: string;
  password?: string;
}

const INITIAL_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "CYBERPUNK NEON HOODIE",
    category: "Hoodies",
    price: 459000,
    rating: 4.9,
    reviews: 128,
    stock: 12,
    availableSizes: ["S", "M", "L", "XL"],
    availableColors: ["Neon Cyan", "Obsidian Black"],
    image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800",
    description: "Hoodie edisi terbatas dengan pola cyberpunk kontemporer. Material Cotton Fleece Heavyweight 330gsm."
  },
  {
    id: 2,
    name: "TECHWEAR B4RA UTILITY JACKET",
    category: "Jackets",
    price: 689000,
    rating: 4.8,
    reviews: 95,
    stock: 5,
    availableSizes: ["M", "L", "XL"],
    availableColors: ["Matte Black", "Tactical Olive"],
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800",
    description: "Jaket taktis berlapis tahan air (waterproof) dengan multiple pocket fungsional."
  },
  {
    id: 3,
    name: "FUTURE MATRIX T-SHIRT",
    category: "T-Shirts",
    price: 229000,
    rating: 4.7,
    reviews: 210,
    stock: 0,
    availableSizes: ["S", "M", "L"],
    availableColors: ["Electric White", "Pitch Black"],
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800",
    description: "Kaos potongan boxy-fit berbahan Cotton Combed 24s murni."
  }
];

const INITIAL_USERS: UserProfile[] = [
  {
    name: 'Admin B4RA Store',
    email: 'admin@b4ra.store',
    phone: '081299998888',
    address: 'Kantor Pusat B4RA, Jakarta',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    password: 'admin'
  },
  {
    name: 'Faisal Akbar',
    email: 'faisal@b4ra.store',
    phone: '081234567890',
    address: 'Jakarta, Indonesia',
    role: 'customer',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
    password: '123'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('default');

  const [selectedCourier, setSelectedCourier] = useState<string>('JNE Express (Rp 18.000)');
  const [courierFee, setCourierFee] = useState<number>(18000);

  const [purchaseHistory, setPurchaseHistory] = useState<OrderDetails[]>([
    {
      orderId: 'B4RA-88102',
      customerName: 'Faisal Akbar',
      items: [{ ...INITIAL_PRODUCTS[0], selectedSize: 'L', selectedColor: 'Neon Cyan', quantity: 1 }],
      subtotal: 459000,
      shippingFee: 18000,
      courier: 'JNE Express',
      totalPrice: 477000,
      paymentMethod: 'QRIS Auto-Pay',
      date: '06/11/2026',
      status: 'Dikirim',
      trackingNumber: 'B4RA-JNE-99281172'
    }
  ]);
  const [salesHistory, setSalesHistory] = useState<OrderDetails[]>([]);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('qris');
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);

  const [chosenSize, setChosenSize] = useState<string>('');
  const [chosenColor, setChosenColor] = useState<string>('');

  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>(INITIAL_USERS);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USERS[0]);

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userRating, setUserRating] = useState<number>(5);
  const [userReview, setUserReview] = useState<string>('');

  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [productForm, setProductForm] = useState({ name: '', category: 'Hoodies', price: 0, stock: 10, image: '', description: '' });

  const [loginForm, setLoginForm] = useState({ email: 'admin@b4ra.store', password: 'admin' });
  const [registerForm, setRegisterForm] = useState({ name: '', email: '', password: '', phone: '', address: '' });
  const [profileForm, setProfileForm] = useState<UserProfile>(userProfile);
  const [inputTrackingNo, setInputTrackingNo] = useState<{ [key: string]: string }>({});

  const navigateTo = (page: string, product: Product | null = null) => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentPage(page);
      if (product) {
        setSelectedProduct(product);
        setChosenSize(product.availableSizes[0] || 'M');
        setChosenColor(product.availableColors[0] || 'Black');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsAnimating(false);
    }, 150);
  };

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      alert("Maaf, stok barang ini sedang habis!");
      return;
    }
    setCart(prev => {
      const idx = prev.findIndex(item => item.id === product.id && item.selectedSize === chosenSize && item.selectedColor === chosenColor);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx].quantity += 1;
        return updated;
      }
      return [...prev, { ...product, selectedSize: chosenSize, selectedColor: chosenColor, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleCourierChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setSelectedCourier(val);
    if (val.includes('18.000')) setCourierFee(18000);
    else if (val.includes('22.000')) setCourierFee(22000);
    else if (val.includes('15.000')) setCourierFee(15000);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const subtotalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const grandTotal = subtotalPrice + courierFee;

  const executePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentModalOpen(false);

      setProducts(prevProducts => prevProducts.map(prod => {
        const cartItem = cart.find(c => c.id === prod.id);
        if (cartItem) {
          return { ...prod, stock: Math.max(0, prod.stock - cartItem.quantity) };
        }
        return prod;
      }));

      const newOrder: OrderDetails = {
        orderId: 'B4RA-' + Math.floor(100000 + Math.random() * 900000),
        customerName: userProfile.name,
        items: [...cart],
        subtotal: subtotalPrice,
        shippingFee: courierFee,
        courier: selectedCourier.split(' (')[0],
        totalPrice: grandTotal,
        paymentMethod: selectedPaymentMethod.toUpperCase(),
        date: new Date().toLocaleDateString('id-ID'),
        status: 'Diproses'
      };

      setPurchaseHistory([newOrder, ...purchaseHistory]);
      setSalesHistory([newOrder, ...salesHistory]);
      setCart([]);
      setIsCartOpen(false);
      alert('🎉 Pembayaran Berhasil! Pesanan Anda sedang diproses.');
      navigateTo('purchase-history');
    }, 2000);
  };

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(num);
  };

  const handleUpdateTracking = (orderId: string) => {
    const resi = inputTrackingNo[orderId];
    if (!resi) return alert("Harap masukkan nomor resi!");

    const updateOrders = (orders: OrderDetails[]) => orders.map(o => o.orderId === orderId ? { ...o, trackingNumber: resi, status: 'Dikirim' as const } : o);
    setSalesHistory(updateOrders(salesHistory));
    setPurchaseHistory(updateOrders(purchaseHistory));
    alert(`Nomor resi ${resi} berhasil diinput! Status berubah ke Dikirim.`);
  };

  const handleSendRating = () => {
    if (!selectedProduct) return;
    setProducts(products.map(p => {
      if (p.id === selectedProduct.id) {
        const newRev = p.reviews + 1;
        const newRat = Number(((p.rating * p.reviews + userRating) / newRev).toFixed(1));
        return { ...p, rating: newRat, reviews: newRev };
      }
      return p;
    }));
    alert(`Terima kasih! Ulasan Anda "${userReview || 'Sangat Bagus!'}" dengan rating ${userRating} bintang berhasil terkirim.`);
    setUserReview('');
  };

  return (
    <div className="min-h-screen bg-[#060813] text-gray-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="fixed top-1/3 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* NAVBAR */}
      <header className="sticky top-0 z-40 bg-[#060813]/85 backdrop-blur-xl border-b border-white/10 shadow-xl shadow-black/40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div onClick={() => navigateTo('home')} className="flex items-center gap-2 cursor-pointer group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-black text-black shadow-lg shadow-cyan-500/30 group-hover:scale-105 transition-transform duration-300">B</div>
            <span className="text-2xl font-black tracking-wider text-white group-hover:text-cyan-400 transition-colors">B4RA<span className="text-cyan-400">.</span></span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
            <button onClick={() => navigateTo('home')} className={`transition-all duration-300 ${currentPage === 'home' ? 'text-cyan-400 font-bold scale-105' : 'text-gray-400 hover:text-white'}`}>Beranda</button>
            <button onClick={() => navigateTo('catalog')} className={`transition-all duration-300 ${currentPage === 'catalog' ? 'text-cyan-400 font-bold scale-105' : 'text-gray-400 hover:text-white'}`}>Koleksi</button>
            <button onClick={() => navigateTo('about')} className={`transition-all duration-300 ${currentPage === 'about' ? 'text-cyan-400 font-bold scale-105' : 'text-gray-400 hover:text-white'}`}>Tentang Kami</button>
            
            {isLoggedIn && (
              <>
                <button onClick={() => navigateTo('purchase-history')} className={`transition-all duration-300 ${currentPage === 'purchase-history' ? 'text-cyan-400 font-bold scale-105' : 'text-gray-400 hover:text-white'}`}>Pesanan Saya</button>
                {userProfile.role === 'admin' && (
                  <>
                    <button onClick={() => navigateTo('sales-history')} className={`transition-all duration-300 ${currentPage === 'sales-history' ? 'text-cyan-400 font-bold scale-105' : 'text-gray-400 hover:text-white'}`}>Dashboard Penjualan</button>
                    <button onClick={() => {
                      setEditingProduct(null);
                      setProductForm({ name: '', category: 'Hoodies', price: 0, stock: 10, image: '', description: '' });
                      navigateTo('add-product');
                    }} className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500 hover:text-black transition-all">+ Tambah Barang</button>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex items-center gap-4">
            <button onClick={() => setIsCartOpen(true)} className="p-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 hover:border-cyan-500/40 transition-all">
              🛒 ({cart.reduce((a, b) => a + b.quantity, 0)})
            </button>

            {isLoggedIn ? (
              <button onClick={() => navigateTo('profile')} className="flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500 hover:text-black transition-all">
                <img src={userProfile.avatar} alt="Profile" className="w-6 h-6 rounded-full object-cover border border-cyan-400" />
                <span>{userProfile.name} {userProfile.role === 'admin' && '(Admin)'}</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={() => navigateTo('login')} className="text-xs text-cyan-400 font-bold hover:underline">Login</button>
                <button onClick={() => navigateTo('register')} className="px-3.5 py-1.5 bg-cyan-500 text-black font-bold text-xs rounded-xl shadow-lg shadow-cyan-500/20 hover:scale-105 transition-all">Register</button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`flex-1 max-w-7xl w-full mx-auto px-4 py-8 relative z-10 transition-all duration-300 transform ${isAnimating ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}>
        
        {/* BERANDA */}
        {currentPage === 'home' && (
          <div className="space-y-12">
            <div className="text-center py-24 px-6 bg-gradient-to-b from-slate-900/80 via-slate-900/40 to-transparent rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl relative overflow-hidden group">
              <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-4">Cyberpunk Fashion Drop 2026</span>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
                INTELLIGENT INNOVATION <br />
                <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-500 bg-clip-text text-transparent">FOR THE FUTURE</span>
              </h1>
              <p className="text-gray-400 text-sm max-w-lg mx-auto mt-4 leading-relaxed">Pakaian gaya cyberpunk futuristik dengan bahan kelas premium pilihan untuk ekspresi gaya harian Anda.</p>
              <button onClick={() => navigateTo('catalog')} className="mt-8 px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold rounded-2xl text-xs tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all">
                JELAJAHI KATALOG PRODUK &rarr;
              </button>
            </div>
          </div>
        )}

        {/* KATALOG */}
        {currentPage === 'catalog' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-4">
              <div>
                <span className="text-xs text-cyan-400 font-mono">B4RA EXCLUSIVE COLLECTION</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">KATALOG PRODUK</h2>
              </div>

              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <input 
                  type="text" 
                  placeholder="🔍 Cari produk..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 w-full sm:w-48"
                />
                
                <select 
                  value={selectedCategory} 
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">Semua Kategori</option>
                  <option value="Hoodies">Hoodies</option>
                  <option value="Jackets">Jackets</option>
                  <option value="T-Shirts">T-Shirts</option>
                </select>

                <select 
                  value={sortBy} 
                  onChange={e => setSortBy(e.target.value)}
                  className="bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="default">Urutkan Default</option>
                  <option value="price-low">Harga: Termurah</option>
                  <option value="price-high">Harga: Termahal</option>
                  <option value="rating">Rating Tertinggi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {filteredProducts.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-gray-400 text-xs">Produk tidak ditemukan. Cobalah kata kunci lain.</div>
              ) : (
                filteredProducts.map(product => (
                  <div key={product.id} className="group p-5 bg-slate-900/40 border border-white/10 hover:border-cyan-500/50 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-cyan-500/10">
                    <div>
                      <div className="overflow-hidden rounded-xl mb-4 bg-slate-950 relative">
                        <img src={product.image} alt={product.name} className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
                        
                        {product.stock <= 0 ? (
                          <span className="absolute top-2 right-2 bg-red-500/90 text-white text-[10px] font-black px-2.5 py-1 rounded-lg backdrop-blur-md">STOK HABIS</span>
                        ) : (
                          <span className="absolute top-2 right-2 bg-emerald-500/90 text-black text-[10px] font-extrabold px-2.5 py-1 rounded-lg backdrop-blur-md">Sisa: {product.stock}</span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{product.category}</span>
                      <h3 className="font-bold text-white text-base group-hover:text-cyan-400 transition-colors">{product.name}</h3>
                      <p className="text-sm text-cyan-400 font-extrabold mt-1">{formatRupiah(product.price)}</p>
                      <p className="text-xs text-amber-400 font-semibold mt-1">★ {product.rating} <span className="text-gray-500">({product.reviews} ulasan)</span></p>
                    </div>
                    <div className="flex gap-2 mt-5">
                      <button onClick={() => navigateTo('product-detail', product)} className="flex-1 py-2.5 bg-white/5 hover:bg-cyan-500 hover:text-black border border-white/10 text-xs font-bold text-white rounded-xl transition-all">Detail & Pilih Varian</button>
                      {userProfile.role === 'admin' && (
                        <button onClick={() => {
                          setEditingProduct(product);
                          setProductForm(product);
                          navigateTo('add-product');
                        }} className="px-3.5 py-2.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-black rounded-xl text-xs font-bold transition-all">Edit</button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* DETAIL PRODUK */}
        {currentPage === 'product-detail' && selectedProduct && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
            <div className="overflow-hidden rounded-2xl bg-slate-950 border border-white/10">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-96 object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="space-y-5 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase">{selectedProduct.category}</span>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${selectedProduct.stock > 0 ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                    {selectedProduct.stock > 0 ? `Stok Tersedia: ${selectedProduct.stock}` : 'Stok Habis'}
                  </span>
                </div>
                
                <h1 className="text-3xl font-extrabold text-white mt-1">{selectedProduct.name}</h1>
                <p className="text-2xl font-black text-cyan-400 mt-2">{formatRupiah(selectedProduct.price)}</p>
                <p className="text-xs text-gray-300 mt-3 leading-relaxed">{selectedProduct.description}</p>
                
                <div className="mt-5 space-y-2">
                  <label className="text-xs font-bold text-gray-300 block">Pilih Ukuran (Size):</label>
                  <div className="flex gap-2">
                    {selectedProduct.availableSizes.map(sz => (
                      <button 
                        key={sz} 
                        onClick={() => setChosenSize(sz)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${chosenSize === sz ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30' : 'bg-white/5 text-white border-white/10 hover:border-cyan-500/40'}`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <label className="text-xs font-bold text-gray-300 block">Pilih Warna (Color):</label>
                  <div className="flex gap-2">
                    {selectedProduct.availableColors.map(cl => (
                      <button 
                        key={cl} 
                        onClick={() => setChosenColor(cl)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${chosenColor === cl ? 'bg-cyan-500 text-black border-cyan-400 shadow-md shadow-cyan-500/30' : 'bg-white/5 text-white border-white/10 hover:border-cyan-500/40'}`}
                      >
                        {cl}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button 
                disabled={selectedProduct.stock <= 0}
                onClick={() => addToCart(selectedProduct)} 
                className={`w-full py-3.5 font-extrabold rounded-2xl text-xs tracking-wider transition-all ${selectedProduct.stock > 0 ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-black shadow-lg shadow-cyan-500/25 hover:scale-[1.02]' : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
              >
                {selectedProduct.stock > 0 ? '+ TAMBAH KE KERANJANG' : 'STOK HABIS'}
              </button>

              <div className="pt-4 border-t border-white/10 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ulasan Pengguna:</h4>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button key={star} onClick={() => setUserRating(star)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${userRating >= star ? 'bg-amber-400 text-black' : 'bg-white/5 text-gray-400 border border-white/10'}`}>
                      ★ {star}
                    </button>
                  ))}
                </div>
                <textarea rows={2} value={userReview} onChange={e => setUserReview(e.target.value)} placeholder="Tulis ulasan Anda..." className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-500" />
                <button onClick={handleSendRating} className="px-4 py-2 bg-white/10 text-white rounded-xl text-xs font-bold hover:bg-white/20">Kirim Rating & Ulasan</button>
              </div>
            </div>
          </div>
        )}

        {/* TAMBAH BARANG */}
        {currentPage === 'add-product' && (
          <div className="max-w-md mx-auto bg-slate-900/60 border border-white/10 p-8 rounded-3xl space-y-5 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-extrabold text-white text-center tracking-wider">{editingProduct ? 'EDIT BARANG' : 'TAMBAH BARANG BARU'}</h2>
            <form onSubmit={e => {
              e.preventDefault();
              if (editingProduct) {
                setProducts(products.map(p => p.id === editingProduct.id ? { ...p, ...productForm } : p));
              } else {
                setProducts([{ id: Date.now(), ...productForm, rating: 5.0, reviews: 0, availableSizes: ["S", "M", "L", "XL"], availableColors: ["Black", "Cyan"] }, ...products]);
              }
              navigateTo('catalog');
            }} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nama Barang</label>
                <input type="text" required value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-gray-400 block mb-1">Harga (Rp)</label>
                  <input type="number" required value={productForm.price} onChange={e => setProductForm({...productForm, price: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
                </div>
                <div>
                  <label className="text-gray-400 block mb-1">Stok Barang</label>
                  <input type="number" required value={productForm.stock} onChange={e => setProductForm({...productForm, stock: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
                </div>
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Pilih Gambar Barang (File Manager)</label>
                <input type="file" accept="image/*" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setProductForm({ ...productForm, image: URL.createObjectURL(file) });
                }} className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-white text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-500 file:text-black cursor-pointer" />
              </div>

              <div>
                <label className="text-gray-400 block mb-1">Deskripsi Produk</label>
                <textarea rows={2} value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold rounded-2xl text-xs tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all">
                SIMPAN BARANG & STOK
              </button>
            </form>
          </div>
        )}

        {/* HASIL PEMBELIAN */}
        {currentPage === 'purchase-history' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-white">PESANAN SAYA & LACAK RESI</h2>
            {purchaseHistory.length === 0 ? (
              <p className="text-xs text-gray-400">Belum ada riwayat transaksi.</p>
            ) : (
              purchaseHistory.map((order, idx) => (
                <div key={idx} className="p-6 bg-slate-900/40 border border-white/10 rounded-2xl text-xs space-y-4 hover:border-cyan-500/40 transition-all">
                  <div className="flex justify-between items-center font-bold text-cyan-400 border-b border-white/10 pb-3">
                    <span>ID Transaksi: {order.orderId} ({order.date})</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Dikirim' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>{order.status}</span>
                  </div>

                  <div className="space-y-2">
                    {order.items.map((it, i) => (
                      <div key={i} className="flex justify-between items-center text-gray-300">
                        <span>{it.name} (Ukuran: {it.selectedSize}, Warna: {it.selectedColor}) x {it.quantity}</span>
                        <span className="font-bold">{formatRupiah(it.price * it.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row justify-between text-gray-400 gap-2">
                    <p>🚚 Ekspedisi: <strong>{order.courier}</strong> ({formatRupiah(order.shippingFee)})</p>
                    <p className="text-white font-extrabold text-sm">Total Bayar: <span className="text-cyan-400">{formatRupiah(order.totalPrice)}</span></p>
                  </div>

                  {order.trackingNumber ? (
                    <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl space-y-1">
                      <p className="font-bold text-cyan-300">📦 Lacak Pengiriman Paket:</p>
                      <p className="text-white font-mono">No. Resi: <strong>{order.trackingNumber}</strong></p>
                      <p className="text-[11px] text-gray-400">Status Lacak: Paket telah diserahkan ke kurir {order.courier} dan sedang dalam perjalanan ke alamat Anda.</p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-amber-400 italic">⏳ Penjual sedang mempersiapkan paket dan akan segera menginput nomor resi.</p>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* HASIL PENJUALAN */}
        {currentPage === 'sales-history' && (
          <div className="space-y-5">
            <h2 className="text-2xl font-extrabold text-white">DASHBOARD PENJUALAN & INPUT RESI (ADMIN)</h2>
            <div className="p-6 bg-slate-900/60 border border-white/10 rounded-2xl text-center backdrop-blur-xl">
              <span className="text-xs text-gray-400 uppercase tracking-widest">Total Pendapatan Toko</span>
              <h3 className="text-3xl font-black text-cyan-400 mt-1">{formatRupiah(salesHistory.reduce((a, b) => a + b.totalPrice, 0))}</h3>
            </div>

            <div className="space-y-4">
              {salesHistory.map((order, idx) => (
                <div key={idx} className="p-5 bg-slate-900/40 border border-white/10 rounded-2xl text-xs space-y-3">
                  <div className="flex justify-between font-bold text-white">
                    <span>Pemesan: {order.customerName} ({order.orderId})</span>
                    <span className="text-emerald-400">{formatRupiah(order.totalPrice)}</span>
                  </div>
                  <p className="text-gray-400">Kurir: {order.courier} | Metode Bayar: {order.paymentMethod}</p>

                  <div className="flex gap-2 items-center pt-2">
                    <input 
                      type="text" 
                      placeholder="Masukkan No. Resi Ekspedisi..." 
                      value={inputTrackingNo[order.orderId] || ''}
                      onChange={e => setInputTrackingNo({ ...inputTrackingNo, [order.orderId]: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 flex-1"
                    />
                    <button 
                      onClick={() => handleUpdateTracking(order.orderId)}
                      className="px-4 py-2 bg-cyan-500 text-black font-bold rounded-xl text-xs hover:bg-cyan-400"
                    >
                      Update Resi
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROFIL */}
        {currentPage === 'profile' && (
          <div className="max-w-md mx-auto bg-slate-900/60 border border-white/10 p-8 rounded-3xl space-y-6 text-center backdrop-blur-xl shadow-2xl">
            <img src={userProfile.avatar} alt="Profile" className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-cyan-500 shadow-xl shadow-cyan-500/25" />
            <div>
              <h2 className="text-2xl font-extrabold text-white">{userProfile.name}</h2>
              <span className="inline-block mt-1 text-[10px] px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-400 font-bold uppercase tracking-wider border border-cyan-500/30">{userProfile.role}</span>
            </div>
            <div className="text-xs text-left bg-black/40 p-4 rounded-2xl space-y-2 text-gray-300 border border-white/5">
              <p>👤 <strong>Nama:</strong> {userProfile.name}</p>
              <p>📧 <strong>Email:</strong> {userProfile.email}</p>
              <p>📱 <strong>No HP:</strong> {userProfile.phone}</p>
              <p>📍 <strong>Alamat:</strong> {userProfile.address}</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setProfileForm(userProfile); navigateTo('edit-profile'); }} className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all">Edit Profil & Foto</button>
              <button onClick={() => { setIsLoggedIn(false); navigateTo('login'); }} className="flex-1 py-3 bg-red-500/20 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold transition-all">Logout</button>
            </div>
          </div>
        )}

        {/* EDIT PROFIL */}
        {currentPage === 'edit-profile' && (
          <div className="max-w-md mx-auto bg-slate-900/60 border border-white/10 p-8 rounded-3xl space-y-5 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-extrabold text-white text-center tracking-wider">EDIT PROFIL</h2>
            <form onSubmit={e => { e.preventDefault(); setUserProfile(profileForm); navigateTo('profile'); }} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nama Lengkap</label>
                <input type="text" value={profileForm.name} onChange={e => setProfileForm({...profileForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-cyan-500 text-black font-extrabold rounded-2xl text-xs">SIMPAN</button>
            </form>
          </div>
        )}

        {/* LOGIN */}
        {currentPage === 'login' && (
          <div className="max-w-sm mx-auto bg-slate-900/60 border border-white/10 p-8 rounded-3xl space-y-5 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-extrabold text-white text-center tracking-wider">LOGIN AKUN B4RA</h2>
            <form onSubmit={e => {
              e.preventDefault();
              const foundUser = registeredUsers.find(u => u.email === loginForm.email && u.password === loginForm.password);
              if (foundUser) {
                setUserProfile(foundUser);
                setIsLoggedIn(true);
                navigateTo('home');
              } else {
                alert('Email/Password salah!');
              }
            }} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Email</label>
                <input type="email" required value={loginForm.email} onChange={e => setLoginForm({...loginForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Password</label>
                <input type="password" required value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-cyan-500 text-black font-extrabold rounded-2xl text-xs">MASUK</button>
            </form>
          </div>
        )}

        {/* REGISTER */}
        {currentPage === 'register' && (
          <div className="max-w-sm mx-auto bg-slate-900/60 border border-white/10 p-8 rounded-3xl space-y-5 backdrop-blur-xl shadow-2xl">
            <h2 className="text-xl font-extrabold text-white text-center tracking-wider">DAFTAR AKUN</h2>
            <form onSubmit={e => {
              e.preventDefault();
              const newUser: UserProfile = { ...registerForm, role: 'customer', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200' };
              setRegisteredUsers([...registeredUsers, newUser]);
              setUserProfile(newUser);
              setIsLoggedIn(true);
              navigateTo('home');
            }} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-400 block mb-1">Nama Lengkap</label>
                <input type="text" required value={registerForm.name} onChange={e => setRegisterForm({...registerForm, name: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Email</label>
                <input type="email" required value={registerForm.email} onChange={e => setRegisterForm({...registerForm, email: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-gray-400 block mb-1">Password</label>
                <input type="password" required value={registerForm.password} onChange={e => setRegisterForm({...registerForm, password: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white" />
              </div>
              <button type="submit" className="w-full py-3.5 bg-cyan-500 text-black font-extrabold rounded-2xl text-xs">DAFTAR</button>
            </form>
          </div>
        )}

        {/* TENTANG KAMI */}
        {currentPage === 'about' && (
          <div className="max-w-2xl mx-auto space-y-4 text-center bg-slate-900/40 border border-white/10 p-10 rounded-3xl backdrop-blur-xl">
            <h1 className="text-3xl font-extrabold text-white">TENTANG B4RA STORE</h1>
            <p className="text-xs text-gray-300 leading-relaxed">
              B4RA adalah brand streetwear futuristik modern asal Indonesia. Menghadirkan kombinasi estetika teknologi cyberpunk dan kualitas bahan pakaian terbaik.
            </p>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-[#030409] border-t border-white/10 py-6 mt-auto text-center text-xs text-gray-500">
        &copy; {new Date().getFullYear()} B4RA Store. Hak Cipta Dilindungi.
      </footer>

      {/* SHOPPING CART DRAWER */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-slate-900 border-l border-white/10 text-white flex flex-col justify-between p-6 shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-4">
                <h3 className="font-bold text-sm uppercase tracking-wider">Keranjang Belanja</h3>
                <button onClick={() => setIsCartOpen(false)}>✕</button>
              </div>
              
              <div className="flex-1 overflow-y-auto py-4 space-y-3">
                {cart.length === 0 ? <p className="text-xs text-gray-400 text-center py-10">Keranjang masih kosong</p> : cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-gray-400">Ukuran: {item.selectedSize} | Warna: {item.selectedColor}</p>
                      <p className="text-cyan-400 mt-1">Jumlah: {item.quantity}</p>
                    </div>
                    <span className="text-cyan-400 font-bold">{formatRupiah(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {cart.length > 0 && (
                <div className="pt-4 border-t border-white/10 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] text-gray-400 block font-bold">Pilih Ekspedisi Pengiriman:</label>
                    <select 
                      value={selectedCourier} 
                      onChange={handleCourierChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                    >
                      <option value="JNE Express (Rp 18.000)" className="bg-slate-900">JNE Express (Rp 18.000)</option>
                      <option value="J&T Express (Rp 15.000)" className="bg-slate-900">J&T Express (Rp 15.000)</option>
                      <option value="SiCepat Reguler (Rp 22.000)" className="bg-slate-900">SiCepat Reguler (Rp 22.000)</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-xs border-t border-white/10 pt-3">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal Produk:</span>
                      <span>{formatRupiah(subtotalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Ongkos Kirim:</span>
                      <span>{formatRupiah(courierFee)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-white text-sm pt-1">
                      <span>Total Biaya:</span>
                      <span className="text-cyan-400">{formatRupiah(grandTotal)}</span>
                    </div>
                  </div>

                  <button onClick={() => setIsPaymentModalOpen(true)} className="w-full py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-black font-extrabold rounded-xl text-xs tracking-wider shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition-all">
                    LANJUT KE PEMBAYARAN (PAYMENT GATEWAY) &rarr;
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIMULASI PAYMENT GATEWAY MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-white/10 w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl relative">
            <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-white">✕</button>

            <div className="text-center border-b border-white/10 pb-4">
              <span className="text-[10px] font-mono text-cyan-400 tracking-widest uppercase">B4RA SECURE PAYMENT GATEWAY</span>
              <h3 className="text-xl font-black text-white mt-1">PILIH METODE PEMBAYARAN</h3>
              <p className="text-cyan-400 font-bold text-lg mt-1">{formatRupiah(grandTotal)}</p>
            </div>

            <div className="space-y-2">
              {[
                { id: 'qris', name: 'QRIS (GoPay, OVO, ShopeePay, DANA)', icon: '📱' },
                { id: 'bca', name: 'BCA Virtual Account', icon: '🏦' },
                { id: 'mandiri', name: 'Mandiri Virtual Account', icon: '💳' }
              ].map(method => (
                <div 
                  key={method.id} 
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`p-3.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${selectedPaymentMethod === method.id ? 'bg-cyan-500/10 border-cyan-400 text-white' : 'bg-white/5 border-white/10 text-gray-400'}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{method.icon}</span>
                    <span className="text-xs font-bold">{method.name}</span>
                  </div>
                  <input type="radio" checked={selectedPaymentMethod === method.id} onChange={() => {}} className="accent-cyan-400" />
                </div>
              ))}
            </div>

            <div className="p-4 bg-black/40 rounded-xl text-[11px] space-y-1 text-gray-300">
              <p>📍 <strong>Alamat Kirim:</strong> {userProfile.address}</p>
              <p>🚚 <strong>Ekspedisi:</strong> {selectedCourier}</p>
            </div>

            <button 
              disabled={isProcessingPayment}
              onClick={executePayment}
              className="w-full py-4 bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-extrabold rounded-2xl text-xs tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all flex justify-center items-center gap-2"
            >
              {isProcessingPayment ? 'MEMPROSES PEMBAYARAN...' : 'BAYAR SEKARANG & KONFIRMASI OTOMATIS'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}