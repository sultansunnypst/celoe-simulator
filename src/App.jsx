import React, { useState, useEffect, useRef } from 'react';
import { 
  Calculator, BookOpen, Video, CheckCircle, Info, BarChart, 
  Settings, UserCircle, ShieldCheck, HelpCircle, ChevronDown, 
  ChevronUp, Table, X, RefreshCw, ArrowRight, LogOut, Moon, Sun,
  History, Users, FileText, Lock, Save, Eye, Trash2, Mail, User, Edit3, Globe, Download, Copy, PenTool, Sliders, LayoutTemplate, PlusCircle, FolderOpen, Layers, CheckSquare,
  TrendingUp, DollarSign, Target, PieChart
} from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { 
  getAuth, signInWithEmailAndPassword, signInAnonymously, 
  signOut, onAuthStateChanged, sendPasswordResetEmail, 
  signInWithCustomToken 
} from 'firebase/auth';
import { 
  getFirestore, collection, addDoc, getDocs, query, 
  where, doc, updateDoc, orderBy, setDoc, getDoc 
} from 'firebase/firestore';

// --- CONFIGURATION SWITCH ---
// Set to TRUE to use actual Firebase backend. Set to FALSE for purely local Offline/Demo mode.
const USE_FIREBASE = false; 

// --- FIREBASE INIT ---
let app, auth, db;
let appId = 'offline-mode';

if (USE_FIREBASE) {
  const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  
  const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
  appId = rawAppId.replace(/[\/.]/g, '_'); 
}

// --- DATA CONSTANTS (DEFAULT) ---
const DEFAULT_COURSE_TYPES = [
  { id: 'regular', name: 'Regular Course', multiplier: 1.0, basePrice: 100000, description: 'Adaptasi Mata Kuliah Reguler' },
  { id: 'micro', name: 'Microcredentials', multiplier: 1.25, basePrice: 150000, description: 'Kursus Kompetensi Spesifik' },
  { id: 'coe', name: 'Centre of Excellence', multiplier: 1.5, basePrice: 200000, description: 'Kursus Profesional Unggulan' },
  { id: 'prof', name: 'Professor Course', multiplier: 2.0, basePrice: 300000, description: 'Kursus Eksklusif Profesor' },
];

// --- TRANSLATIONS ---
const TRANSLATIONS = {
  id: {
    appTitle: "CeLOE Course Pricing Simulation", 
    pricingEngine: "Pricing Engine", 
    loginTitle: "Masuk",
    email: "Email",
    password: "Kata Sandi",
    signIn: "Masuk",
    signInDisabled: "Masuk Dinonaktifkan (Offline)",
    devLogin: "Login Cepat Pengembang",
    offlineMode: "MODE OFFLINE / DEMO",
    newCalc: "Kalkulasi Baru",
    bepCalc: "Simulasi BEP / Hibah", // NEW TAB TITLE
    history: "Riwayat Awan",
    userMgmt: "Manajemen Pengguna",
    adminSettings: "Pengaturan Admin",
    profile: "Profil",
    courseInfo: "Informasi Mata Kuliah",
    courseName: "Nama Mata Kuliah",
    courseCode: "Kode Mata Kuliah",
    lecturerName: "Nama Dosen",
    sks: "Jumlah SKS",
    configuration: "TYPE OF COURSE", 
    courseType: "Jenis Kursus",
    multiplier: "Pengali",
    pokokBahasan: "Pokok Bahasan (PB)",
    estVideos: "Est. Video",
    adminOverride: "Override Admin",
    costPerPB: "Biaya per PB",
    platformFee: "Biaya Platform",
    components: "Komponen",
    completeness: "Kelengkapan",
    selectAll: "Pilih Semua (Tab Ini)",
    included: "Termasuk",
    potential: "Potensi",
    priceEstimation: "Result / Hasil", 
    lecturerBase: "Pendapatan Dosen",
    finalPrice: "Harga Enrollment Akhir",
    saveCloud: "Simpan ke Awan",
    downloadOfficial: "Download Official PDF", 
    updateCalc: "Perbarui Kalkulasi",
    viewRef: "Lihat Tabel Referensi",
    savedCalc: "Riwayat Kalkulasi",
    refresh: "Segarkan",
    dateCourse: "Tanggal / Dosen",
    details: "Detail",
    price: "Harga",
    status: "Status",
    actions: "Aksi",
    addUser: "Tambah Pengguna",
    name: "Nama",
    role: "Peran",
    addToDB: "Tambah ke DB",
    userDB: "Database Pengguna",
    accountID: "ID Akun",
    active: "Aktif",
    editProfile: "Edit Profil",
    cancel: "Batal",
    saveChanges: "Simpan Perubahan",
    fullName: "Nama Lengkap",
    roleReadOnly: "Peran (Baca Saja)",
    locked: "TERKUNCI",
    activeStatus: "AKTIF",
    submitted: "SUBMITTED",
    approved: "APPROVED",
    preview: "Pratinjau",
    download: "Unduh PDF",
    edit: "Edit",
    copy: "Salin",
    editingMode: "Mode Edit",
    updateDoc: "Memperbarui dokumen yang ada.",
    referenceTable: "Tabel Referensi Rentang Harga",
    simNet: "Simulasi pendapatan Bersih Dosen dengan parameter",
    lowest: "Terendah",
    highest: "Tertinggi",
    close: "Tutup",
    guest: "Tamu",
    user: "Pengguna",
    docLockedInfo: "Dokumen terkunci setelah download.",
    globalParams: "Parameter Global & Multiplier", 
    globalParamsDesc: "Atur variabel dasar dan angka pengali (multiplier) untuk setiap jenis kursus.", 
    saveSettings: "Simpan Pengaturan", 
    settingsSaved: "Pengaturan Berhasil Disimpan", 
    futureFeat: "Fitur Mendatang",
    templates: "Template",
    saveTemplate: "Simpan Template",
    loadTemplate: "Muat Template",
    templateName: "Nama Template",
    templateSaved: "Template Berhasil Disimpan",
    noTemplates: "Belum ada template tersimpan.",
    version: "Versi",
    newVersionCreated: "Versi Baru (V{v}) dibuat untuk menjaga riwayat.",
    manageTemplates: "Kelola Template",
    tabProfile: "Profil MK",
    tabPB: "PB",
    pbChecklist: "Checklist Kelengkapan PB",
    missing: "Belum Lengkap",
    complete: "Lengkap",
    // BEP Translations
    grantInput: "Input Dana Hibah",
    grantAmount: "Nilai Hibah Diterima (Rp)",
    grantDesc: "Masukkan total dana hibah produksi yang diterima.",
    calcScenario: "Skenario Perhitungan",
    targetStudentLabel: "Target Jumlah Mahasiswa",
    recPriceLabel: "Rekomendasi Harga Jual",
    bepVolumeLabel: "Titik Impas (Jumlah Mahasiswa)",
    sellingPriceLabel: "Harga Jual per Mahasiswa (Rp)",
    revenueProj: "Proyeksi Pemasukan",
    totalRevenue: "Total Pemasukan",
    profitLoss: "Untung / Rugi",
    bepSummary: "Ringkasan BEP",
    resetDefault: "Reset Default",
    loadFromCalc: "Ambil dari Kalkulator"
  },
  en: {
    appTitle: "CeLOE Course Pricing Simulation", 
    pricingEngine: "Pricing Engine", 
    loginTitle: "Sign In",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signInDisabled: "Sign In Disabled (Offline)",
    devLogin: "Dev Quick Login",
    offlineMode: "OFFLINE / DEMO MODE",
    newCalc: "New Calculation",
    bepCalc: "BEP / Grant Simulation", // NEW TAB TITLE
    history: "Cloud History",
    userMgmt: "User Mgmt",
    adminSettings: "Admin Settings", 
    profile: "Profile",
    courseInfo: "Course Info",
    courseName: "Course Name",
    courseCode: "Course Code",
    lecturerName: "Lecturer Name",
    sks: "Credits (SKS)",
    configuration: "TYPE OF COURSE", 
    courseType: "Course Type",
    multiplier: "Multiplier",
    pokokBahasan: "Modules (PB)",
    estVideos: "Est. Videos",
    adminOverride: "Admin Override",
    costPerPB: "Cost per PB",
    platformFee: "Platform Fee",
    components: "Components",
    completeness: "Completeness",
    selectAll: "Select All (This Tab)",
    included: "Included",
    potential: "Potential",
    priceEstimation: "Result / Hasil",
    lecturerBase: "Lecturer Revenue",
    finalPrice: "Final Enrollment Price",
    saveCloud: "Save to Cloud",
    downloadOfficial: "Download Official PDF",
    updateCalc: "Update Calculation",
    viewRef: "View Reference Table",
    savedCalc: "Cloud History",
    refresh: "Refresh",
    dateCourse: "Date / Lecturer",
    details: "Details",
    price: "Price",
    status: "Status",
    actions: "Action",
    addUser: "Add User",
    name: "Name",
    role: "Role",
    addToDB: "Add to DB",
    userDB: "User Database",
    accountID: "Account ID",
    active: "Active",
    editProfile: "Edit Profile",
    cancel: "Cancel",
    saveChanges: "Save Changes",
    fullName: "Full Name",
    roleReadOnly: "Role (ReadOnly)",
    locked: "LOCKED",
    activeStatus: "ACTIVE",
    submitted: "SUBMITTED",
    approved: "APPROVED",
    preview: "Preview",
    download: "Download PDF",
    edit: "Edit",
    copy: "Copy",
    editingMode: "Editing Mode",
    updateDoc: "Updating existing document.",
    referenceTable: "Price Range Reference Table",
    simNet: "Lecturer Net Income simulation with parameter",
    lowest: "Lowest",
    highest: "Highest",
    close: "Close",
    guest: "Guest",
    user: "User",
    docLockedInfo: "Document locked after download.",
    globalParams: "Global Parameters & Multipliers", 
    globalParamsDesc: "Set base variables and multipliers for each course type.", 
    saveSettings: "Save Settings", 
    settingsSaved: "Settings Saved Successfully", 
    futureFeat: "Future Features",
    templates: "Templates",
    saveTemplate: "Save as Template",
    loadTemplate: "Load Template",
    templateName: "Template Name",
    templateSaved: "Template Saved Successfully",
    noTemplates: "No templates saved yet.",
    version: "Version",
    newVersionCreated: "New Version (V{v}) created to preserve history.",
    manageTemplates: "Manage Templates",
    tabProfile: "Course Profile",
    tabPB: "Module",
    pbChecklist: "Module Checklist",
    missing: "Incomplete",
    complete: "Complete",
    // BEP Translations
    grantInput: "Grant Input",
    grantAmount: "Grant Amount Received (Rp)",
    grantDesc: "Enter the total production grant amount received.",
    calcScenario: "Calculation Scenarios",
    targetStudentLabel: "Target Number of Students",
    recPriceLabel: "Recommended Selling Price",
    bepVolumeLabel: "Break-Even Volume (Students)",
    sellingPriceLabel: "Selling Price per Student (Rp)",
    revenueProj: "Revenue Projection",
    totalRevenue: "Total Revenue",
    profitLoss: "Profit / Loss",
    bepSummary: "BEP Summary",
    resetDefault: "Reset Default",
    loadFromCalc: "Load from Calculator"
  }
};

const COMPONENT_GROUPS = {
  profile: {
    key: 'profile',
    title: "1. Komponen Profil Mata Kuliah",
    type: "static", 
    items: [
      { id: 'p_name', label: 'Nama Mata Kuliah' },
      { id: 'p_code', label: 'Kode Mata Kuliah' },
      { id: 'p_sks', label: 'Jumlah SKS' },
      { id: 'p_desc', label: 'Profil/Deskripsi Mata Kuliah' },
      { id: 'p_topics', label: 'Daftar Pokok Bahasan' },
      { id: 'p_syllabus', label: 'Silabus' },
      { id: 'p_outcomes', label: 'Peta Capaian Pembelajaran' },
      { id: 'p_nav', label: 'Navigasi Belajar Mandiri' },
      { id: 'p_best', label: 'Best Practice' },
      { id: 'p_cert', label: 'Sertifikasi (Jika ada)' },
      { id: 'p_team', label: 'Identitas Tim Pengembang' },
      { id: 'p_ref', label: 'Referensi Mata Kuliah' },
    ]
  },
  module: {
    key: 'module',
    title: "2. Komponen Materi per PB",
    type: "dynamic", 
    items: [
      { id: 'm_guide', label: 'Panduan Pembelajaran' },
      { id: 'm_notes', label: 'Lecture Notes' },
      { id: 'm_task', label: 'Konten Tugas' },
      { id: 'm_forum', label: 'Forum Diskusi' },
      { id: 'm_quiz', label: 'Quiz Review' },
      { id: 'm_link', label: 'External Link' },
    ]
  },
  production: {
    key: 'production',
    title: "3. Komponen Produksi Video",
    type: "dynamic", 
    items: [
      { id: 'v_script', label: 'Naskah/Skrip Materi Pembelajaran' },
      { id: 'v_ppt', label: 'Slide PPT Materi' },
      { id: 'v_popquiz', label: 'Soal Pop Quiz' },
    ]
  }
};

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(amount);
};

// --- COMPONENTS ---

const ReferenceTableModal = ({ onClose, costPerPB, lang, courseTypes }) => {
  const t = (k) => TRANSLATIONS[lang][k];
  return (
    <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-4xl overflow-hidden">
        <div className="bg-red-900 text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold flex items-center">
            <Table className="w-5 h-5 mr-2" />
            {t('referenceTable')}
          </h3>
          <button onClick={onClose} className="hover:bg-red-800 p-1 rounded transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-x-auto">
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
            {t('simNet')}: <strong>{formatCurrency(costPerPB)}</strong>
          </p>
          <table className="w-full text-sm text-left border-collapse">
            <thead className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 uppercase text-xs font-bold">
              <tr>
                <th className="p-3 border dark:border-slate-600 rounded-tl-lg">{t('courseType')}</th>
                <th className="p-3 border dark:border-slate-600 text-center bg-red-50 dark:bg-red-900/30 text-red-900 dark:text-red-300">
                  {t('lowest')}<br/><span className="text-[10px] font-normal normal-case opacity-75">(1 PB, 0%)</span>
                </th>
                <th className="p-3 border dark:border-slate-600 text-center bg-green-50 dark:bg-green-900/30 text-green-900 dark:text-green-300">
                  {t('highest')}<br/><span className="text-[10px] font-normal normal-case opacity-75">(14 PB, 100%)</span>
                </th>
                <th className="p-3 border dark:border-slate-600 rounded-tr-lg text-center">{t('multiplier')}</th>
              </tr>
            </thead>
            <tbody>
              {courseTypes.map((type, idx) => {
                // Adjust ref table to show min (1PB) to max (14PB) range
                const minRaw = type.basePrice + (1 * costPerPB); 
                const maxRaw = type.basePrice + (14 * costPerPB); 
                const minNet = (minRaw * 0.4) * type.multiplier;
                const maxNet = (maxRaw * 1.0) * type.multiplier;
                return (
                  <tr key={type.id} className={`border-b dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'}`}>
                    <td className="p-3 border dark:border-slate-600 font-medium text-slate-900 dark:text-slate-100">{type.name}</td>
                    <td className="p-3 border dark:border-slate-600 text-center font-mono text-red-700 dark:text-red-400">{formatCurrency(Math.round(minNet/1000)*1000)}</td>
                    <td className="p-3 border dark:border-slate-600 text-center font-mono text-green-700 dark:text-green-400 font-bold">{formatCurrency(Math.round(maxNet/1000)*1000)}</td>
                    <td className="p-3 border dark:border-slate-600 text-center text-slate-500 dark:text-slate-400">{type.multiplier}x</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// --- MAIN APP ---

export default function App() {
  // --- STATE ---
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [view, setView] = useState('login'); 
  const [activeTab, setActiveTab] = useState('calculator'); 
  const [darkMode, setDarkMode] = useState(false);
  const [lang, setLang] = useState('en'); 
  
  // Calculator Logic State
  const [courseName, setCourseName] = useState('');
  const [courseCode, setCourseCode] = useState('');
  const [courseSks, setCourseSks] = useState(''); 
  const [lecturerName, setLecturerName] = useState(''); 
  const [courseType, setCourseType] = useState('regular');
  const [numPB, setNumPB] = useState(7); 
  const [selectedComponents, setSelectedComponents] = useState(new Set()); 
  
  // BEP Logic State - UPDATED DEFAULTS
  const [bepValues, setBepValues] = useState({
    grantAmount: 10000000,
    targetStudents: 50,
    sellingPrice: 200000,
    courseType: 'regular'
  });

  // Global Params now includes courseTypes for dynamic admin editing
  const [globalParams, setGlobalParams] = useState({ 
    costPerPB: 30000, 
    platformFeePercent: 20,
    courseTypes: DEFAULT_COURSE_TYPES
  });
  
  const [pricingResult, setPricingResult] = useState(null);
  const [showFormula, setShowFormula] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  
  // UI State for Components Tab
  const [activeComponentTab, setActiveComponentTab] = useState('profile'); // 'profile', '1', '2', ... 'numPB'

  // New: Template & Versioning
  const [templates, setTemplates] = useState([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingItemStatus, setEditingItemStatus] = useState(null); // Track status of item being edited
  const [editingVersion, setEditingVersion] = useState(1);

  // Data Lists
  const [historyList, setHistoryList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loadingData, setLoadingData] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Profile Edit State
  const [editProfileMode, setEditProfileMode] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', role: '' });

  const t = (key) => TRANSLATIONS[lang][key];

  // --- EFFECTS ---

  useEffect(() => {
    const loadScript = (id, src) => {
      if (!document.getElementById(id)) {
        const script = document.createElement('script');
        script.id = id;
        script.src = src;
        script.async = true;
        document.body.appendChild(script);
      }
    }
    loadScript('jspdf-script', "[https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js)");
    loadScript('jspdf-autotable', "[https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js](https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.1/jspdf.plugin.autotable.min.js)"); // Added autoTable
    loadScript('qrious-script', "[https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js](https://cdnjs.cloudflare.com/ajax/libs/qrious/4.0.2/qrious.min.js)");

    // Load Global Settings
    if (USE_FIREBASE && db) {
      const fetchGlobalParams = async () => {
        try {
          const docRef = doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global');
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
             // Merge with defaults to ensure courseTypes exists if old data doesn't have it
             setGlobalParams({ ...globalParams, ...docSnap.data() });
          }
        } catch (e) {
          console.warn("Using default global params", e);
        }
      };
      fetchGlobalParams();
    }
  }, []);

  useEffect(() => {
    if (!USE_FIREBASE) {
      setAuthLoading(false);
      return;
    }

    const initAuth = async () => {
      if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
        await signInWithCustomToken(auth, __initial_auth_token);
      } else {
        await signInAnonymously(auth);
      }
      
      const unsubscribe = onAuthStateChanged(auth, async (u) => {
        if (u) {
          setUser(u);
          try {
            const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'users'), where("email", "==", u.email));
            const sn = await getDocs(q);
            if (!sn.empty) {
              setUserData({ ...sn.docs[0].data(), id: sn.docs[0].id });
              setLecturerName(sn.docs[0].data().name); // Set default lecturer name
            } else {
              const role = u.email?.includes('admin') ? 'admin' : 'lecturer';
              setUserData({ name: u.displayName || u.email?.split('@')[0], role, email: u.email });
              setLecturerName(u.displayName || u.email?.split('@')[0]);
            }
            setView('dashboard');
            loadTemplates(u.uid); // Load templates on login
          } catch (e) {
            console.error("Profile load error", e);
          }
        } else {
          setUser(null);
          setUserData(null);
          setView('login');
        }
        setAuthLoading(false);
      });
      return () => unsubscribe();
    };
    initAuth();
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  useEffect(() => {
    calculatePrice();
  }, [courseType, numPB, selectedComponents, globalParams]);

  useEffect(() => {
    if (userData?.role === 'admin' && activeTab === 'calculator') {
      setActiveTab('history');
      loadHistory(); 
    }
  }, [userData]);

  // Ensure activeComponentTab is valid when numPB decreases
  useEffect(() => {
    if (activeComponentTab !== 'profile' && parseInt(activeComponentTab) > numPB) {
      setActiveComponentTab('profile');
    }
  }, [numPB]);

  // --- LOGIC: TEMPLATES & VERSIONING ---

  const saveTemplate = async () => {
    const name = prompt(t('templateName'));
    if (!name) return;

    const templateData = {
      name,
      courseType,
      numPB,
      selectedComponents: Array.from(selectedComponents),
      userId: user?.uid || 'offline-user',
      createdAt: new Date().toISOString()
    };

    if (!USE_FIREBASE) {
      setTemplates(prev => [...prev, { ...templateData, id: 'tmp-' + Date.now() }]);
      alert(t('templateSaved'));
      return;
    }

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'templates'), templateData);
      alert(t('templateSaved'));
      loadTemplates(user.uid);
    } catch (e) {
      alert("Error: " + e.message);
    }
  };

  const loadTemplates = async (uid) => {
    if (!USE_FIREBASE || !uid) return;
    try {
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'templates'), where("userId", "==", uid));
      const sn = await getDocs(q);
      setTemplates(sn.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    }
  };

  const applyTemplate = (template) => {
    setCourseType(template.courseType);
    setNumPB(template.numPB);
    setSelectedComponents(new Set(template.selectedComponents));
    setShowTemplateModal(false);
  };

  // --- FUNCTIONS ---

  const calculatePrice = () => {
    const selectedType = globalParams.courseTypes.find(t => t.id === courseType) || globalParams.courseTypes[0];
    
    // Points Calc
    const profilePoints = COMPONENT_GROUPS.profile.items.length; 
    const pbItemsCount = COMPONENT_GROUPS.module.items.length + COMPONENT_GROUPS.production.items.length;
    const totalPossiblePoints = profilePoints + (pbItemsCount * numPB);

    let currentPoints = 0;
    
    // Count Profile Points
    COMPONENT_GROUPS.profile.items.forEach(item => {
      if (selectedComponents.has(item.id)) currentPoints += 1;
    });

    // Count PB Points
    for (let i = 1; i <= numPB; i++) {
       [...COMPONENT_GROUPS.module.items, ...COMPONENT_GROUPS.production.items].forEach(item => {
          const key = `pb_${i}_${item.id}`;
          if (selectedComponents.has(key)) currentPoints += 1;
       });
    }

    const completenessRatio = totalPossiblePoints > 0 ? (currentPoints / totalPossiblePoints) : 0;

    // Financials
    let rawPrice = selectedType.basePrice + (numPB * globalParams.costPerPB); 
    const baseFloor = 0.4; 
    const variablePortion = 0.6; 
    
    const effectivePrice = rawPrice * (baseFloor + (variablePortion * completenessRatio));
    const lecturerPrice = effectivePrice * selectedType.multiplier;

    // Transparency
    const totalVariablePot = (rawPrice * selectedType.multiplier) * variablePortion;
    const valPerPoint = totalPossiblePoints > 0 ? totalVariablePot / totalPossiblePoints : 0;
    
    const fee = lecturerPrice * (globalParams.platformFeePercent / 100);
    const total = lecturerPrice + fee;

    setPricingResult({
      lecturerBase: Math.round(lecturerPrice / 1000) * 1000, 
      platformFee: Math.round(fee / 1000) * 1000,
      finalPrice: Math.round(total / 1000) * 1000,
      completenessScore: Math.round(completenessRatio * 100),
      videoCount: numPB * 7, // Approximate
      rawPrice: rawPrice * selectedType.multiplier,
      maxPotentialValue: totalVariablePot,
      itemValue: valPerPoint // Unified item value for simplicity in display
    });
  };

  // Helper to handle checkbox toggle
  const toggleComponent = (id) => {
    const newSet = new Set(selectedComponents);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedComponents(newSet);
  };

  // Helper to Select All in Current Tab
  const selectAllInTab = (tabName) => {
     const newSet = new Set(selectedComponents);
     
     if (tabName === 'profile') {
        COMPONENT_GROUPS.profile.items.forEach(item => newSet.add(item.id));
     } else {
        const pbIndex = parseInt(tabName);
        [...COMPONENT_GROUPS.module.items, ...COMPONENT_GROUPS.production.items].forEach(item => {
           newSet.add(`pb_${pbIndex}_${item.id}`);
        });
     }
     setSelectedComponents(newSet);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!USE_FIREBASE) return;
    
    const email = e.target.email.value;
    const pass = e.target.password.value;
    try {
      setAuthLoading(true);
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (err) {
      alert("Login Failed: " + err.message);
      setAuthLoading(false);
    }
  };

  const handleDevLogin = async (role) => {
    if (!USE_FIREBASE) {
      setAuthLoading(true);
      setTimeout(() => {
        setUserData({ 
          name: role === 'admin' ? 'Admin Developer (Offline)' : 'Dosen Developer (Offline)', 
          role: role, 
          email: role + '@celoe.com' 
        });
        setLecturerName(role === 'admin' ? 'Admin Developer (Offline)' : 'Dosen Developer (Offline)');
        setUser({ uid: 'offline-' + role });
        setView('dashboard');
        setAuthLoading(false);
      }, 500);
      return;
    }

    try {
      setAuthLoading(true);
      await signInAnonymously(auth);
      setUserData({ 
        name: role === 'admin' ? 'Admin Developer' : 'Dosen Developer', 
        role: role, 
        email: role + '@celoe.com' 
      });
      setLecturerName(role === 'admin' ? 'Admin Developer' : 'Dosen Developer');
      setView('dashboard');
      setAuthLoading(false);
    } catch (e) {
      console.error(e);
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    if (USE_FIREBASE) {
      await signOut(auth);
    }
    setUser(null);
    setUserData(null);
    setView('login');
    setActiveTab('calculator');
  };

  // VERSIONING LOGIC HERE
  const saveCalculation = async () => {
    if (!user || !pricingResult) return;
    setLoadingData(true);
    
    const isNewVersion = editingId && (editingItemStatus === 'submitted' || editingItemStatus === 'approved');
    const nextVersion = isNewVersion ? editingVersion + 1 : editingVersion;

    const payload = {
      userId: user.uid,
      userEmail: userData?.email || user.email || 'offline',
      lecturerName: lecturerName || userData?.name || 'Unknown',
      courseName: courseName || 'Untitled Course',
      courseCode,
      courseSks,
      courseType,
      numPB,
      selectedComponents: Array.from(selectedComponents),
      pricingResult, 
      globalParams,
      createdAt: new Date().toISOString(),
      status: 'draft', 
      isPrinted: false,
      version: nextVersion,
      parentId: isNewVersion ? editingId : null // Link to parent if branching
    };

    if (!USE_FIREBASE) {
      if (editingId && !isNewVersion) {
        // Update existing Draft
        setHistoryList(prev => prev.map(item => item.id === editingId ? { ...payload, id: editingId } : item));
        alert('Data Updated (Offline Mode)!');
      } else {
        // New Doc or New Version
        const newId = 'offline-' + Date.now();
        setHistoryList(prev => [{ ...payload, id: newId }, ...prev]);
        alert(isNewVersion ? t('newVersionCreated').replace('{v}', nextVersion) : 'Data Saved (Offline Mode)!');
      }
      setEditingId(null);
      setEditingItemStatus(null);
      setLoadingData(false);
      setActiveTab('history');
      return;
    }

    try {
      if (editingId && !isNewVersion) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'calculations', editingId), payload);
        alert('Data Updated!');
      } else {
        await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'calculations'), payload);
        alert(isNewVersion ? t('newVersionCreated').replace('{v}', nextVersion) : 'Data Saved to Cloud!');
      }
      setEditingId(null);
      setEditingItemStatus(null);
      setActiveTab('history');
      loadHistory();
    } catch (e) {
      alert("Save failed: " + e.message);
    } finally {
      setLoadingData(false);
    }
  };

  const saveGlobalSettings = async () => {
    if (!USE_FIREBASE) {
      alert("Settings saved locally (Offline Mode)");
      return;
    }
    
    try {
      setLoadingData(true);
      await setDoc(doc(db, 'artifacts', appId, 'public', 'data', 'settings', 'global'), globalParams);
      alert(t('settingsSaved'));
    } catch (e) {
      alert("Failed to save settings: " + e.message);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDuplicate = (item) => {
    setCourseName(item.courseName + ' (Copy)');
    setCourseCode(item.courseCode || '');
    setCourseSks(item.courseSks || '');
    setLecturerName(item.lecturerName || '');
    setCourseType(item.courseType);
    setNumPB(item.numPB);
    setSelectedComponents(new Set(item.selectedComponents));
    if (item.globalParams) setGlobalParams(item.globalParams);
    
    // Reset Edit State so it saves as new V1
    setEditingId(null); 
    setEditingItemStatus(null);
    setEditingVersion(1);

    setActiveTab('calculator');
    window.scrollTo(0, 0);
  };

  const loadHistory = async () => {
    if (!USE_FIREBASE) {
      setLoadingData(true);
      setTimeout(() => setLoadingData(false), 500);
      return;
    }

    if (!db || !user) return;
    setLoadingData(true);
    try {
      const q = query(collection(db, 'artifacts', appId, 'public', 'data', 'calculations'), orderBy('createdAt', 'desc'));
      const sn = await getDocs(q);
      const list = sn.docs.map(d => ({ id: d.id, ...d.data() }));
      
      if (userData?.role !== 'admin') {
        setHistoryList(list.filter(i => i.userId === user.uid));
      } else {
        setHistoryList(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const loadUsers = async () => {
    if (!USE_FIREBASE) {
      setUsersList([
        { id: '1', name: 'Dr. Budi (Offline)', email: 'budi@celoe.com', role: 'lecturer' },
        { id: '2', name: 'Admin CeLOE (Offline)', email: 'admin@celoe.com', role: 'admin' }
      ]);
      return;
    }

    if (!db || userData?.role !== 'admin') return;
    setLoadingData(true);
    try {
      const sn = await getDocs(collection(db, 'artifacts', appId, 'public', 'data', 'users'));
      setUsersList(sn.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingData(false);
    }
  };

  const handleEdit = (item) => {
    if (item.isPrinted && item.status !== 'draft') {
      // Allow editing but it will trigger Versioning Logic in Save
    }
    setEditingId(item.id);
    setEditingItemStatus(item.status); // Store status to decide if we overwrite or version
    setEditingVersion(item.version || 1);

    setCourseName(item.courseName);
    setCourseCode(item.courseCode || '');
    setCourseSks(item.courseSks || '');
    setLecturerName(item.lecturerName || '');
    setCourseType(item.courseType);
    setNumPB(item.numPB);
    setSelectedComponents(new Set(item.selectedComponents));
    setActiveTab('calculator');
  };

  const addUser = async (e) => {
    e.preventDefault();
    const email = e.target.u_email.value;
    const name = e.target.u_name.value;
    const role = e.target.u_role.value;

    if (!USE_FIREBASE) {
      setUsersList(prev => [...prev, { id: 'off-' + Date.now(), email, name, role }]);
      alert("User Added (Offline Mode)");
      e.target.reset();
      return;
    }

    try {
      await addDoc(collection(db, 'artifacts', appId, 'public', 'data', 'users'), {
        email, name, role, createdAt: new Date().toISOString()
      });
      alert("User Added to DB");
      loadUsers();
      e.target.reset();
    } catch (e) {
      alert("Add failed: " + e.message);
    }
  };

  const updateProfile = async () => {
    if(!profileForm.name) return alert("Name required");
    
    // Optimistic Update
    setUserData(prev => ({...prev, name: profileForm.name}));
    setEditProfileMode(false);

    if(!USE_FIREBASE) {
      alert("Profile updated locally (Offline Mode)");
      return;
    }

    if(userData.id) {
      try {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'users', userData.id), {
          name: profileForm.name
        });
        alert("Profile saved to Cloud");
      } catch(e) {
        alert("Error saving profile: " + e.message);
      }
    } else {
      alert("Cannot save (Guest/Auth-only user)");
    }
  };

  const generatePDF = async (item, preview = false) => {
    if (!window.jspdf || !window.QRious) {
      alert("PDF/QR libraries are still loading. Please try again.");
      return;
    }

    const { jsPDF } = window.jspdf;
    const QRious = window.QRious; 

    const data = item || {
      courseName, courseCode, courseType, numPB,
      pricingResult, 
      lecturerName: lecturerName || userData?.name, // Use current state or user data
      courseSks, // Use current state
      selectedComponents: Array.from(selectedComponents) // Ensure array
    };
    
    const selectedSet = new Set(data.selectedComponents);
    
    // Create Doc ID for validation
    const docId = item?.id || 'DRAFT-' + Date.now();
    const verificationUrl = `https://celoe-platform.web.app/verify/${docId}`; 

    if (!preview && item && !item.isPrinted && USE_FIREBASE) {
        await updateDoc(doc(db, 'artifacts', appId, 'public', 'data', 'calculations', item.id), { isPrinted: true });
        loadHistory(); 
    } else if (!preview && item && !item.isPrinted && !USE_FIREBASE) {
        setHistoryList(prev => prev.map(h => h.id === item.id ? { ...h, isPrinted: true } : h));
        alert('Document Locked (Offline Mode)');
    }

    // GENERATE QR CODE IMAGE (BASE64)
    const qr = new QRious({
      value: verificationUrl,
      size: 200 
    });
    const qrDataUrl = qr.toDataURL();

    const docPdf = new jsPDF();
    
    // --- PAGE 1: ESTIMATION ---
    docPdf.setFillColor(153, 27, 27); 
    docPdf.rect(0, 0, 210, 40, 'F');
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFontSize(22);
    docPdf.setFont("helvetica", "bold");
    docPdf.text("CeLOE Pricing Document", 15, 25);
    docPdf.setFontSize(10);
    docPdf.setFont("helvetica", "normal");
    docPdf.text("Official Estimate & Validation", 15, 32);

    let y = 55;
    docPdf.setTextColor(0,0,0);
    docPdf.setFontSize(12);
    
    docPdf.text(`Course Name : ${data.courseName}`, 15, y);
    docPdf.text(`Course Code : ${data.courseCode || '-'}`, 150, y, { align: 'right' });
    y+=8;
    docPdf.setFontSize(10);
    docPdf.setTextColor(100,100,100);
    
    // Enhanced Info
    docPdf.text(`Lecturer : ${data.lecturerName || 'Unknown'}`, 15, y);
    docPdf.text(`SKS : ${data.courseSks || '-'}`, 15, y+6);
    docPdf.text(`Date : ${new Date().toLocaleDateString()}`, 150, y, { align: 'right' });
    
    y+=15;
    docPdf.setDrawColor(200);
    docPdf.line(15, y, 195, y);
    y+=10;

    docPdf.setTextColor(0,0,0);
    docPdf.setFontSize(12);
    docPdf.setFont("helvetica", "bold");
    docPdf.text("Configuration", 15, y);
    y+=8;
    docPdf.setFont("helvetica", "normal");
    docPdf.setFontSize(10);
    const typeName = globalParams.courseTypes.find(t=>t.id===data.courseType)?.name || data.courseType;
    docPdf.text(`Type : ${typeName}`, 15, y);
    docPdf.text(`Multiplier : ${data.pricingResult.rawPrice/data.pricingResult.lecturerBase < 1 ? '1.0x' : 'Wait'}`, 130, y); 
    y+=6;
    docPdf.text(`Modules : ${data.numPB} PB`, 15, y);
    docPdf.text(`Completeness : ${data.pricingResult.completenessScore}%`, 130, y);

    y+=15;
    docPdf.setFont("helvetica", "bold");
    docPdf.setFontSize(12);
    docPdf.text("Financial Breakdown", 15, y);
    y+=10;

    const row = (label, val, bold=false) => {
      docPdf.setFont("helvetica", bold ? "bold" : "normal");
      docPdf.text(label, 15, y);
      docPdf.text(formatCurrency(val), 190, y, { align: 'right' });
      y+=8;
    };

    row("Base Calculation", data.pricingResult.rawPrice);
    row("Quality Adjustment", data.pricingResult.maxPotentialValue - (data.pricingResult.maxPotentialValue * (data.pricingResult.completenessScore/100))); 
    y+=2;
    docPdf.line(15, y-6, 195, y-6);
    
    row("Lecturer Revenue", data.pricingResult.lecturerBase, true);
    row("Platform Fee", data.pricingResult.platformFee);
    
    y+=5;
    docPdf.setFillColor(240, 240, 240);
    docPdf.rect(15, y-5, 180, 15, 'F');
    docPdf.setTextColor(185, 28, 28);
    docPdf.setFontSize(14);
    docPdf.text("Final Enrollment Price", 20, y+5);
    docPdf.text(formatCurrency(data.pricingResult.finalPrice), 190, y+5, { align: 'right' });

    // --- QR CODE ON PAGE 1 ---
    let qrY = 230; 
    docPdf.addImage(qrDataUrl, 'JPEG', 160, qrY, 30, 30);
    docPdf.setFontSize(8);
    docPdf.setTextColor(150, 150, 150);
    docPdf.text("Scan to Verify Originality", 175, qrY+35, { align: 'center' });
    docPdf.text(`ID: ${docId.substring(0, 15)}...`, 175, qrY+39, { align: 'center' });

    // --- PAGE 2: CHECKLIST (FIXED LAYOUT) ---
    docPdf.addPage();
    docPdf.setFillColor(255, 255, 255);
    docPdf.setTextColor(0, 0, 0);
    docPdf.setFontSize(14);
    docPdf.setFont("helvetica", "bold");
    docPdf.text("Detailed Component Checklist", 15, 20);

    y = 35;
    docPdf.setFontSize(10);
    docPdf.setFont("helvetica", "bold");
    docPdf.text("1. Profile Components", 15, y);
    y += 10; // Extra spacing after header
    docPdf.setFont("helvetica", "normal");
    
    // Draw Profile Items - FIXED 2 COLUMN LOOP
    const profileItems = COMPONENT_GROUPS.profile.items;
    for (let i = 0; i < profileItems.length; i++) {
        const item = profileItems[i];
        const isChecked = selectedSet.has(item.id);
        const xPos = (i % 2 === 0) ? 15 : 110; 
        
        // Checkbox container
        docPdf.setDrawColor(200);
        docPdf.setFillColor(255, 255, 255);
        docPdf.rect(xPos, y-3.5, 5, 5, 'FD'); // Empty box background

        if(isChecked) {
            // Draw Green Checkmark
            docPdf.setDrawColor(0, 153, 51); // Green
            docPdf.setLineWidth(1);
            // Tick coordinates relative to box
            docPdf.line(xPos + 1, y - 1, xPos + 2.5, y + 0.5); // Down stroke
            docPdf.line(xPos + 2.5, y + 0.5, xPos + 4.5, y - 2.5); // Up stroke
            
            // Text Color for label (optional, keep black)
            docPdf.setTextColor(0, 0, 0); 
        } else {
             docPdf.setTextColor(100, 100, 100); 
        }
        
        docPdf.setFontSize(10);
        docPdf.setTextColor(0,0,0);
        docPdf.text(item.label, xPos + 8, y); 

        if (i % 2 === 1 || i === profileItems.length - 1) {
            y += 8;
        }
    }

    // Draw PB Matrix - MANUAL TABLE
    y += 10;
    docPdf.setFont("helvetica", "bold");
    docPdf.text("2. Module & Production Components (Per PB)", 15, y);
    y += 8;

    // Table Config
    const startX = 15;
    const totalWidth = 180;
    const nameColWidth = 60;
    const pbColWidth = (totalWidth - nameColWidth) / data.numPB;
    const rowHeight = 7;
    
    // Header
    docPdf.setFillColor(153, 27, 27); // Red Header
    docPdf.rect(startX, y, totalWidth, rowHeight, 'F');
    docPdf.setTextColor(255, 255, 255);
    docPdf.setFontSize(8);
    docPdf.text("Component", startX + 2, y + 5);
    
    for(let i=1; i<=data.numPB; i++) {
        const cx = startX + nameColWidth + ((i-1)*pbColWidth);
        docPdf.text(i.toString(), cx + (pbColWidth/2), y + 5, { align: 'center' });
    }
    y += rowHeight;

    // Rows
    docPdf.setTextColor(0, 0, 0);
    docPdf.setFont("helvetica", "normal");
    
    const allPbItems = [...COMPONENT_GROUPS.module.items, ...COMPONENT_GROUPS.production.items];
    
    allPbItems.forEach((item, index) => {
        // Alternating row color
        if(index % 2 === 0) docPdf.setFillColor(245, 245, 245);
        else docPdf.setFillColor(255, 255, 255);
        
        docPdf.rect(startX, y, totalWidth, rowHeight, 'F');
        
        // Label
        docPdf.text(item.label, startX + 2, y + 5);
        
        // Cells
        for(let i=1; i<=data.numPB; i++) {
            const key = `pb_${i}_${item.id}`;
            const cx = startX + nameColWidth + ((i-1)*pbColWidth);
            
            if(selectedSet.has(key)) {
                // Draw Green Check
                docPdf.setDrawColor(0, 153, 51);
                docPdf.setLineWidth(0.8);
                const tx = cx + (pbColWidth/2) - 1.5;
                const ty = y + 4;
                docPdf.line(tx, ty, tx + 1.5, ty + 1.5);
                docPdf.line(tx + 1.5, ty + 1.5, tx + 4, ty - 2.5);
            } else {
                // Draw small dot or dash
                docPdf.setFillColor(200);
                docPdf.circle(cx + (pbColWidth/2), y + 3.5, 0.5, 'F');
            }
        }
        y += rowHeight;
    });
    
    // Final Border
    docPdf.setDrawColor(200);
    docPdf.rect(startX, y - (allPbItems.length * rowHeight) - 7, totalWidth, (allPbItems.length * rowHeight) + 7, 'S');

    if (preview) {
      window.open(docPdf.output('bloburl'), '_blank');
    } else {
      docPdf.save(`CeLOE_Checklist_${data.courseName.replace(/\s+/g,'_')}.pdf`);
    }
  };

  // --- RENDER ---

  if (authLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
    </div>
  );

  if (view === 'login') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-900 transition-colors p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-2xl w-full max-w-md border-t-4 border-red-700 relative">
          {!USE_FIREBASE && (
            <div className="absolute top-0 left-0 w-full bg-yellow-500 text-yellow-900 text-xs text-center py-1 font-bold rounded-t-xl">
              {t('offlineMode')}
            </div>
          )}
          
          <div className="absolute top-4 right-4 flex gap-2 items-center">
             <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1">
                <button 
                  onClick={() => setLang('id')} 
                  className={`px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-colors ${lang === 'id' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  🇮🇩 ID
                </button>
                <button 
                  onClick={() => setLang('en')} 
                  className={`px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-colors ${lang === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  🇺🇸 EN
                </button>
             </div>
            <button onClick={() => setDarkMode(!darkMode)} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-yellow-400 transition">
              {darkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
          </div>
          <div className="text-center mb-8 mt-4 flex flex-col items-center">
            {/* UPDATED HEADER: JUST TEXT */}
            <div className="text-3xl font-bold text-red-700 dark:text-red-500 tracking-tight">CeLOE <span className="text-slate-700 dark:text-white">Course Pricing Simulation</span></div>
            <p className="text-slate-500 dark:text-slate-400 font-bold tracking-wide mt-2">{t('pricingEngine')}</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('email')}</label>
              <input name="email" type="email" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white mt-1 focus:ring-2 focus:ring-red-500 outline-none" placeholder="admin@celoe.com" disabled={!USE_FIREBASE} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">{t('password')}</label>
              <input name="password" type="password" required className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white mt-1 focus:ring-2 focus:ring-red-500 outline-none" placeholder="••••••••" disabled={!USE_FIREBASE} />
            </div>
            <button type="submit" className="w-full bg-red-700 hover:bg-red-800 text-white py-2 rounded font-bold transition disabled:opacity-50" disabled={!USE_FIREBASE}>
              {USE_FIREBASE ? t('signIn') : t('signInDisabled')}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t dark:border-slate-700">
             <p className="text-xs text-center text-slate-400 mb-2 uppercase font-bold tracking-wider">{t('devLogin')} {USE_FIREBASE ? '' : '(Offline)'}</p>
             <div className="grid grid-cols-2 gap-3">
               <button onClick={()=>handleDevLogin('admin')} className="text-xs flex items-center justify-center gap-2 bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 py-2 rounded font-bold border border-purple-200 dark:border-purple-800">
                 <ShieldCheck size={12}/> Admin
               </button>
               <button onClick={()=>handleDevLogin('lecturer')} className="text-xs flex items-center justify-center gap-2 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 py-2 rounded font-bold border border-green-200 dark:border-green-800">
                 <UserCircle size={12}/> Lecturer
               </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-sans transition-colors ${darkMode ? 'dark' : ''}`}>
      {/* HEADER */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b dark:border-slate-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
             {/* UPDATED HEADER: JUST TEXT */}
             <div className="flex flex-col justify-center">
                <div className="text-lg font-bold text-red-700 dark:text-red-500 tracking-tight leading-none">CeLOE <span className="text-slate-700 dark:text-white">Course Pricing Simulation</span></div>
                <div className="flex items-center gap-2 text-[10px] mt-1">
                 {!USE_FIREBASE && <span className="bg-yellow-100 text-yellow-800 px-1 rounded font-bold">OFFLINE</span>}
                 {USE_FIREBASE && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
               </div>
             </div>
          </div>
          
          <div className="flex items-center gap-2 pl-4 border-l dark:border-slate-700 ml-2">
             <button 
               onClick={() => setActiveTab('profile')}
               className="flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 p-1.5 pr-3 rounded-full transition-all text-left group"
             >
               <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-700 dark:text-red-400 font-bold border border-red-200 dark:border-red-800 group-hover:scale-105 transition-transform">
                 {userData?.name?.charAt(0).toUpperCase() || 'U'}
               </div>
               <div className="hidden sm:block">
                 <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-none mb-0.5 group-hover:text-red-600 transition-colors">{userData?.name || t('user')}</p>
                 <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase tracking-wide font-semibold">
                   {userData?.role || t('guest')}
                 </p>
               </div>
             </button>
             
             <div className="flex items-center gap-1 ml-2">
               <div className="flex bg-slate-100 dark:bg-slate-700 rounded-lg p-1 mr-2">
                  <button 
                    onClick={() => setLang('id')} 
                    className={`px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-colors ${lang === 'id' ? 'bg-white dark:bg-slate-600 shadow-sm text-red-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    🇮🇩
                  </button>
                  <button 
                    onClick={() => setLang('en')} 
                    className={`px-2 py-1 text-xs font-bold rounded-md flex items-center gap-1 transition-colors ${lang === 'en' ? 'bg-white dark:bg-slate-600 shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    🇺🇸
                  </button>
               </div>
               <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400">
                  {darkMode ? <Sun size={18}/> : <Moon size={18}/>}
               </button>
               <button onClick={handleLogout} className="p-2 rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700 transition" title="Sign Out">
                 <LogOut size={18} />
               </button>
             </div>
          </div>
        </div>
      </header>

      {/* TABS */}
      <div className="max-w-7xl mx-auto px-4 mt-6">
        <div className="border-b dark:border-slate-700 flex space-x-6 overflow-x-auto">
          {userData?.role !== 'admin' && (
            <>
              <button 
                onClick={() => setActiveTab('calculator')}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'calculator' ? 'border-red-600 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              >
                <Calculator size={16}/> {t('newCalc')}
              </button>
              {/* NEW BEP TAB BUTTON */}
              <button 
                onClick={() => setActiveTab('bep')}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'bep' ? 'border-red-600 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              >
                <TrendingUp size={16}/> {t('bepCalc')}
              </button>
            </>
          )}
          <button 
            onClick={() => { setActiveTab('history'); loadHistory(); }}
            className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'history' ? 'border-red-600 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
          >
            <History size={16}/> {t('history')}
          </button>
          {userData?.role === 'admin' && (
            <>
              <button 
                onClick={() => { setActiveTab('users'); loadUsers(); }}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'users' ? 'border-red-600 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              >
                <Users size={16}/> {t('userMgmt')}
              </button>
              <button 
                onClick={() => setActiveTab('settings')}
                className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'settings' ? 'border-red-600 text-red-600 dark:text-red-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700'}`}
              >
                <Sliders size={16}/> {t('adminSettings')}
              </button>
            </>
          )}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TAB: CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="lg:col-span-2 space-y-6">
               
                {/* Editing Banner */}
                {editingId && (
                  <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <FileText className="text-yellow-600"/>
                       <div>
                         <p className="font-bold text-yellow-800 dark:text-yellow-200">{t('editingMode')}</p>
                         <p className="text-xs text-yellow-700 dark:text-yellow-400">{t('updateDoc')} (V{editingVersion})</p>
                       </div>
                    </div>
                    <button onClick={() => { setEditingId(null); setCourseName(''); setSelectedComponents(new Set()); }} className="text-xs bg-white dark:bg-slate-700 px-3 py-1 rounded border dark:border-slate-600 hover:bg-slate-50">{t('cancel')}</button>
                  </div>
                )}

                {/* Templates (New) */}
                <div className="flex justify-end gap-2 mb-2">
                   <button 
                     onClick={()=>setShowTemplateModal(true)} 
                     className="text-xs flex items-center gap-1 text-slate-500 hover:text-blue-600 border border-slate-200 rounded-md px-2 py-1 bg-white hover:bg-blue-50 transition"
                   >
                     <LayoutTemplate size={12}/> {t('manageTemplates')}
                   </button>
                   {/* Modal for Templates would go here, simplifying for this view */}
                   {showTemplateModal && (
                     <div className="absolute z-50 top-20 right-4 bg-white p-4 shadow-xl border rounded-xl w-64">
                        <div className="flex justify-between items-center mb-2">
                           <h4 className="font-bold text-sm">{t('templates')}</h4>
                           <button onClick={()=>setShowTemplateModal(false)}><X size={14}/></button>
                        </div>
                        {templates.length === 0 ? <p className="text-xs text-slate-400 italic">{t('noTemplates')}</p> : (
                           <div className="space-y-1">
                              {templates.map(tmp => (
                                <button key={tmp.id} onClick={()=>applyTemplate(tmp)} className="w-full text-left text-xs p-2 hover:bg-slate-100 rounded border border-transparent hover:border-slate-200">
                                   {tmp.name}
                                </button>
                              ))}
                           </div>
                        )}
                        <button onClick={saveTemplate} className="mt-3 w-full bg-blue-600 text-white text-xs py-1 rounded hover:bg-blue-700 flex items-center justify-center gap-1"><PlusCircle size={10}/> {t('saveTemplate')}</button>
                     </div>
                   )}
                </div>

                {/* 1. Basic Info - UPDATED WITH SKS & LECTURER */}
                <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2 mb-6 border-b dark:border-slate-700 pb-4">
                     <BookOpen className="text-red-700 dark:text-red-500"/>
                     <h2 className="text-lg font-bold">1. {t('courseInfo')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('courseName')}</label>
                      <input value={courseName} onChange={e=>setCourseName(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Digital Marketing 101" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('courseCode')}</label>
                      <input value={courseCode} onChange={e=>setCourseCode(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. DM-101" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('lecturerName')}</label>
                      <input value={lecturerName} onChange={e=>setLecturerName(e.target.value)} className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-red-500" placeholder="Dr. Budi" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">{t('sks')}</label>
                      <input value={courseSks} onChange={e=>setCourseSks(e.target.value)} type="number" className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. 3" />
                    </div>
                  </div>
                </section>

                {/* 2. Configuration */}
                <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                   <div className="flex items-center gap-2 mb-6 border-b dark:border-slate-700 pb-4">
                     <Settings className="text-red-700 dark:text-red-500"/>
                     <h2 className="text-lg font-bold">2. {t('configuration')}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                       <label className="block text-sm font-medium mb-2">{t('courseType')}</label>
                       <div className="space-y-2">
                         {globalParams.courseTypes.map(type => (
                           <div key={type.id} onClick={()=>setCourseType(type.id)} className={`cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-all ${courseType===type.id ? 'border-red-600 bg-red-50 dark:bg-red-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-red-200'}`}>
                              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${courseType===type.id ? 'border-red-600' : 'border-slate-400'}`}>
                                {courseType===type.id && <div className="w-2 h-2 bg-red-600 rounded-full"/>}
                              </div>
                              <div>
                                <div className="font-semibold text-sm">{type.name}</div>
                                <div className="text-xs text-slate-500 dark:text-slate-400">x{type.multiplier} {t('multiplier')}</div>
                              </div>
                           </div>
                         ))}
                       </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">{t('pokokBahasan')}: {numPB}</label>
                      {/* SLIDER UPDATED MIN: 1 */}
                      <input type="range" min="1" max="14" value={numPB} onChange={e=>setNumPB(parseInt(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg accent-red-600 cursor-pointer mb-2"/>
                      <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded text-xs text-slate-600 dark:text-slate-400 flex justify-between">
                         <span>{t('estVideos')}: {numPB * 7}</span>
                         <span className="font-bold text-red-600 dark:text-red-400">+{formatCurrency((numPB - 1) * (globalParams.costPerPB))} Base</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Components (TABBED INTERFACE) */}
                <section className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                   <div className="flex items-center justify-between mb-6 border-b dark:border-slate-700 pb-4">
                      <div className="flex items-center gap-2">
                        <CheckCircle className="text-red-700 dark:text-red-500"/>
                        <h2 className="text-lg font-bold">3. {t('components')}</h2>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500 uppercase">{t('completeness')}</div>
                        <div className="text-xl font-bold text-red-700 dark:text-red-400">{pricingResult?.completenessScore}%</div>
                      </div>
                   </div>

                   {/* TABS NAVIGATION */}
                   <div className="flex space-x-2 overflow-x-auto pb-4 mb-4 border-b dark:border-slate-700 scrollbar-thin">
                      <button 
                         onClick={() => setActiveComponentTab('profile')}
                         className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${activeComponentTab === 'profile' ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                      >
                         {t('tabProfile')}
                      </button>
                      {Array.from({ length: numPB }, (_, i) => i + 1).map(pbNum => (
                         <button 
                           key={pbNum}
                           onClick={() => setActiveComponentTab(pbNum.toString())}
                           className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-colors ${activeComponentTab === pbNum.toString() ? 'bg-red-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}
                         >
                            {t('tabPB')} {pbNum}
                         </button>
                      ))}
                   </div>
                   
                   {/* TAB CONTENT */}
                   <div className="space-y-6 animate-in fade-in duration-300" key={activeComponentTab}>
                      <div className="flex justify-between items-end mb-2">
                          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                             <Layers size={16}/> 
                             {activeComponentTab === 'profile' ? t('tabProfile') : `${t('tabPB')} ${activeComponentTab}`}
                          </h3>
                          <button onClick={() => selectAllInTab(activeComponentTab)} className="text-xs text-red-600 hover:underline flex items-center gap-1">
                             <CheckSquare size={12}/> {t('selectAll')}
                          </button>
                      </div>

                      {activeComponentTab === 'profile' ? (
                          // PROFILE TAB
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                             {COMPONENT_GROUPS.profile.items.map(item => (
                               <label key={item.id} className={`flex items-start p-2 rounded border cursor-pointer transition-colors ${selectedComponents.has(item.id) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                                 <input type="checkbox" checked={selectedComponents.has(item.id)} onChange={() => toggleComponent(item.id)} className="mt-1 mr-2 accent-red-600"/>
                                 <div className="flex-1">
                                   <div className="text-sm font-medium">{item.label}</div>
                                   <div className="text-[10px] text-slate-500">
                                      {selectedComponents.has(item.id) ? 
                                        <span className="text-green-600">{t('included')}</span> : 
                                        <span>{t('potential')}: +{formatCurrency(pricingResult?.itemValue)}</span>
                                      }
                                   </div>
                                 </div>
                               </label>
                             ))}
                          </div>
                      ) : (
                          // PB TABS
                          <div className="space-y-6">
                              {/* MODULE GROUP */}
                              <div>
                                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">{COMPONENT_GROUPS.module.title}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                     {COMPONENT_GROUPS.module.items.map(item => {
                                        const key = `pb_${activeComponentTab}_${item.id}`;
                                        return (
                                           <label key={key} className={`flex items-start p-2 rounded border cursor-pointer transition-colors ${selectedComponents.has(key) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                                             <input type="checkbox" checked={selectedComponents.has(key)} onChange={() => toggleComponent(key)} className="mt-1 mr-2 accent-red-600"/>
                                             <div className="flex-1">
                                               <div className="text-sm font-medium">{item.label}</div>
                                               <div className="text-[10px] text-slate-500">
                                                  {selectedComponents.has(key) ? 
                                                    <span className="text-green-600">{t('included')}</span> : 
                                                    <span>{t('potential')}: +{formatCurrency(pricingResult?.itemValue)}</span>
                                                  }
                                               </div>
                                             </div>
                                           </label>
                                        )
                                     })}
                                  </div>
                              </div>
                              {/* PRODUCTION GROUP */}
                              <div>
                                  <h4 className="text-xs font-bold uppercase text-slate-500 mb-2">{COMPONENT_GROUPS.production.title}</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                     {COMPONENT_GROUPS.production.items.map(item => {
                                        const key = `pb_${activeComponentTab}_${item.id}`;
                                        return (
                                           <label key={key} className={`flex items-start p-2 rounded border cursor-pointer transition-colors ${selectedComponents.has(key) ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 'border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'}`}>
                                             <input type="checkbox" checked={selectedComponents.has(key)} onChange={() => toggleComponent(key)} className="mt-1 mr-2 accent-red-600"/>
                                             <div className="flex-1">
                                               <div className="text-sm font-medium">{item.label}</div>
                                               <div className="text-[10px] text-slate-500">
                                                  {selectedComponents.has(key) ? 
                                                    <span className="text-green-600">{t('included')}</span> : 
                                                    <span>{t('potential')}: +{formatCurrency(pricingResult?.itemValue)}</span>
                                                  }
                                               </div>
                                             </div>
                                           </label>
                                        )
                                     })}
                                  </div>
                              </div>
                          </div>
                      )}
                   </div>
                </section>
             </div>

             {/* Right Column: Sticky Summary */}
             <div className="lg:col-span-1">
               <div className="sticky top-24 bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 overflow-hidden ring-1 ring-slate-700/50">
                  <div className="p-6">
                     <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                        <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                          {t('priceEstimation')}
                        </h3>
                        <span className="bg-red-900/50 text-red-200 text-[10px] px-2 py-1 rounded font-bold border border-red-900/50">LIVE</span>
                     </div>
                     
                     <div className="space-y-4 mb-6">
                        <div className="flex justify-between text-sm text-slate-300">
                           <span>{t('lecturerBase')}</span>
                           <span className="font-mono">{formatCurrency(pricingResult?.lecturerBase || 0)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-slate-300">
                           <span>{t('platformFee')} ({globalParams.platformFeePercent}%)</span>
                           <span className="font-mono">{formatCurrency(pricingResult?.platformFee || 0)}</span>
                        </div>
                        <div className="pt-4 border-t border-slate-700 mt-2">
                           <div className="text-xs text-slate-400 uppercase font-bold mb-1">{t('finalPrice')}</div>
                           <div className="text-3xl font-extrabold text-white">
                              {formatCurrency(pricingResult?.finalPrice || 0)}
                           </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        <button onClick={saveCalculation} disabled={loadingData} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold shadow-lg transition flex justify-center items-center gap-2">
                           {loadingData ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"/> : <Save size={18}/>} 
                           {editingId ? t('updateCalc') : t('saveCloud')}
                        </button>
                        
                        <button onClick={()=>generatePDF(null, false)} className="w-full border border-slate-500 hover:border-slate-400 text-slate-300 hover:text-white py-3 rounded-lg font-bold transition flex justify-center items-center gap-2">
                           <Download size={18}/> {t('downloadOfficial')}
                        </button>

                        <button onClick={()=>setShowTableModal(true)} className="w-full text-xs text-slate-400 hover:text-white hover:underline transition mt-2">
                           {t('viewRef')}
                        </button>
                        
                        <p className="text-[10px] text-slate-500 text-center italic mt-2">
                           {t('docLockedInfo')}
                        </p>
                     </div>
                  </div>
               </div>
             </div>
          </div>
        )}

        {/* TAB: BEP SIMULATION (NEW) */}
        {activeTab === 'bep' && (
           <div className="max-w-5xl mx-auto animate-in fade-in duration-300 space-y-6">
              
              {/* BEP INPUT SECTION */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-2 mb-6 border-b dark:border-slate-700 pb-4">
                    <TrendingUp className="text-red-700 dark:text-red-500"/>
                    <h2 className="text-lg font-bold">{t('bepCalc')}</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                       <label className="block text-sm font-medium mb-2">{t('courseType')}</label>
                       <div className="flex flex-wrap gap-2">
                         {globalParams.courseTypes.map(type => (
                           <button 
                             key={type.id} 
                             onClick={()=>setBepValues({...bepValues, courseType: type.id})}
                             className={`px-3 py-1.5 text-xs font-bold rounded-full border transition ${bepValues.courseType === type.id ? 'bg-red-600 text-white border-red-600' : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-100'}`}
                           >
                             {type.name}
                           </button>
                         ))}
                       </div>
                    </div>
                    <div>
                       <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-1">{t('grantAmount')}</label>
                       <div className="relative">
                          <span className="absolute left-3 top-2.5 text-slate-400 font-bold">Rp</span>
                          <input 
                            type="number" 
                            value={bepValues.grantAmount}
                            onChange={e=>setBepValues({...bepValues, grantAmount: parseInt(e.target.value) || 0})}
                            className="w-full pl-10 p-2.5 text-lg font-mono border rounded-lg focus:ring-2 focus:ring-red-500 outline-none dark:bg-slate-700 dark:border-slate-600"
                          />
                       </div>
                       <div className="flex justify-between items-start mt-1">
                          <p className="text-xs text-slate-500">{t('grantDesc')}</p>
                          <div className="flex gap-2">
                              <button 
                                  onClick={() => setBepValues(prev => ({ ...prev, grantAmount: 10000000, targetStudents: 50, sellingPrice: 200000 }))}
                                  className="text-[10px] px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 border border-slate-300 transition"
                              >
                                  {t('resetDefault')}
                              </button>
                              {pricingResult && (
                                  <button 
                                      onClick={() => setBepValues(prev => ({ 
                                          ...prev, 
                                          grantAmount: Math.round(pricingResult.rawPrice), 
                                          sellingPrice: Math.round(pricingResult.finalPrice) 
                                      }))}
                                      className="text-[10px] px-2 py-1 bg-red-50 hover:bg-red-100 rounded text-red-600 border border-red-200 transition flex items-center gap-1"
                                  >
                                      <Calculator size={10} /> {t('loadFromCalc')}
                                  </button>
                              )}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* BEP SCENARIOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 
                 {/* Scenario 1: Target Price */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col">
                    <div className="mb-4">
                       <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <Users size={18} className="text-blue-500"/> Skenario 1
                       </h3>
                       <p className="text-xs text-slate-500">Hitung harga jual berdasarkan target mahasiswa.</p>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                       <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('targetStudentLabel')}</label>
                          <input 
                            type="number" 
                            value={bepValues.targetStudents}
                            onChange={e=>setBepValues({...bepValues, targetStudents: parseInt(e.target.value) || 1})}
                            className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 text-center font-bold"
                          />
                       </div>
                       
                       <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-center mt-auto">
                          <div className="text-xs text-blue-600 dark:text-blue-300 uppercase font-bold mb-1">{t('recPriceLabel')}</div>
                          <div className="text-2xl font-extrabold text-blue-800 dark:text-blue-200">
                             {formatCurrency(Math.ceil(bepValues.grantAmount / (bepValues.targetStudents || 1)))}
                          </div>
                          <div className="text-[10px] text-blue-500">/ Mahasiswa</div>
                       </div>
                    </div>
                 </div>

                 {/* Scenario 2: BEP Volume */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col">
                    <div className="mb-4">
                       <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <Target size={18} className="text-green-500"/> Skenario 2
                       </h3>
                       <p className="text-xs text-slate-500">Hitung target mahasiswa untuk balik modal (BEP).</p>
                    </div>
                    
                    <div className="space-y-4 flex-1">
                       <div>
                          <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('sellingPriceLabel')}</label>
                          <input 
                            type="number" 
                            value={bepValues.sellingPrice}
                            onChange={e=>setBepValues({...bepValues, sellingPrice: parseInt(e.target.value) || 1})}
                            className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 text-center font-bold"
                          />
                       </div>
                       
                       <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg text-center mt-auto">
                          <div className="text-xs text-green-600 dark:text-green-300 uppercase font-bold mb-1">{t('bepVolumeLabel')}</div>
                          <div className="text-2xl font-extrabold text-green-800 dark:text-green-200">
                             {Math.ceil(bepValues.grantAmount / (bepValues.sellingPrice || 1))}
                          </div>
                          <div className="text-[10px] text-green-500">Mahasiswa</div>
                       </div>
                    </div>
                 </div>

                 {/* Scenario 3: Projection */}
                 <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 flex flex-col">
                    <div className="mb-4">
                       <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                          <PieChart size={18} className="text-purple-500"/> Skenario 3
                       </h3>
                       <p className="text-xs text-slate-500">Proyeksi Total Pemasukan vs Hibah.</p>
                    </div>
                    
                    <div className="space-y-4 flex-1 flex flex-col">
                       <div className="grid grid-cols-2 gap-2">
                          <div className="text-center bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                             <div className="text-[10px] text-slate-500">Harga</div>
                             <div className="font-bold text-sm">{formatCurrency(bepValues.sellingPrice)}</div>
                          </div>
                          <div className="text-center bg-slate-50 dark:bg-slate-700/50 p-2 rounded">
                             <div className="text-[10px] text-slate-500">Jml Mhs</div>
                             <div className="font-bold text-sm">{bepValues.targetStudents}</div>
                          </div>
                       </div>
                       
                       <div className="mt-auto space-y-2">
                          <div className="flex justify-between items-center text-sm border-b dark:border-slate-700 pb-1">
                             <span className="text-slate-500">{t('totalRevenue')}</span>
                             <span className="font-bold text-slate-700 dark:text-white">{formatCurrency(bepValues.sellingPrice * bepValues.targetStudents)}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm">
                             <span className="text-slate-500">{t('profitLoss')}</span>
                             <span className={`font-extrabold ${(bepValues.sellingPrice * bepValues.targetStudents) - bepValues.grantAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {formatCurrency((bepValues.sellingPrice * bepValues.targetStudents) - bepValues.grantAmount)}
                             </span>
                          </div>
                       </div>
                    </div>
                 </div>

              </div>
           </div>
        )}

        {/* TAB: HISTORY (UPDATED) */}
        {activeTab === 'history' && (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden animate-in fade-in duration-300">
            <div className="p-4 border-b dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
               <h3 className="font-bold text-lg">{t('savedCalc')}</h3>
               <button onClick={loadHistory} className="text-sm flex items-center gap-1 text-blue-600 hover:underline"><RefreshCw size={14}/> {t('refresh')}</button>
            </div>
            
            {loadingData ? (
              <div className="p-8 text-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto"></div></div>
            ) : historyList.length === 0 ? (
               <div className="p-8 text-center text-slate-500">No history found. Create a new calculation.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 dark:bg-slate-700 text-slate-500 dark:text-slate-300 uppercase text-xs tracking-wider">
                     <tr>
                        <th className="p-4 w-1/5">{t('dateCourse')}</th>
                        <th className="p-4 w-1/3">{t('courseName')}</th>
                        <th className="p-4">{t('price')}</th>
                        <th className="p-4 text-center">{t('status')}</th>
                        <th className="p-4 text-right">{t('actions')}</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {historyList.map(item => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition">
                         <td className="p-4">
                            <div className="font-bold text-slate-900 dark:text-white text-md mb-1">{new Date(item.createdAt).toLocaleDateString()}</div>
                            <div className="text-xs text-slate-500">{item.lecturerName || 'Unknown'}</div>
                         </td>
                         <td className="p-4">
                            <div className="font-medium text-slate-800 dark:text-slate-200 text-base">{item.courseName}</div>
                            {item.version && <span className="inline-flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-600 px-1.5 rounded mr-2 mt-1">V{item.version}</span>}
                            {item.isPrinted && <span className="inline-flex items-center gap-1 text-[10px] border border-slate-300 bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded mt-1"><Lock size={8}/> {t('locked')}</span>}
                         </td>
                         <td className="p-4 font-mono font-medium text-slate-700 dark:text-slate-300">
                            {formatCurrency(item.pricingResult.finalPrice)}
                         </td>
                         <td className="p-4 text-center">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${item.status === 'approved' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                              {item.status ? (item.status === 'draft' ? t('submitted') : item.status) : t('submitted')}
                            </span>
                            {item.status === 'approved' && <div className="text-[10px] text-green-600 mt-1 font-semibold">Sell: {formatCurrency(item.commercialPrice || item.pricingResult.finalPrice * 1.2)}</div>}
                         </td>
                         <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                               <button onClick={()=>generatePDF(item, true)} title={t('preview')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"><Eye size={18}/></button>
                               <button onClick={()=>generatePDF(item, false)} title={t('download')} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition"><Download size={18}/></button>
                               {!item.isPrinted && (
                                 <button onClick={()=>handleEdit(item)} title={t('edit')} className="text-yellow-500 hover:text-yellow-600 transition"><PenTool size={18}/></button>
                               )}
                               {item.isPrinted && (
                                 <span className="text-slate-300 dark:text-slate-600 cursor-not-allowed"><Lock size={18}/></span>
                               )}
                               <button 
                                onClick={()=>handleDuplicate(item)} 
                                className="flex items-center gap-1 text-xs px-3 py-1.5 text-blue-600 bg-blue-50 border border-blue-200 hover:bg-blue-100 hover:border-blue-300 rounded-md transition font-medium ml-2"
                               >
                                 <Copy size={14}/> {t('copy')}
                               </button>
                            </div>
                         </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB: ADMIN SETTINGS (UPDATED: Multipliers) */}
        {activeTab === 'settings' && (
           <div className="max-w-4xl mx-auto animate-in fade-in duration-300">
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                 <div className="flex items-center gap-2 mb-6 border-b dark:border-slate-700 pb-4">
                    <Sliders className="text-red-700 dark:text-red-500"/>
                    <h2 className="text-lg font-bold">{t('adminSettings')}</h2>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                       <div>
                          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1">{t('globalParams')}</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{t('globalParamsDesc')}</p>
                       </div>
                       <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600 space-y-4">
                          <div>
                             <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('costPerPB')}</label>
                             <div className="relative">
                                <span className="absolute left-3 top-2 text-slate-400 text-sm">Rp</span>
                                <input 
                                  type="number" 
                                  value={globalParams.costPerPB}
                                  onChange={e=>setGlobalParams({...globalParams, costPerPB: parseInt(e.target.value)})}
                                  className="w-full pl-8 p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
                                />
                             </div>
                          </div>
                          <div>
                             <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('platformFee')} (%)</label>
                             <input 
                                type="number" 
                                value={globalParams.platformFeePercent}
                                onChange={e=>setGlobalParams({...globalParams, platformFeePercent: parseInt(e.target.value)})}
                                className="w-full p-2 border rounded dark:bg-slate-800 dark:border-slate-600"
                             />
                          </div>
                       </div>
                    </div>
                    
                    {/* NEW: Course Type Multipliers */}
                    <div className="space-y-4">
                       <div>
                          <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-1">Course Type Multipliers</h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Adjust multipliers for dynamic pricing.</p>
                       </div>
                       <div className="bg-slate-50 dark:bg-slate-700/30 p-4 rounded-lg border border-slate-200 dark:border-slate-600 space-y-4">
                          {globalParams.courseTypes.map((type, index) => (
                             <div key={type.id} className="flex justify-between items-center">
                                <span className="text-sm font-semibold">{type.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-slate-400">x</span>
                                  <input 
                                    type="number" 
                                    step="0.05"
                                    value={type.multiplier}
                                    onChange={e => {
                                      const newTypes = [...globalParams.courseTypes];
                                      newTypes[index] = { ...newTypes[index], multiplier: parseFloat(e.target.value) };
                                      setGlobalParams({...globalParams, courseTypes: newTypes});
                                    }}
                                    className="w-20 p-1 text-sm border rounded text-center dark:bg-slate-800 dark:border-slate-600"
                                  />
                                </div>
                             </div>
                          ))}
                       </div>
                       <button 
                            onClick={saveGlobalSettings}
                            disabled={loadingData}
                            className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-sm font-bold flex justify-center items-center gap-2 mt-4"
                          >
                             {loadingData ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-b-transparent"/> : <Save size={14}/>}
                             {t('saveSettings')}
                          </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* TAB: USERS (ADMIN) */}
        {activeTab === 'users' && (
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-300">
              <div className="md:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 h-fit">
                 <h3 className="font-bold mb-4 flex items-center gap-2"><UserCircle className="text-red-600"/> {t('addUser')}</h3>
                 <form onSubmit={addUser} className="space-y-4">
                    <div>
                      <label className="text-xs uppercase font-bold text-slate-500">{t('email')}</label>
                      <input name="u_email" type="email" required className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div>
                      <label className="text-xs uppercase font-bold text-slate-500">{t('name')}</label>
                      <input name="u_name" type="text" required className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:border-slate-600"/>
                    </div>
                    <div>
                      <label className="text-xs uppercase font-bold text-slate-500">{t('role')}</label>
                      <select name="u_role" className="w-full p-2 text-sm border rounded dark:bg-slate-700 dark:border-slate-600">
                         <option value="lecturer">Lecturer</option>
                         <option value="admin">Admin</option>
                      </select>
                    </div>
                    <button className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 rounded text-sm font-bold">{t('addToDB')}</button>
                 </form>
              </div>
              <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
                 <h3 className="font-bold mb-4">{t('userDB')}</h3>
                 <div className="space-y-2">
                    {loadingData ? <div className="text-center">Loading...</div> : usersList.map(u => (
                      <div key={u.id} className="flex justify-between items-center p-3 border-b dark:border-slate-700 last:border-0">
                         <div>
                            <div className="font-bold text-sm">{u.name}</div>
                            <div className="text-xs text-slate-500">{u.email}</div>
                         </div>
                         <div className="flex items-center gap-2">
                            <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${u.role==='admin'?'bg-purple-100 text-purple-700':'bg-slate-100 text-slate-700'}`}>{u.role}</span>
                            <button onClick={()=> USE_FIREBASE ? sendPasswordResetEmail(auth, u.email).then(()=>alert('Sent')).catch(e=>alert(e.message)) : alert('Email Reset (Offline)')} className="p-1 text-slate-400 hover:text-blue-600"><Mail size={14}/></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* TAB: PROFILE */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
             <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="h-32 bg-gradient-to-r from-red-800 to-red-600 relative">
                   <div className="absolute -bottom-10 left-8">
                      <div className="w-24 h-24 rounded-full bg-white dark:bg-slate-800 p-1">
                         <div className="w-full h-full rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-3xl font-bold text-slate-500">
                            {userData?.name?.charAt(0).toUpperCase()}
                         </div>
                      </div>
                   </div>
                </div>
                <div className="pt-12 p-8">
                   <div className="flex justify-between items-start mb-6">
                      <div>
                         <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                            {userData?.name} 
                            {userData?.role === 'admin' && <ShieldCheck className="inline w-5 h-5 ml-2 text-blue-500"/>}
                         </h2>
                         <p className="text-slate-500 dark:text-slate-400">{userData?.email}</p>
                      </div>
                      <button 
                        onClick={() => {
                           setEditProfileMode(!editProfileMode);
                           setProfileForm({ name: userData?.name || '', role: userData?.role || '' });
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-bold border transition ${editProfileMode ? 'bg-red-50 text-red-600 border-red-200' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600'}`}
                      >
                        {editProfileMode ? t('cancel') : t('editProfile')}
                      </button>
                   </div>

                   {editProfileMode ? (
                      <div className="space-y-4 bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-100 dark:border-slate-700">
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('fullName')}</label>
                            <input 
                              value={profileForm.name} 
                              onChange={e=>setProfileForm({...profileForm, name: e.target.value})}
                              className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600"
                            />
                         </div>
                         <div>
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">{t('roleReadOnly')}</label>
                            <input 
                              value={profileForm.role.toUpperCase()} 
                              disabled
                              className="w-full p-2 border rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:border-slate-700 cursor-not-allowed"
                            />
                         </div>
                         <button onClick={updateProfile} className="bg-blue-600 text-white px-4 py-2 rounded font-bold text-sm hover:bg-blue-700 transition">
                            {t('saveChanges')}
                         </button>
                      </div>
                   ) : (
                      <div className="grid grid-cols-2 gap-4 text-sm">
                         <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="block text-xs text-slate-500 uppercase font-bold mb-1">{t('accountID')}</span>
                            <span className="font-mono text-slate-700 dark:text-slate-300">{user?.uid || 'OFFLINE-ID'}</span>
                         </div>
                         <div className="p-4 bg-slate-50 dark:bg-slate-700/30 rounded-lg border border-slate-100 dark:border-slate-700">
                            <span className="block text-xs text-slate-500 uppercase font-bold mb-1">{t('status')}</span>
                            <span className="flex items-center text-green-600 font-bold"><div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div> {t('active')}</span>
                         </div>
                      </div>
                   )}
                </div>
             </div>
          </div>
        )}

      </main>

      {/* MODALS */}
      {showTableModal && <ReferenceTableModal onClose={()=>setShowTableModal(false)} costPerPB={globalParams.costPerPB} lang={lang} courseTypes={globalParams.courseTypes}/>}
    </div>
  );
}
