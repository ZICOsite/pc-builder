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

export interface Dictionary {
  nav: { configurator: string; profile: string };
  common: { backToConfigurator: string; total: string };
  categories: Record<ComponentType, string>;
  specs: { cores: string; gb: string; watts: string; hz: string; dpi: string };
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
  };
  errors: { authFailed: string };
}

export const dictionaries: Record<Locale, Dictionary> = {
  ru: {
    nav: { configurator: "Конфигуратор", profile: "Профиль" },
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
    },
    errors: { authFailed: "Ошибка авторизации" },
  },
  en: {
    nav: { configurator: "Configurator", profile: "Profile" },
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
    },
    errors: { authFailed: "Authentication failed" },
  },
  uz: {
    nav: { configurator: "Konfigurator", profile: "Profil" },
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
    },
    errors: { authFailed: "Avtorizatsiya xatosi" },
  },
};
