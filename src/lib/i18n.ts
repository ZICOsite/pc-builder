import type { ComponentType } from "./types";

export type Locale = "ru" | "en" | "uz";

export const DEFAULT_LOCALE: Locale = "ru";

export const NUMBER_LOCALES: Record<Locale, string> = {
  ru: "ru-RU",
  en: "en-US",
  uz: "uz-UZ",
};

export function normalizeLocale(code?: string | null): Locale | null {
  if (!code) return null;
  const lower = code.toLowerCase();
  if (lower.startsWith("ru")) return "ru";
  if (lower.startsWith("uz")) return "uz";
  if (lower.startsWith("en")) return "en";
  return null;
}

export interface AdminFieldLabels {
  cores: string;
  threads: string;
  socket: string;
  tdp: string;
  baseClock: string;
  boostClock: string;
  vram: string;
  memoryType: string;
  length: string;
  chipset: string;
  formFactor: string;
  memorySlots: string;
  maxMemoryGb: string;
  capacityGb: string;
  speedMhz: string;
  storageType: string;
  interfaceType: string;
  readSpeed: string;
  writeSpeed: string;
  wattage: string;
  efficiency: string;
  modular: string;
  maxGpuLength: string;
  maxCoolerHeight: string;
  coolingType: string;
  tdpSupport: string;
  height: string;
  sizeInches: string;
  resolution: string;
  refreshRateHz: string;
  panelType: string;
  connection: string;
  layout: string;
  switchType: string;
  dpi: string;
  sensor: string;
  headsetType: string;
  microphone: string;
}

export interface Dictionary {
  nav: { home: string; configurator: string; profile: string; admin: string };
  common: { backToConfigurator: string; total: string };
  categories: Record<ComponentType, string>;
  specs: { cores: string; gb: string; watts: string; hz: string; dpi: string };
  home: { title: string; subtitle: string };
  catalog: {
    backToCatalog: string;
    loading: string;
    loadErrorFallback: string;
    empty: string;
    notFound: string;
    searchPlaceholder: string;
    noResults: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
  };
  configurator: {
    loading: string;
    loadErrorFallback: string;
    notSelected: string;
    removeSelection: string;
    noCompatibleOptions: string;
    saving: string;
    save: string;
    openInTelegram: string;
    saved: string;
    open: string;
    saveErrorFallback: string;
    progressLabel: (selected: number, total: number) => string;
    allSelected: string;
  };
  buildPage: {
    loadingBuild: string;
    notFound: string;
    forbidden: string;
    loadErrorFallback: string;
    publishing: string;
    linkCopied: string;
    copyLink: string;
    share: string;
    copyError: string;
  };
  profile: {
    loading: string;
    openInTelegram: string;
    loadingProfile: string;
    loadErrorFallback: string;
    noName: string;
    discountTitle: string;
    invitedTitle: string;
    noReferralsYet: string;
    referralsProgress: (completed: number, remaining: number) => string;
    viaBuild: (name: string) => string;
    unknownUser: (id: number) => string;
    status: { PENDING: string; COMPLETED: string; CANCELLED: string };
    myBuildsTitle: string;
    noBuilds: string;
    itemsCount: (count: number) => string;
    publicBadge: string;
    privateBadge: string;
  };
  errors: { authFailed: string };
  admin: {
    forbidden: string;
    loading: string;
    dashboardTitle: string;
    totalComponents: string;
    totalUsers: string;
    totalBuilds: string;
    lowStockTitle: string;
    noLowStock: string;
    manageComponents: string;
    componentsTitle: string;
    addComponent: string;
    editComponent: string;
    backToDashboard: string;
    backToComponents: string;
    deleteAction: string;
    deleteConfirm: string;
    deleting: string;
    deleteErrorFallback: string;
    loadErrorFallback: string;
    emptyComponents: string;
    inactiveBadge: string;
    form: {
      typeLabel: string;
      brandLabel: string;
      nameLabel: string;
      slugLabel: string;
      priceLabel: string;
      currencyLabel: string;
      stockLabel: string;
      imageUrlLabel: string;
      isActiveLabel: string;
      specsTitle: string;
      save: string;
      saving: string;
      saveErrorFallback: string;
      cancel: string;
      optionalHint: string;
      fields: AdminFieldLabels;
    };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    nav: { home: "Главная", configurator: "Конфигуратор", profile: "Профиль", admin: "Админка" },
    common: { backToConfigurator: "← К конфигуратору", total: "Итого" },
    categories: {
      CPU: "Процессор",
      MOTHERBOARD: "Материнская плата",
      RAM: "Оперативная память",
      GPU: "Видеокарта",
      STORAGE: "Накопитель",
      PSU: "Блок питания",
      CASE: "Корпус",
      COOLING: "Охлаждение",
      MONITOR: "Монитор",
      KEYBOARD: "Клавиатура",
      MOUSE: "Мышь",
      HEADSET: "Гарнитура",
    },
    specs: { cores: "ядер", gb: "ГБ", watts: "Вт", hz: "Гц", dpi: "DPI" },
    home: { title: "Каталог", subtitle: "Выберите категорию, чтобы посмотреть товары" },
    catalog: {
      backToCatalog: "← К каталогу",
      loading: "Загрузка товаров...",
      loadErrorFallback: "Не удалось загрузить товары",
      empty: "В этой категории пока нет товаров",
      notFound: "Категория не найдена",
      searchPlaceholder: "Поиск по названию или бренду",
      noResults: "Ничего не найдено",
      sortPriceAsc: "Сначала дешевле",
      sortPriceDesc: "Сначала дороже",
    },
    configurator: {
      loading: "Загрузка компонентов...",
      loadErrorFallback: "Не удалось загрузить компоненты",
      notSelected: "Не выбрано",
      removeSelection: "Убрать выбор",
      noCompatibleOptions: "Нет совместимых вариантов",
      saving: "Сохранение...",
      save: "Сохранить сборку",
      openInTelegram: "Откройте приложение через Telegram, чтобы сохранить сборку",
      saved: "Сборка сохранена ✅",
      open: "открыть",
      saveErrorFallback: "Не удалось сохранить сборку",
      progressLabel: (selected, total) => `Выбрано ${selected} из ${total}`,
      allSelected: "Все категории заполнены",
    },
    buildPage: {
      loadingBuild: "Загрузка сборки...",
      notFound: "Сборка не найдена",
      forbidden: "Эта сборка приватная",
      loadErrorFallback: "Ошибка загрузки",
      publishing: "Публикация...",
      linkCopied: "Ссылка скопирована ✅",
      copyLink: "Скопировать ссылку",
      share: "Поделиться",
      copyError: "Не удалось скопировать ссылку",
    },
    profile: {
      loading: "Загрузка...",
      openInTelegram: "Откройте приложение через Telegram, чтобы увидеть профиль",
      loadingProfile: "Загрузка профиля...",
      loadErrorFallback: "Ошибка загрузки профиля",
      noName: "Без имени",
      discountTitle: "Скидка за рефералов",
      invitedTitle: "Приглашённые пользователи",
      noReferralsYet: "Пока никого — поделитесь ссылкой на свою сборку, чтобы пригласить друзей",
      referralsProgress: (completed, remaining) =>
        `${completed} из 7 приглашённых · осталось мест: ${remaining}`,
      viaBuild: (name) => `через сборку «${name}»`,
      unknownUser: (id) => `Пользователь #${id}`,
      status: { PENDING: "Ожидание", COMPLETED: "Начислено", CANCELLED: "Отменено" },
      myBuildsTitle: "Мои сборки",
      noBuilds: "Пока нет сохранённых сборок — соберите ПК в конфигураторе",
      itemsCount: (count) => `${count} компонентов`,
      publicBadge: "Опубликована",
      privateBadge: "Приватная",
    },
    errors: { authFailed: "Ошибка авторизации" },
    admin: {
      forbidden: "У вас нет доступа к админ-панели",
      loading: "Загрузка...",
      dashboardTitle: "Админ-панель",
      totalComponents: "Товаров",
      totalUsers: "Пользователей",
      totalBuilds: "Сборок",
      lowStockTitle: "Заканчиваются на складе",
      noLowStock: "Всё в достатке",
      manageComponents: "Управление товарами",
      componentsTitle: "Товары",
      addComponent: "Добавить товар",
      editComponent: "Редактировать товар",
      backToDashboard: "← В админ-панель",
      backToComponents: "← К товарам",
      deleteAction: "Удалить",
      deleteConfirm: "Удалить этот товар?",
      deleting: "Удаление...",
      deleteErrorFallback: "Не удалось удалить товар",
      loadErrorFallback: "Не удалось загрузить данные",
      emptyComponents: "Товаров пока нет",
      inactiveBadge: "Скрыт",
      form: {
        typeLabel: "Категория",
        brandLabel: "Бренд",
        nameLabel: "Название",
        slugLabel: "Slug (уникальный код)",
        priceLabel: "Цена",
        currencyLabel: "Валюта",
        stockLabel: "Остаток на складе",
        imageUrlLabel: "Ссылка на изображение",
        isActiveLabel: "Показывать в каталоге",
        specsTitle: "Характеристики",
        save: "Сохранить",
        saving: "Сохранение...",
        saveErrorFallback: "Не удалось сохранить товар",
        cancel: "Отмена",
        optionalHint: "необязательно",
        fields: {
          cores: "Ядра",
          threads: "Потоки",
          socket: "Сокет",
          tdp: "TDP (Вт)",
          baseClock: "Базовая частота (ГГц)",
          boostClock: "Буст частота (ГГц)",
          vram: "Видеопамять (ГБ)",
          memoryType: "Тип памяти",
          length: "Длина (мм)",
          chipset: "Чипсет",
          formFactor: "Форм-фактор",
          memorySlots: "Слотов памяти",
          maxMemoryGb: "Макс. память (ГБ)",
          capacityGb: "Объём (ГБ)",
          speedMhz: "Частота (МГц)",
          storageType: "Тип накопителя",
          interfaceType: "Интерфейс",
          readSpeed: "Скорость чтения (МБ/с)",
          writeSpeed: "Скорость записи (МБ/с)",
          wattage: "Мощность (Вт)",
          efficiency: "Сертификат эффективности",
          modular: "Модульность",
          maxGpuLength: "Макс. длина видеокарты (мм)",
          maxCoolerHeight: "Макс. высота кулера (мм)",
          coolingType: "Тип охлаждения",
          tdpSupport: "Поддержка TDP (Вт)",
          height: "Высота (мм)",
          sizeInches: "Диагональ (дюймы)",
          resolution: "Разрешение",
          refreshRateHz: "Частота обновления (Гц)",
          panelType: "Тип панели",
          connection: "Подключение",
          layout: "Раскладка",
          switchType: "Тип переключателей",
          dpi: "DPI",
          sensor: "Сенсор",
          headsetType: "Тип гарнитуры",
          microphone: "Микрофон",
        },
      },
    },
  },
  en: {
    nav: { home: "Home", configurator: "Configurator", profile: "Profile", admin: "Admin" },
    common: { backToConfigurator: "← Back to configurator", total: "Total" },
    categories: {
      CPU: "Processor",
      MOTHERBOARD: "Motherboard",
      RAM: "RAM",
      GPU: "Graphics Card",
      STORAGE: "Storage",
      PSU: "Power Supply",
      CASE: "Case",
      COOLING: "Cooling",
      MONITOR: "Monitor",
      KEYBOARD: "Keyboard",
      MOUSE: "Mouse",
      HEADSET: "Headset",
    },
    specs: { cores: "cores", gb: "GB", watts: "W", hz: "Hz", dpi: "DPI" },
    home: { title: "Catalog", subtitle: "Pick a category to browse products" },
    catalog: {
      backToCatalog: "← Back to catalog",
      loading: "Loading products...",
      loadErrorFallback: "Failed to load products",
      empty: "No products in this category yet",
      notFound: "Category not found",
      searchPlaceholder: "Search by name or brand",
      noResults: "No results found",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
    },
    configurator: {
      loading: "Loading components...",
      loadErrorFallback: "Failed to load components",
      notSelected: "Not selected",
      removeSelection: "Remove selection",
      noCompatibleOptions: "No compatible options",
      saving: "Saving...",
      save: "Save build",
      openInTelegram: "Open the app via Telegram to save your build",
      saved: "Build saved ✅",
      open: "open",
      saveErrorFallback: "Failed to save build",
      progressLabel: (selected, total) => `${selected} of ${total} selected`,
      allSelected: "All categories filled in",
    },
    buildPage: {
      loadingBuild: "Loading build...",
      notFound: "Build not found",
      forbidden: "This build is private",
      loadErrorFallback: "Failed to load",
      publishing: "Publishing...",
      linkCopied: "Link copied ✅",
      copyLink: "Copy link",
      share: "Share",
      copyError: "Failed to copy link",
    },
    profile: {
      loading: "Loading...",
      openInTelegram: "Open the app via Telegram to see your profile",
      loadingProfile: "Loading profile...",
      loadErrorFallback: "Failed to load profile",
      noName: "No name",
      discountTitle: "Referral discount",
      invitedTitle: "Invited users",
      noReferralsYet: "No one yet — share a link to your build to invite friends",
      referralsProgress: (completed, remaining) =>
        `${completed} of 7 invited · slots left: ${remaining}`,
      viaBuild: (name) => `via build "${name}"`,
      unknownUser: (id) => `User #${id}`,
      status: { PENDING: "Pending", COMPLETED: "Credited", CANCELLED: "Cancelled" },
      myBuildsTitle: "My builds",
      noBuilds: "No saved builds yet — put together a PC in the configurator",
      itemsCount: (count) => `${count} components`,
      publicBadge: "Published",
      privateBadge: "Private",
    },
    errors: { authFailed: "Authentication failed" },
    admin: {
      forbidden: "You don't have access to the admin panel",
      loading: "Loading...",
      dashboardTitle: "Admin panel",
      totalComponents: "Products",
      totalUsers: "Users",
      totalBuilds: "Builds",
      lowStockTitle: "Low stock",
      noLowStock: "Everything is well stocked",
      manageComponents: "Manage products",
      componentsTitle: "Products",
      addComponent: "Add product",
      editComponent: "Edit product",
      backToDashboard: "← Back to admin panel",
      backToComponents: "← Back to products",
      deleteAction: "Delete",
      deleteConfirm: "Delete this product?",
      deleting: "Deleting...",
      deleteErrorFallback: "Failed to delete product",
      loadErrorFallback: "Failed to load data",
      emptyComponents: "No products yet",
      inactiveBadge: "Hidden",
      form: {
        typeLabel: "Category",
        brandLabel: "Brand",
        nameLabel: "Name",
        slugLabel: "Slug (unique code)",
        priceLabel: "Price",
        currencyLabel: "Currency",
        stockLabel: "Stock",
        imageUrlLabel: "Image URL",
        isActiveLabel: "Show in catalog",
        specsTitle: "Specifications",
        save: "Save",
        saving: "Saving...",
        saveErrorFallback: "Failed to save product",
        cancel: "Cancel",
        optionalHint: "optional",
        fields: {
          cores: "Cores",
          threads: "Threads",
          socket: "Socket",
          tdp: "TDP (W)",
          baseClock: "Base clock (GHz)",
          boostClock: "Boost clock (GHz)",
          vram: "VRAM (GB)",
          memoryType: "Memory type",
          length: "Length (mm)",
          chipset: "Chipset",
          formFactor: "Form factor",
          memorySlots: "Memory slots",
          maxMemoryGb: "Max memory (GB)",
          capacityGb: "Capacity (GB)",
          speedMhz: "Speed (MHz)",
          storageType: "Storage type",
          interfaceType: "Interface",
          readSpeed: "Read speed (MB/s)",
          writeSpeed: "Write speed (MB/s)",
          wattage: "Wattage (W)",
          efficiency: "Efficiency rating",
          modular: "Modularity",
          maxGpuLength: "Max GPU length (mm)",
          maxCoolerHeight: "Max cooler height (mm)",
          coolingType: "Cooling type",
          tdpSupport: "TDP support (W)",
          height: "Height (mm)",
          sizeInches: "Size (inches)",
          resolution: "Resolution",
          refreshRateHz: "Refresh rate (Hz)",
          panelType: "Panel type",
          connection: "Connection",
          layout: "Layout",
          switchType: "Switch type",
          dpi: "DPI",
          sensor: "Sensor",
          headsetType: "Headset type",
          microphone: "Microphone",
        },
      },
    },
  },
  uz: {
    nav: { home: "Bosh sahifa", configurator: "Konfigurator", profile: "Profil", admin: "Administratsiya" },
    common: { backToConfigurator: "← Konfiguratorga qaytish", total: "Jami" },
    categories: {
      CPU: "Protsessor",
      MOTHERBOARD: "Ona plata",
      RAM: "Operativ xotira",
      GPU: "Videokarta",
      STORAGE: "Xotira",
      PSU: "Quvvat bloki",
      CASE: "Korpus",
      COOLING: "Sovutish",
      MONITOR: "Monitor",
      KEYBOARD: "Klaviatura",
      MOUSE: "Sichqoncha",
      HEADSET: "Garnitura",
    },
    specs: { cores: "yadro", gb: "GB", watts: "Vt", hz: "Gts", dpi: "DPI" },
    home: { title: "Katalog", subtitle: "Tovarlarni ko'rish uchun kategoriyani tanlang" },
    catalog: {
      backToCatalog: "← Katalogga qaytish",
      loading: "Tovarlar yuklanmoqda...",
      loadErrorFallback: "Tovarlarni yuklab bo'lmadi",
      empty: "Bu kategoriyada hozircha tovarlar yo'q",
      notFound: "Kategoriya topilmadi",
      searchPlaceholder: "Nomi yoki brendi bo'yicha qidirish",
      noResults: "Hech narsa topilmadi",
      sortPriceAsc: "Avval arzoni",
      sortPriceDesc: "Avval qimmati",
    },
    configurator: {
      loading: "Komponentlar yuklanmoqda...",
      loadErrorFallback: "Komponentlarni yuklab bo'lmadi",
      notSelected: "Tanlanmagan",
      removeSelection: "Tanlovni olib tashlash",
      noCompatibleOptions: "Mos variantlar yo'q",
      saving: "Saqlanmoqda...",
      save: "Yig'ilmani saqlash",
      openInTelegram: "Yig'ilmani saqlash uchun ilovani Telegram orqali oching",
      saved: "Yig'ilma saqlandi ✅",
      open: "ochish",
      saveErrorFallback: "Yig'ilmani saqlab bo'lmadi",
      progressLabel: (selected, total) => `${total} tadan ${selected} tasi tanlandi`,
      allSelected: "Barcha kategoriyalar to'ldirildi",
    },
    buildPage: {
      loadingBuild: "Yig'ilma yuklanmoqda...",
      notFound: "Yig'ilma topilmadi",
      forbidden: "Bu yig'ilma shaxsiy",
      loadErrorFallback: "Yuklashda xatolik",
      publishing: "Nashr qilinmoqda...",
      linkCopied: "Havola nusxalandi ✅",
      copyLink: "Havolani nusxalash",
      share: "Ulashish",
      copyError: "Havolani nusxalab bo'lmadi",
    },
    profile: {
      loading: "Yuklanmoqda...",
      openInTelegram: "Profilni ko'rish uchun ilovani Telegram orqali oching",
      loadingProfile: "Profil yuklanmoqda...",
      loadErrorFallback: "Profilni yuklab bo'lmadi",
      noName: "Ism yo'q",
      discountTitle: "Referal chegirmasi",
      invitedTitle: "Taklif qilingan foydalanuvchilar",
      noReferralsYet: "Hozircha hech kim yo'q — do'stlaringizni taklif qilish uchun yig'ilmangiz havolasini ulashing",
      referralsProgress: (completed, remaining) =>
        `7 tadan ${completed} taklif qilindi · qolgan o'rinlar: ${remaining}`,
      viaBuild: (name) => `«${name}» yig'ilmasi orqali`,
      unknownUser: (id) => `Foydalanuvchi #${id}`,
      status: { PENDING: "Kutilmoqda", COMPLETED: "Hisoblandi", CANCELLED: "Bekor qilindi" },
      myBuildsTitle: "Mening yig'ilmalarim",
      noBuilds: "Hozircha saqlangan yig'ilmalar yo'q — konfiguratorda PK yig'ing",
      itemsCount: (count) => `${count} komponent`,
      publicBadge: "Nashr qilingan",
      privateBadge: "Shaxsiy",
    },
    errors: { authFailed: "Avtorizatsiya xatosi" },
    admin: {
      forbidden: "Sizda admin-panelga kirish huquqi yo'q",
      loading: "Yuklanmoqda...",
      dashboardTitle: "Admin-panel",
      totalComponents: "Tovarlar",
      totalUsers: "Foydalanuvchilar",
      totalBuilds: "Yig'ilmalar",
      lowStockTitle: "Omborda kamayib qolmoqda",
      noLowStock: "Hammasi yetarli",
      manageComponents: "Tovarlarni boshqarish",
      componentsTitle: "Tovarlar",
      addComponent: "Tovar qo'shish",
      editComponent: "Tovarni tahrirlash",
      backToDashboard: "← Admin-panelga qaytish",
      backToComponents: "← Tovarlarga qaytish",
      deleteAction: "O'chirish",
      deleteConfirm: "Bu tovarni o'chirasizmi?",
      deleting: "O'chirilmoqda...",
      deleteErrorFallback: "Tovarni o'chirib bo'lmadi",
      loadErrorFallback: "Ma'lumotlarni yuklab bo'lmadi",
      emptyComponents: "Hozircha tovarlar yo'q",
      inactiveBadge: "Yashirilgan",
      form: {
        typeLabel: "Kategoriya",
        brandLabel: "Brend",
        nameLabel: "Nomi",
        slugLabel: "Slug (noyob kod)",
        priceLabel: "Narxi",
        currencyLabel: "Valyuta",
        stockLabel: "Ombordagi qoldiq",
        imageUrlLabel: "Rasm havolasi",
        isActiveLabel: "Katalogda ko'rsatish",
        specsTitle: "Xususiyatlari",
        save: "Saqlash",
        saving: "Saqlanmoqda...",
        saveErrorFallback: "Tovarni saqlab bo'lmadi",
        cancel: "Bekor qilish",
        optionalHint: "ixtiyoriy",
        fields: {
          cores: "Yadrolar",
          threads: "Oqimlar",
          socket: "Soket",
          tdp: "TDP (Vt)",
          baseClock: "Baza chastotasi (GGts)",
          boostClock: "Bust chastotasi (GGts)",
          vram: "Video xotira (GB)",
          memoryType: "Xotira turi",
          length: "Uzunligi (mm)",
          chipset: "Chipset",
          formFactor: "Forma faktori",
          memorySlots: "Xotira uyalari",
          maxMemoryGb: "Maks. xotira (GB)",
          capacityGb: "Hajmi (GB)",
          speedMhz: "Chastota (MGts)",
          storageType: "Xotira turi",
          interfaceType: "Interfeys",
          readSpeed: "O'qish tezligi (MB/s)",
          writeSpeed: "Yozish tezligi (MB/s)",
          wattage: "Quvvat (Vt)",
          efficiency: "Samaradorlik sertifikati",
          modular: "Modullilik",
          maxGpuLength: "Videokartaning maks. uzunligi (mm)",
          maxCoolerHeight: "Kulerning maks. balandligi (mm)",
          coolingType: "Sovutish turi",
          tdpSupport: "TDP qo'llab-quvvatlash (Vt)",
          height: "Balandligi (mm)",
          sizeInches: "Diagonal (dyuym)",
          resolution: "Ruxsat",
          refreshRateHz: "Yangilanish chastotasi (Gts)",
          panelType: "Panel turi",
          connection: "Ulanish",
          layout: "Klaviatura tartibi",
          switchType: "Svitch turi",
          dpi: "DPI",
          sensor: "Sensor",
          headsetType: "Garnitura turi",
          microphone: "Mikrofon",
        },
      },
    },
  },
};
