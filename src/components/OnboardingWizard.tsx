import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import {
  PREDEFINED_CATEGORIES,
  THEMES,
  generateDummyProductsForCategories
} from '../data/seed';
import { createStore, getCurrentUser } from '../lib/storage';
import { Product, StoreTheme } from '../types';
import {
  Store as StoreIcon,
  Check,
  Plus,
  Zap,
  FileSpreadsheet,
  Download,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Upload
} from 'lucide-react';

interface OnboardingWizardProps {
  onComplete: (slug: string) => void;
  onCancel?: () => void;
}

export const OnboardingWizard: React.FC<OnboardingWizardProps> = ({ onComplete, onCancel }) => {
  const currentUser = getCurrentUser();
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1: Store info
  // Step 1: Store info (starts completely empty for user)
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [businessType, setBusinessType] = useState('Fashion & Apparel');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [logo, setLogo] = useState('');
  const [banner, setBanner] = useState('');

  // Step 2: Categories (starts empty - user selects their own)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [customCatInput, setCustomCatInput] = useState('');

  // Step 3: Product Import (starts empty until user chooses)
  const [importMode, setImportMode] = useState<'dummy' | 'file' | 'empty' | null>(null);
  const [productsToImport, setProductsToImport] = useState<Product[]>([]);
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [fileName, setFileName] = useState('');

  // Step 4: Theme
  const [selectedTheme, setSelectedTheme] = useState<StoreTheme>(THEMES[1]); // Default Bold

  // Step 5: Submitting
  const [isLaunching, setIsLaunching] = useState(false);

  // Auto-slug generator on store name change
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setSlug(generatedSlug || 'my-store');
  };

  // Category toggle
  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAddCustomCategory = () => {
    const trimmed = customCatInput.trim();
    if (!trimmed) return;
    if (!selectedCategories.includes(trimmed)) {
      setSelectedCategories(prev => [...prev, trimmed]);
    }
    setCustomCatInput('');
  };

  // Step 3 dummy product generator
  const handleImportDummyProducts = () => {
    const cats = selectedCategories.map((name, i) => ({
      id: `cat_temp_${i}`,
      storeId: 'temp',
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
    }));
    const generated = generateDummyProductsForCategories('temp', cats);
    setProductsToImport(generated);
    setImportMode('dummy');
    toast.success(`Generated ${generated.length} realistic dummy products!`);
  };

  // Step 3 File Upload (xlsx / csv)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setFileErrors([]);

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const data = evt.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonRows: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!jsonRows || jsonRows.length === 0) {
          setFileErrors(['The uploaded file contains no data rows.']);
          return;
        }

        const errors: string[] = [];
        const parsedProducts: Product[] = [];

        jsonRows.forEach((row, idx) => {
          const rowNum = idx + 2; // header is row 1
          const pName = row.Name || row.name || row['Product Name'];
          const pPrice = Number(row.Price || row.price);
          const pCategory = row.Category || row.category || selectedCategories[0] || 'General';
          const pStock = Number(row.Stock !== undefined ? row.Stock : (row.stock !== undefined ? row.stock : 10));
          const pSku = row.SKU || row.sku || `SKU-${1000 + idx}`;
          const pImage = row.Image || row.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';
          const pDesc = row.Description || row.description || `High quality ${pName}`;

          if (!pName) {
            errors.push(`Row ${rowNum}: Missing product Name.`);
            return;
          }
          if (isNaN(pPrice) || pPrice < 0) {
            errors.push(`Row ${rowNum}: Invalid or missing Price for "${pName}".`);
            return;
          }

          parsedProducts.push({
            id: `prod_import_${idx}`,
            storeId: 'temp',
            categoryId: 'cat_temp',
            categoryName: pCategory,
            name: String(pName).trim(),
            slug: String(pName).toLowerCase().replace(/[^a-z0-9]+/g, '-') + `-${idx}`,
            description: String(pDesc),
            price: pPrice,
            stock: isNaN(pStock) ? 10 : pStock,
            sku: String(pSku),
            image: String(pImage),
            isActive: true,
            createdAt: new Date().toISOString()
          });
        });

        setFileErrors(errors);
        if (parsedProducts.length > 0) {
          setProductsToImport(parsedProducts);
          setImportMode('file');
          toast.success(`Successfully parsed ${parsedProducts.length} products!`);
        } else {
          toast.error('Could not parse any valid product rows.');
        }
      } catch (err: any) {
        setFileErrors([`File read error: ${err.message || 'Corrupted file'}`]);
      }
    };

    reader.readAsBinaryString(file);
  };

  // Download CSV template
  const downloadTemplate = () => {
    const templateData = [
      {
        Name: 'Oversized Streetwear Hoodie',
        Category: 'T-Shirts',
        Price: 1999,
        Stock: 25,
        SKU: 'HD-001',
        Image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
        Description: '100% French terry cotton hoodie with ribbed cuffs.'
      },
      {
        Name: 'Classic Pilot Sunglasses',
        Category: 'Watches',
        Price: 1499,
        Stock: 8,
        SKU: 'SG-002',
        Image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=80',
        Description: 'Polarized UV400 lenses with stainless steel wire frame.'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    XLSX.writeFile(wb, 'cypher_products_template.csv');
    toast.success('Template downloaded! Open in Excel or Google Sheets.');
  };

  // Validation per step
  const validateStep = (step: number): boolean => {
    if (step === 1) {
      if (!name.trim()) {
        toast.error('Store name is required');
        return false;
      }
      if (!slug.trim()) {
        toast.error('Store URL slug is required');
        return false;
      }
      if (!email.includes('@')) {
        toast.error('Valid store email is required');
        return false;
      }
      if (!phone.trim()) {
        toast.error('Phone number is required');
        return false;
      }
      return true;
    }

    if (step === 2) {
      if (selectedCategories.length === 0) {
        toast.error('Please select at least 1 category');
        return false;
      }
      return true;
    }

    if (step === 3) {
      if (importMode === 'empty') {
        return true;
      }
      if (productsToImport.length === 0) {
        toast.error('Please select an import option or choose "Start with Empty Catalog"');
        return false;
      }
      return true;
    }

    return true;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(1, prev - 1));
  };

  // Launch store action
  const handleLaunchStore = () => {
    setIsLaunching(true);

    try {
      const user = getCurrentUser();
      const ownerId = user?.id || 'usr_owner_demo';

      const categoriesPayload = selectedCategories.map(c => ({
        name: c,
        slug: c.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      }));

      const newStore = createStore(
        {
          slug,
          name: name.trim(),
          logo,
          banner,
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          businessType,
          currency: 'INR',
          themeId: selectedTheme.id,
          primaryColor: selectedTheme.primaryColor,
          accentColor: selectedTheme.accentColor,
          fontFamily: selectedTheme.fontFamily,
          footerText: `Crafted with Cypher Store Builder. High quality products delivered directly to you.`
        },
        ownerId,
        categoriesPayload,
        productsToImport
      );

      // Trigger Confetti Celebration!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore if confetti unavailable
      }

      toast.success(`🎉 Store "${newStore.name}" is now live!`);
      setTimeout(() => {
        onComplete(newStore.slug);
      }, 1000);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create store');
      setIsLaunching(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/40 py-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
              <StoreIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-slate-900 text-lg sm:text-xl tracking-tight">
                Cypher Store Builder
              </h1>
              <p className="text-xs text-slate-500">
                Setup your online store in 5 simple steps
              </p>
            </div>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Exit Setup
            </button>
          )}
        </div>

        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-slate-200/80 mb-6 sm:mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 mb-2.5">
            <span className={`hidden sm:inline ${currentStep === 1 ? 'text-indigo-600 font-bold' : ''}`}>1. Store Info</span>
            <span className={`hidden sm:inline ${currentStep === 2 ? 'text-indigo-600 font-bold' : ''}`}>2. Categories</span>
            <span className={`hidden sm:inline ${currentStep === 3 ? 'text-indigo-600 font-bold' : ''}`}>3. Products</span>
            <span className={`hidden sm:inline ${currentStep === 4 ? 'text-indigo-600 font-bold' : ''}`}>4. Theme</span>
            <span className={`hidden sm:inline ${currentStep === 5 ? 'text-indigo-600 font-bold' : ''}`}>5. Launch</span>

            <span className="sm:hidden text-indigo-600 font-extrabold text-xs">
              Step {currentStep} of 5: {
                currentStep === 1 ? 'Store Info' :
                currentStep === 2 ? 'Categories' :
                currentStep === 3 ? 'Catalog Import' :
                currentStep === 4 ? 'Theme & Preview' : 'Review & Launch'
              }
            </span>
            <span className="sm:hidden text-slate-400 font-mono text-[11px] font-bold">
              {Math.round((currentStep / 5) * 100)}%
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP CONTENT CONTAINER */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
          {/* STEP 1: General Info */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 1: Store Details & URL
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Tell us about your brand. Each store receives a unique live storefront URL.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Store Name *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => handleNameChange(e.target.value)}
                    placeholder="Enter your store name"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Unique Storefront URL Slug *
                  </label>
                  <div className="flex items-center rounded-lg border border-slate-300 overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500">
                    <span className="bg-slate-100 text-slate-500 px-3 py-2.5 text-xs font-mono border-r border-slate-300 shrink-0">
                      cypher.store/s/
                    </span>
                    <input
                      type="text"
                      value={slug}
                      placeholder="store-slug"
                      onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="w-full px-3 py-2.5 text-sm font-mono focus:outline-none"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Your public store will be accessible at this custom URL.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Business Type *
                  </label>
                  <select
                    value={businessType}
                    onChange={e => setBusinessType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
                  >
                    <option value="Fashion & Apparel">Fashion & Apparel</option>
                    <option value="Electronics & Gadgets">Electronics & Gadgets</option>
                    <option value="Food & Beverages">Food & Beverages</option>
                    <option value="Health & Beauty">Health & Beauty</option>
                    <option value="Home & Living">Home & Living</option>
                    <option value="Books & Stationery">Books & Stationery</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Toys & Games">Toys & Games</option>
                    <option value="General Merchandise">General Merchandise</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Store Support Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Enter store contact email"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="Enter 10-digit mobile number"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Store Logo URL (Optional)
                  </label>
                  <input
                    type="text"
                    value={logo}
                    onChange={e => setLogo(e.target.value)}
                    placeholder="https://... (leave blank for auto monogram)"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5">
                    Store Physical Address *
                  </label>
                  <textarea
                    rows={2}
                    value={address}
                    onChange={e => setAddress(e.target.value)}
                    placeholder="City, State, and PIN code"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Categories */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 2: Category Selection
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Choose from 14 predefined retail categories or add custom ones for your catalog.
                </p>
              </div>

              {/* Predefined Categories Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {PREDEFINED_CATEGORIES.map(cat => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-sm font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 text-indigo-900 ring-1 ring-indigo-600 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                      }`}
                    >
                      <span>{cat}</span>
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-slate-300 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Add Category */}
              <div className="pt-4 border-t border-slate-100">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-2">
                  Add Custom Category
                </label>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={customCatInput}
                    onChange={e => setCustomCatInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddCustomCategory()}
                    placeholder="e.g. Leather Wallets"
                    className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomCategory}
                    className="px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">
                  {selectedCategories.length} categories chosen for your store
                </span>
                <span className="text-xs font-semibold text-indigo-600">
                  {selectedCategories.slice(0, 3).join(', ')}
                  {selectedCategories.length > 3 ? ` + ${selectedCategories.length - 3} more` : ''}
                </span>
              </div>
            </div>
          )}

          {/* STEP 3: Product Import */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 3: Product Import
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Populate your catalog instantly with realistic samples or upload your own spreadsheet.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option A: Import Dummy Products */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    importMode === 'dummy'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  onClick={handleImportDummyProducts}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-sm">
                      <Zap className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                      ⚡ Sample Catalog
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      One-click fills realistic sample Indian items with INR prices and stock for instant testing.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      handleImportDummyProducts();
                    }}
                    className="w-full py-2.5 px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-colors cursor-pointer"
                  >
                    Generate Samples
                  </button>
                </div>

                {/* Option B: Upload CSV/Excel */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    importMode === 'file'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-sm">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                      📄 Upload CSV / Excel
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Import existing products via Excel (.xlsx) or CSV spreadsheet with error checks.
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="w-full py-2.5 px-3 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors text-center cursor-pointer flex items-center justify-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span className="truncate">{fileName ? fileName : 'Choose File'}</span>
                      <input
                        type="file"
                        accept=".csv, .xlsx, .xls"
                        className="hidden"
                        onChange={handleFileUpload}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={downloadTemplate}
                      className="w-full py-2 px-3 border border-slate-300 text-slate-700 rounded-xl text-[11px] font-semibold hover:bg-slate-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Template</span>
                    </button>
                  </div>
                </div>

                {/* Option C: Start with Empty Catalog */}
                <div
                  className={`p-5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                    importMode === 'empty'
                      ? 'border-indigo-600 bg-indigo-50/40 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                  onClick={() => {
                    setProductsToImport([]);
                    setImportMode('empty');
                    toast.success('Clean store selected! Add your own products later in Admin.');
                  }}
                >
                  <div>
                    <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center mb-3 shadow-sm">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">
                      ✨ Clean Empty Store
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Start fresh without any dummy data. You can easily add real products anytime from the Admin panel.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setProductsToImport([]);
                      setImportMode('empty');
                      toast.success('Clean store selected! Add products in Admin.');
                    }}
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      importMode === 'empty'
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    {importMode === 'empty' ? '✓ Empty Store Selected' : 'Start Fresh'}
                  </button>
                </div>
              </div>

              {/* Error report */}
              {fileErrors.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <span>Upload Error Report:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 ml-2">
                    {fileErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Products Preview Summary */}
              {productsToImport.length > 0 && (
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Catalog Preview ({productsToImport.length} products ready)
                    </span>
                    <span className="text-xs text-indigo-600 font-semibold">
                      Mode: {importMode === 'dummy' ? 'Dummy Samples' : 'Uploaded Spreadsheet'}
                    </span>
                  </div>
                  <div className="max-h-52 overflow-y-auto divide-y divide-slate-200">
                    {productsToImport.map((p, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <img
                            src={p.image}
                            alt=""
                            className="w-8 h-8 rounded-md object-cover bg-slate-200 shrink-0"
                          />
                          <div>
                            <span className="font-semibold text-slate-900">{p.name}</span>
                            <span className="text-slate-400 ml-2">({p.categoryName || 'General'})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-mono tabular-nums text-slate-600">Stock: {p.stock}</span>
                          <span className="font-bold text-slate-900 tabular-nums">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: Theme Selection with LIVE PREVIEW */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 4: Theme Selection & Live Preview
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Select from 4 distinct styles. Colors, typography, and card treatments change together dynamically.
                </p>
              </div>

              {/* Theme Cards Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {THEMES.map(th => {
                  const isSelected = selectedTheme.id === th.id;
                  return (
                    <div
                      key={th.id}
                      onClick={() => setSelectedTheme(th)}
                      className={`p-4 rounded-xl border-2 transition-all cursor-pointer text-left ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-1 ring-indigo-600'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div
                        className="h-10 rounded-lg mb-3 shadow-xs flex items-center justify-center text-white text-xs font-bold"
                        style={{ background: th.bannerBg }}
                      >
                        {th.name}
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-bold text-slate-900 text-sm">{th.name}</h4>
                        {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {th.description}
                      </p>
                      <div className="flex items-center gap-1.5 mt-3 pt-2 border-t border-slate-100">
                        <div
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: th.primaryColor }}
                        />
                        <div
                          className="w-4 h-4 rounded-full border border-black/10"
                          style={{ backgroundColor: th.accentColor }}
                        />
                        <span className="text-[10px] text-slate-400 font-mono ml-auto">
                          {th.fontFamily}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* LIVE STOREFRONT PREVIEW PANEL */}
              <div className="mt-6 border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between text-xs font-semibold">
                  <span>Interactive Live Preview ({selectedTheme.name} Theme)</span>
                  <span className="font-mono text-slate-400">/s/{slug}</span>
                </div>

                <div
                  style={{
                    fontFamily:
                      selectedTheme.fontFamily === 'Inter'
                        ? 'Inter, sans-serif'
                        : selectedTheme.fontFamily === 'Georgia'
                        ? 'Georgia, serif'
                        : selectedTheme.fontFamily === 'Courier'
                        ? 'Courier, monospace'
                        : 'system-ui, sans-serif'
                  }}
                  className="p-6 bg-slate-50"
                >
                  {/* Mock Store Header */}
                  <div className="bg-white rounded-xl p-4 shadow-xs border border-slate-200/80 flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: selectedTheme.primaryColor }}
                      >
                        {name.charAt(0) || 'S'}
                      </div>
                      <div>
                        <div className="font-bold text-slate-900 text-sm">{name}</div>
                        <div className="text-[10px] text-slate-400">{businessType}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-md text-white font-medium" style={{ backgroundColor: selectedTheme.primaryColor }}>
                        Cart (2)
                      </span>
                    </div>
                  </div>

                  {/* Mock Hero Banner */}
                  <div
                    className="rounded-xl p-6 text-white mb-6 shadow-sm"
                    style={{ background: selectedTheme.bannerBg }}
                  >
                    <div className="max-w-md">
                      <span
                        className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm"
                        style={{ backgroundColor: selectedTheme.accentColor, color: '#000' }}
                      >
                        New Season Catalog
                      </span>
                      <h3 className="text-xl font-bold mt-2 tracking-tight">
                        Welcome to {name}
                      </h3>
                      <p className="text-xs text-white/80 mt-1">
                        Explore our handcrafted collections with express delivery.
                      </p>
                    </div>
                  </div>

                  {/* Mock Products Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    {(productsToImport.slice(0, 2)).map((p, i) => (
                      <div key={i} className="bg-white rounded-xl p-3 border border-slate-200/80 shadow-xs flex flex-col justify-between">
                        <div>
                          <img src={p.image} alt="" className="w-full h-24 object-cover rounded-lg mb-2" />
                          <div className="text-[11px] text-slate-400">{p.categoryName}</div>
                          <div className="font-semibold text-slate-900 text-xs line-clamp-1">{p.name}</div>
                        </div>
                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <span className="font-bold text-slate-900 text-xs tabular-nums">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <button
                            type="button"
                            style={{ backgroundColor: selectedTheme.primaryColor }}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white rounded-md"
                          >
                            Add
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Review & Launch */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                  Step 5: Review & Launch Store
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Everything is configured. Review your store specs before going live to the world!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50/70 p-6 rounded-2xl border border-slate-200">
                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Store Name
                    </span>
                    <p className="text-base font-bold text-slate-900">{name}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Live Storefront URL
                    </span>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="font-mono text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200">
                        /s/{slug}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Business Type
                    </span>
                    <p className="text-xs font-semibold text-slate-700">{businessType}</p>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Contact & Address
                    </span>
                    <p className="text-xs text-slate-600">{email} · {phone}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{address}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Selected Theme
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <div
                        className="w-5 h-5 rounded-md border border-black/10"
                        style={{ backgroundColor: selectedTheme.primaryColor }}
                      />
                      <span className="font-semibold text-xs text-slate-900">{selectedTheme.name}</span>
                      <span className="text-xs text-slate-400">({selectedTheme.fontFamily})</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Categories ({selectedCategories.length})
                    </span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedCategories.map(c => (
                        <span key={c} className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-md text-slate-700">
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Total Products Ready
                    </span>
                    <p className="text-base font-bold text-slate-900">
                      {productsToImport.length} items
                    </p>
                  </div>
                </div>
              </div>

              {/* Ready to Launch Banner */}
              <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    Ready to Launch Your Store!
                  </h3>
                  <p className="text-xs text-indigo-200 mt-1">
                    Clicking launch creates your isolated tenant database and routes you to your admin dashboard.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLaunchStore}
                  disabled={isLaunching}
                  className="px-6 py-3 bg-amber-400 text-slate-950 font-bold rounded-xl text-sm hover:bg-amber-300 transition-all active:scale-95 shadow-md flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  {isLaunching ? (
                    <span>Launching...</span>
                  ) : (
                    <>
                      <span>🚀 Launch Store</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* NAVIGATION BUTTONS */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : <div />}

            {currentStep < 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
