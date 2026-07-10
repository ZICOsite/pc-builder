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
  common: { back: string; total: string };
  categories: Record<ComponentType, string>;
  specs: { cores: string; gb: string; watts: string; hz: string; dpi: string };
  home: {
    title: string;
    subtitle: string;
    buildCta: string;
    continueBuildLabel: string;
    continueBuildAction: string;
  };
  catalog: {
    loading: string;
    loadErrorFallback: string;
    empty: string;
    notFound: string;
    searchPlaceholder: string;
    noResults: string;
    sortPriceAsc: string;
    sortPriceDesc: string;
    allBrands: string;
    searchOnYoutube: string;
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
    pageOf: (page: number, total: number) => string;
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
    discountApplied: (percent: number) => string;
    incompleteBuild: (missing: string) => string;
    placeOrder: string;
    ordering: string;
    ordered: string;
    orderError: string;
    continueBuilding: string;
    accessoriesOnlyNote: string;
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
    deleteBuild: string;
    deleteErrorFallback: string;
  };
  errors: { authFailed: string };
  admin: {
    forbidden: string;
    loading: string;
    dashboardTitle: string;
    totalComponents: string;
    totalUsers: string;
    totalBuilds: string;
    totalPendingOrders: string;
    lowStockTitle: string;
    noLowStock: string;
    manageComponents: string;
    manageOrders: string;
    manageSettings: string;
    manageUsers: string;
    manageStats: string;
    componentsTitle: string;
    addComponent: string;
    editComponent: string;
    deleteAction: string;
    deleteConfirm: string;
    deleting: string;
    deleteErrorFallback: string;
    loadErrorFallback: string;
    emptyComponents: string;
    inactiveBadge: string;
    allCategories: string;
    form: {
      typeLabel: string;
      brandLabel: string;
      nameLabel: string;
      slugLabel: string;
      slugAutoHint: string;
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
    orders: {
      title: string;
      loading: string;
      loadErrorFallback: string;
      empty: string;
      buyerLabel: string;
      status: { PENDING: string; COMPLETED: string; CANCELLED: string };
      markCompleted: string;
      markCancelled: string;
      updating: string;
      updateErrorFallback: string;
      itemsCount: (count: number) => string;
      discountNote: (percent: number) => string;
    };
    settings: {
      title: string;
      description: string;
      loading: string;
      loadErrorFallback: string;
      updateErrorFallback: string;
    };
    users: {
      title: string;
      loading: string;
      loadErrorFallback: string;
      empty: string;
      unnamed: string;
      discountLabel: string;
      buildsLabel: (count: number) => string;
      ordersLabel: (count: number) => string;
      referralsLabel: (count: number) => string;
      joinedLabel: string;
    };
    stats: {
      title: string;
      loading: string;
      loadErrorFallback: string;
      rangeLabel: Record<7 | 30 | 90, string>;
      revenueTitle: string;
      ordersTitle: string;
      newUsersTitle: string;
      topProductsTitle: string;
      topBuyersTitle: string;
      leaderboardLoading: string;
      leaderboardLoadErrorFallback: string;
      leaderboardEmpty: string;
      quantitySoldLabel: (count: number) => string;
      ordersCountLabel: (count: number) => string;
    };
  };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    nav: { home: "Главная", configurator: "Конфигуратор", profile: "Профиль", admin: "Админка" },
    common: { back: "← Назад", total: "Итого" },
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
    home: {
      title: "Каталог",
      subtitle: "Выберите категорию, чтобы посмотреть товары",
      buildCta: "Собрать ПК",
      continueBuildLabel: "Незавершённая сборка",
      continueBuildAction: "Продолжить →",
    },
    catalog: {
      loading: "Загрузка товаров...",
      loadErrorFallback: "Не удалось загрузить товары",
      empty: "В этой категории пока нет товаров",
      notFound: "Категория не найдена",
      searchPlaceholder: "Поиск по названию или бренду",
      noResults: "Ничего не найдено",
      sortPriceAsc: "Сначала дешевле",
      sortPriceDesc: "Сначала дороже",
      allBrands: "Все бренды",
      searchOnYoutube: "Смотреть на YouTube",
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
      pageOf: (page, total) => `Стр. ${page} из ${total}`,
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
      discountApplied: (percent) => `Скидка ${percent}% применена`,
      incompleteBuild: (missing) =>
        `Поделиться и получить реферальную скидку можно только полной сборкой ПК. Не хватает: ${missing}`,
      placeOrder: "Оформить заказ",
      ordering: "Отправка заказа...",
      ordered: "Заказ отправлен ✅",
      orderError: "Не удалось отправить заказ",
      continueBuilding: "Продолжить сборку",
      accessoriesOnlyNote: "Это набор периферии — реферальная скидка доступна только для полной сборки ПК",
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
      deleteBuild: "Удалить сборку",
      deleteErrorFallback: "Не удалось удалить сборку",
    },
    errors: { authFailed: "Ошибка авторизации" },
    admin: {
      forbidden: "У вас нет доступа к админ-панели",
      loading: "Загрузка...",
      dashboardTitle: "Админ-панель",
      totalComponents: "Товаров",
      totalUsers: "Пользователей",
      totalBuilds: "Сборок",
      totalPendingOrders: "Ожидают заказы",
      lowStockTitle: "Заканчиваются на складе",
      noLowStock: "Всё в достатке",
      manageComponents: "Управление товарами",
      manageOrders: "Заказы",
      manageSettings: "Настройки реферальной скидки",
      manageUsers: "Пользователи",
      manageStats: "Статистика",
      componentsTitle: "Товары",
      addComponent: "Добавить товар",
      editComponent: "Редактировать товар",
      deleteAction: "Удалить",
      deleteConfirm: "Удалить этот товар?",
      deleting: "Удаление...",
      deleteErrorFallback: "Не удалось удалить товар",
      loadErrorFallback: "Не удалось загрузить данные",
      emptyComponents: "Товаров пока нет",
      inactiveBadge: "Скрыт",
      allCategories: "Все категории",
      form: {
        typeLabel: "Категория",
        brandLabel: "Бренд",
        nameLabel: "Название",
        slugLabel: "Slug (уникальный код)",
        slugAutoHint: "Генерируется автоматически из бренда и названия — можно изменить вручную",
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
      orders: {
        title: "Заказы",
        loading: "Загрузка заказов...",
        loadErrorFallback: "Не удалось загрузить заказы",
        empty: "Заказов пока нет",
        buyerLabel: "Покупатель",
        status: { PENDING: "Ожидает", COMPLETED: "Продано", CANCELLED: "Отменено" },
        markCompleted: "Отметить проданным",
        markCancelled: "Отменить",
        updating: "Обновление...",
        updateErrorFallback: "Не удалось обновить статус",
        itemsCount: (count) => `${count} позиций`,
        discountNote: (percent) => `скидка ${percent}%`,
      },
      settings: {
        title: "Обязательные категории",
        description:
          "Категории, отмеченные галочкой, должны быть в сборке, чтобы её можно было опубликовать (реферальная скидка) и заказать целиком.",
        loading: "Загрузка настроек...",
        loadErrorFallback: "Не удалось загрузить настройки",
        updateErrorFallback: "Не удалось сохранить изменение",
      },
      users: {
        title: "Пользователи",
        loading: "Загрузка пользователей...",
        loadErrorFallback: "Не удалось загрузить пользователей",
        empty: "Пользователей пока нет",
        unnamed: "Без имени",
        discountLabel: "Скидка",
        buildsLabel: (count) => `${count} сборок`,
        ordersLabel: (count) => `${count} заказов`,
        referralsLabel: (count) => `${count} рефералов`,
        joinedLabel: "Регистрация",
      },
      stats: {
        title: "Статистика",
        loading: "Загрузка статистики...",
        loadErrorFallback: "Не удалось загрузить статистику",
        rangeLabel: { 7: "7 дней", 30: "30 дней", 90: "90 дней" },
        revenueTitle: "Выручка",
        ordersTitle: "Заказы",
        newUsersTitle: "Новые пользователи",
        topProductsTitle: "Топ товаров",
        topBuyersTitle: "Топ покупателей",
        leaderboardLoading: "Загрузка...",
        leaderboardLoadErrorFallback: "Не удалось загрузить рейтинг",
        leaderboardEmpty: "Пока нет завершённых заказов",
        quantitySoldLabel: (count) => `${count} шт. продано`,
        ordersCountLabel: (count) => `${count} заказов`,
      },
    },
  },
  en: {
    nav: { home: "Home", configurator: "Configurator", profile: "Profile", admin: "Admin" },
    common: { back: "← Back", total: "Total" },
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
    home: {
      title: "Catalog",
      subtitle: "Pick a category to browse products",
      buildCta: "Build a PC",
      continueBuildLabel: "Unfinished build",
      continueBuildAction: "Continue →",
    },
    catalog: {
      loading: "Loading products...",
      loadErrorFallback: "Failed to load products",
      empty: "No products in this category yet",
      notFound: "Category not found",
      searchPlaceholder: "Search by name or brand",
      noResults: "No results found",
      sortPriceAsc: "Price: low to high",
      sortPriceDesc: "Price: high to low",
      allBrands: "All brands",
      searchOnYoutube: "Watch on YouTube",
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
      pageOf: (page, total) => `Page ${page} of ${total}`,
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
      discountApplied: (percent) => `${percent}% discount applied`,
      incompleteBuild: (missing) =>
        `Sharing and earning the referral discount only works for a complete PC build. Missing: ${missing}`,
      placeOrder: "Place order",
      ordering: "Sending order...",
      ordered: "Order sent ✅",
      orderError: "Failed to send order",
      continueBuilding: "Continue building",
      accessoriesOnlyNote: "This is an accessories-only set — the referral discount only applies to a complete PC build",
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
      deleteBuild: "Delete build",
      deleteErrorFallback: "Failed to delete the build",
    },
    errors: { authFailed: "Authentication failed" },
    admin: {
      forbidden: "You don't have access to the admin panel",
      loading: "Loading...",
      dashboardTitle: "Admin panel",
      totalComponents: "Products",
      totalUsers: "Users",
      totalBuilds: "Builds",
      totalPendingOrders: "Pending orders",
      lowStockTitle: "Low stock",
      noLowStock: "Everything is well stocked",
      manageComponents: "Manage products",
      manageOrders: "Orders",
      manageSettings: "Referral discount settings",
      manageUsers: "Users",
      manageStats: "Statistics",
      componentsTitle: "Products",
      addComponent: "Add product",
      editComponent: "Edit product",
      deleteAction: "Delete",
      deleteConfirm: "Delete this product?",
      deleting: "Deleting...",
      deleteErrorFallback: "Failed to delete product",
      loadErrorFallback: "Failed to load data",
      emptyComponents: "No products yet",
      inactiveBadge: "Hidden",
      allCategories: "All categories",
      form: {
        typeLabel: "Category",
        brandLabel: "Brand",
        nameLabel: "Name",
        slugLabel: "Slug (unique code)",
        slugAutoHint: "Auto-generated from brand and name — you can edit it manually",
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
      orders: {
        title: "Orders",
        loading: "Loading orders...",
        loadErrorFallback: "Failed to load orders",
        empty: "No orders yet",
        buyerLabel: "Buyer",
        status: { PENDING: "Pending", COMPLETED: "Sold", CANCELLED: "Cancelled" },
        markCompleted: "Mark as sold",
        markCancelled: "Cancel",
        updating: "Updating...",
        updateErrorFallback: "Failed to update status",
        itemsCount: (count) => `${count} items`,
        discountNote: (percent) => `${percent}% discount`,
      },
      settings: {
        title: "Required categories",
        description:
          "Categories with the checkbox checked must be included in a build for it to be publishable (referral discount) and orderable as a whole.",
        loading: "Loading settings...",
        loadErrorFallback: "Failed to load settings",
        updateErrorFallback: "Failed to save the change",
      },
      users: {
        title: "Users",
        loading: "Loading users...",
        loadErrorFallback: "Failed to load users",
        empty: "No users yet",
        unnamed: "No name",
        discountLabel: "Discount",
        buildsLabel: (count) => `${count} builds`,
        ordersLabel: (count) => `${count} orders`,
        referralsLabel: (count) => `${count} referrals`,
        joinedLabel: "Joined",
      },
      stats: {
        title: "Statistics",
        loading: "Loading statistics...",
        loadErrorFallback: "Failed to load statistics",
        rangeLabel: { 7: "7 days", 30: "30 days", 90: "90 days" },
        revenueTitle: "Revenue",
        ordersTitle: "Orders",
        newUsersTitle: "New users",
        topProductsTitle: "Top products",
        topBuyersTitle: "Top buyers",
        leaderboardLoading: "Loading...",
        leaderboardLoadErrorFallback: "Failed to load leaderboard",
        leaderboardEmpty: "No completed orders yet",
        quantitySoldLabel: (count) => `${count} sold`,
        ordersCountLabel: (count) => `${count} orders`,
      },
    },
  },
  uz: {
    nav: { home: "Bosh sahifa", configurator: "Konfigurator", profile: "Profil", admin: "Administratsiya" },
    common: { back: "← Orqaga", total: "Jami" },
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
    home: {
      title: "Katalog",
      subtitle: "Tovarlarni ko'rish uchun kategoriyani tanlang",
      buildCta: "PK yig'ish",
      continueBuildLabel: "Tugallanmagan sborka",
      continueBuildAction: "Davom ettirish →",
    },
    catalog: {
      loading: "Tovarlar yuklanmoqda...",
      loadErrorFallback: "Tovarlarni yuklab bo'lmadi",
      empty: "Bu kategoriyada hozircha tovarlar yo'q",
      notFound: "Kategoriya topilmadi",
      searchPlaceholder: "Nomi yoki brendi bo'yicha qidirish",
      noResults: "Hech narsa topilmadi",
      sortPriceAsc: "Avval arzoni",
      sortPriceDesc: "Avval qimmati",
      allBrands: "Barcha brendlar",
      searchOnYoutube: "YouTube'da ko'rish",
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
      pageOf: (page, total) => `${page}/${total}-sahifa`,
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
      discountApplied: (percent) => `${percent}% chegirma qo'llanildi`,
      incompleteBuild: (missing) =>
        `Ulashish va referal chegirma olish faqat to'liq PK yig'masida ishlaydi. Yetishmayapti: ${missing}`,
      placeOrder: "Buyurtma berish",
      ordering: "Buyurtma yuborilmoqda...",
      ordered: "Buyurtma yuborildi ✅",
      orderError: "Buyurtmani yuborib bo'lmadi",
      continueBuilding: "Yig'ishni davom ettirish",
      accessoriesOnlyNote: "Bu faqat aksessuarlar to'plami — referal chegirma faqat to'liq PK yig'masiga tegishli",
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
      deleteBuild: "Yig'ilmani o'chirish",
      deleteErrorFallback: "Yig'ilmani o'chirib bo'lmadi",
    },
    errors: { authFailed: "Avtorizatsiya xatosi" },
    admin: {
      forbidden: "Sizda admin-panelga kirish huquqi yo'q",
      loading: "Yuklanmoqda...",
      dashboardTitle: "Admin-panel",
      totalComponents: "Tovarlar",
      totalUsers: "Foydalanuvchilar",
      totalBuilds: "Yig'ilmalar",
      totalPendingOrders: "Kutilayotgan buyurtmalar",
      lowStockTitle: "Omborda kamayib qolmoqda",
      noLowStock: "Hammasi yetarli",
      manageComponents: "Tovarlarni boshqarish",
      manageOrders: "Buyurtmalar",
      manageSettings: "Referal chegirma sozlamalari",
      manageUsers: "Foydalanuvchilar",
      manageStats: "Statistika",
      componentsTitle: "Tovarlar",
      addComponent: "Tovar qo'shish",
      editComponent: "Tovarni tahrirlash",
      deleteAction: "O'chirish",
      deleteConfirm: "Bu tovarni o'chirasizmi?",
      deleting: "O'chirilmoqda...",
      deleteErrorFallback: "Tovarni o'chirib bo'lmadi",
      loadErrorFallback: "Ma'lumotlarni yuklab bo'lmadi",
      emptyComponents: "Hozircha tovarlar yo'q",
      inactiveBadge: "Yashirilgan",
      allCategories: "Barcha turkumlar",
      form: {
        typeLabel: "Kategoriya",
        brandLabel: "Brend",
        nameLabel: "Nomi",
        slugLabel: "Slug (noyob kod)",
        slugAutoHint: "Brend va nomdan avtomatik yaratiladi — qo'lda o'zgartirish mumkin",
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
      orders: {
        title: "Buyurtmalar",
        loading: "Buyurtmalar yuklanmoqda...",
        loadErrorFallback: "Buyurtmalarni yuklab bo'lmadi",
        empty: "Hozircha buyurtmalar yo'q",
        buyerLabel: "Xaridor",
        status: { PENDING: "Kutilmoqda", COMPLETED: "Sotilgan", CANCELLED: "Bekor qilingan" },
        markCompleted: "Sotilgan deb belgilash",
        markCancelled: "Bekor qilish",
        updating: "Yangilanmoqda...",
        updateErrorFallback: "Holatni yangilab bo'lmadi",
        itemsCount: (count) => `${count} ta band`,
        discountNote: (percent) => `${percent}% chegirma`,
      },
      settings: {
        title: "Majburiy kategoriyalar",
        description:
          "Belgilangan kategoriyalar sborkada bo'lishi shart — aks holda uni e'lon qilib (referal chegirma) bo'lmaydi va to'liq buyurtma qilib bo'lmaydi.",
        loading: "Sozlamalar yuklanmoqda...",
        loadErrorFallback: "Sozlamalarni yuklab bo'lmadi",
        updateErrorFallback: "O'zgarishni saqlab bo'lmadi",
      },
      users: {
        title: "Foydalanuvchilar",
        loading: "Foydalanuvchilar yuklanmoqda...",
        loadErrorFallback: "Foydalanuvchilarni yuklab bo'lmadi",
        empty: "Hozircha foydalanuvchilar yo'q",
        unnamed: "Ismi yo'q",
        discountLabel: "Chegirma",
        buildsLabel: (count) => `${count} ta sborka`,
        ordersLabel: (count) => `${count} ta buyurtma`,
        referralsLabel: (count) => `${count} ta referal`,
        joinedLabel: "Ro'yxatdan o'tgan",
      },
      stats: {
        title: "Statistika",
        loading: "Statistika yuklanmoqda...",
        loadErrorFallback: "Statistikani yuklab bo'lmadi",
        rangeLabel: { 7: "7 kun", 30: "30 kun", 90: "90 kun" },
        revenueTitle: "Daromad",
        ordersTitle: "Buyurtmalar",
        newUsersTitle: "Yangi foydalanuvchilar",
        topProductsTitle: "Eng ko'p sotilgan tovarlar",
        topBuyersTitle: "Top xaridorlar",
        leaderboardLoading: "Yuklanmoqda...",
        leaderboardLoadErrorFallback: "Reytingni yuklab bo'lmadi",
        leaderboardEmpty: "Hozircha yakunlangan buyurtmalar yo'q",
        quantitySoldLabel: (count) => `${count} ta sotilgan`,
        ordersCountLabel: (count) => `${count} ta buyurtma`,
      },
    },
  },
};
