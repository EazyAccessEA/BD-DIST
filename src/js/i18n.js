/* ============================================
   i18n — Bengali/English Translation System
   ============================================ */

const I18N = {
  _lang: 'bn', // Default to Bengali
  _listeners: [],

  strings: {
    // App Header
    'app.title':            { en: 'Food Distribution', bn: 'খাদ্য বিতরণ' },
    'app.lang_toggle':      { en: 'বাংলা', bn: 'English' },

    // Navigation
    'nav.setup':            { en: 'Setup', bn: 'সেটআপ' },
    'nav.scan':             { en: 'Scan', bn: 'স্ক্যান' },
    'nav.reports':          { en: 'Reports', bn: 'রিপোর্ট' },

    // Setup Tab
    'setup.title':          { en: 'Event Setup', bn: 'ইভেন্ট সেটআপ' },
    'setup.import_csv':     { en: 'Import Beneficiary List', bn: 'তালিকা আমদানি করুন' },
    'setup.drop_csv':       { en: 'Tap to select CSV file', bn: 'CSV ফাইল নির্বাচন করতে ট্যাপ করুন' },
    'setup.drop_hint':      { en: 'or drag & drop here', bn: 'অথবা এখানে টেনে আনুন' },
    'setup.event_name':     { en: 'Event Name', bn: 'ইভেন্টের নাম' },
    'setup.event_date':     { en: 'Event Date', bn: 'ইভেন্টের তারিখ' },
    'setup.loaded':         { en: 'beneficiaries loaded', bn: 'জন সুবিধাভোগী লোড হয়েছে' },
    'setup.review_list':    { en: 'Review List', bn: 'তালিকা দেখুন' },
    'setup.generate_cards': { en: 'Generate QR Cards', bn: 'QR কার্ড তৈরি করুন' },
    'setup.search_list':    { en: 'Search by name...', bn: 'নাম দিয়ে খুঁজুন...' },
    'setup.clear_data':     { en: 'Clear All Data', bn: 'সমস্ত তথ্য মুছুন' },
    'setup.confirm_clear':  { en: 'Are you sure? This will delete all beneficiary data and collection records.', bn: 'আপনি কি নিশ্চিত? এটি সমস্ত সুবিধাভোগীর তথ্য এবং সংগ্রহের রেকর্ড মুছে ফেলবে।' },
    'setup.no_data':        { en: 'No Data Loaded', bn: 'কোনো তথ্য লোড হয়নি' },
    'setup.no_data_desc':   { en: 'Import a CSV file to get started', bn: 'শুরু করতে একটি CSV ফাইল আমদানি করুন' },
    'setup.dup_phones':     { en: 'Duplicate phone numbers found', bn: 'ডুপ্লিকেট ফোন নম্বর পাওয়া গেছে' },
    'setup.generating':     { en: 'Generating cards...', bn: 'কার্ড তৈরি হচ্ছে...' },
    'setup.print_cards':    { en: 'Print QR Cards', bn: 'QR কার্ড প্রিন্ট করুন' },
    'setup.add_walkin':     { en: 'Add Walk-in', bn: 'ওয়াক-ইন যোগ করুন' },
    'setup.walkin_name':    { en: 'Full Name', bn: 'পুরো নাম' },
    'setup.walkin_phone':   { en: 'Phone Number', bn: 'ফোন নম্বর' },

    // Scan Tab
    'scan.title':           { en: 'Scan QR Code', bn: 'QR কোড স্ক্যান করুন' },
    'scan.start':           { en: 'Start Scanner', bn: 'স্ক্যানার চালু করুন' },
    'scan.stop':            { en: 'Stop Scanner', bn: 'স্ক্যানার বন্ধ করুন' },
    'scan.give_food':       { en: 'GIVE FOOD', bn: 'খাবার দিন' },
    'scan.confirm':         { en: 'Confirm Collection', bn: 'সংগ্রহ নিশ্চিত করুন' },
    'scan.already':         { en: 'ALREADY COLLECTED', bn: 'ইতিমধ্যে সংগ্রহ করা হয়েছে' },
    'scan.collected_at':    { en: 'Collected at', bn: 'সংগ্রহের সময়' },
    'scan.do_not_give':     { en: 'DO NOT GIVE FOOD', bn: 'খাবার দেবেন না' },
    'scan.unknown':         { en: 'UNKNOWN CODE', bn: 'অজানা কোড' },
    'scan.unknown_desc':    { en: 'This QR is not in the list', bn: 'এই QR তালিকায় নেই' },
    'scan.verify_phone':    { en: 'Verify phone ends', bn: 'ফোন নম্বর শেষ' },
    'scan.search_backup':   { en: 'Search by Name', bn: 'নাম দিয়ে খুঁজুন' },
    'scan.dismiss':         { en: 'Dismiss', bn: 'বাতিল' },
    'scan.collected':       { en: 'Collected', bn: 'সংগৃহীত' },
    'scan.remaining':       { en: 'Remaining', bn: 'বাকি' },
    'scan.no_data_warn':    { en: 'Import beneficiary list first in Setup tab', bn: 'প্রথমে সেটআপ ট্যাবে সুবিধাভোগী তালিকা আমদানি করুন' },
    'scan.manual_entry':    { en: 'Enter ID Manually', bn: 'ম্যানুয়ালি ID দিন' },

    // Reports Tab
    'reports.title':        { en: 'Distribution Report', bn: 'বিতরণ রিপোর্ট' },
    'reports.summary':      { en: 'Summary', bn: 'সারসংক্ষেপ' },
    'reports.total':        { en: 'Total', bn: 'মোট' },
    'reports.collected':    { en: 'Collected', bn: 'সংগৃহীত' },
    'reports.remaining':    { en: 'Remaining', bn: 'বাকি' },
    'reports.walkins':      { en: 'Walk-ins', bn: 'ওয়াক-ইন' },
    'reports.export':       { en: 'Export Report CSV', bn: 'রিপোর্ট CSV রপ্তানি করুন' },
    'reports.uncollected':  { en: 'Uncollected List', bn: 'অসংগৃহীত তালিকা' },
    'reports.collected_list': { en: 'Collected List', bn: 'সংগৃহীত তালিকা' },
    'reports.no_data':      { en: 'No distribution data yet', bn: 'এখনো কোনো বিতরণ তথ্য নেই' },
    'reports.progress':     { en: 'Progress', bn: 'অগ্রগতি' },

    // Common
    'common.cancel':        { en: 'Cancel', bn: 'বাতিল' },
    'common.confirm':       { en: 'Confirm', bn: 'নিশ্চিত করুন' },
    'common.close':         { en: 'Close', bn: 'বন্ধ করুন' },
    'common.save':          { en: 'Save', bn: 'সংরক্ষণ করুন' },
    'common.delete':        { en: 'Delete', bn: 'মুছুন' },
    'common.yes':           { en: 'Yes', bn: 'হ্যাঁ' },
    'common.no':            { en: 'No', bn: 'না' },
    'common.ok':            { en: 'OK', bn: 'ঠিক আছে' },
    'common.error':         { en: 'Error', bn: 'ত্রুটি' },
    'common.success':       { en: 'Success', bn: 'সফল' },
    'common.loading':       { en: 'Loading...', bn: 'লোড হচ্ছে...' },
    'common.of':            { en: 'of', bn: 'এর মধ্যে' },

    // Help
    'help.title':           { en: 'Quick Guide', bn: 'দ্রুত গাইড' },
    'help.step1':           { en: 'Import your CSV beneficiary list in Setup', bn: 'সেটআপে আপনার CSV সুবিধাভোগী তালিকা আমদানি করুন' },
    'help.step2':           { en: 'Generate and print QR cards', bn: 'QR কার্ড তৈরি এবং প্রিন্ট করুন' },
    'help.step3':           { en: 'On distribution day, use Scan tab', bn: 'বিতরণের দিন, স্ক্যান ট্যাব ব্যবহার করুন' },
    'help.step4':           { en: 'After event, export report from Reports', bn: 'ইভেন্টের পরে, রিপোর্ট থেকে রিপোর্ট রপ্তানি করুন' },
  },

  t(key) {
    const entry = this.strings[key];
    if (!entry) return key;
    return entry[this._lang] || entry['en'] || key;
  },

  getLang() {
    return this._lang;
  },

  setLang(lang) {
    this._lang = lang;
    localStorage.setItem('fd_lang', lang);
    document.body.classList.toggle('lang-bn', lang === 'bn');
    this._listeners.forEach(fn => fn(lang));
  },

  toggleLang() {
    this.setLang(this._lang === 'en' ? 'bn' : 'en');
  },

  onLangChange(fn) {
    this._listeners.push(fn);
  },

  init() {
    const saved = localStorage.getItem('fd_lang');
    if (saved) this._lang = saved;
    document.body.classList.toggle('lang-bn', this._lang === 'bn');
  }
};
