import type { ProductCategory } from "@/types/product";

export interface Dictionary {
  common: {
    whatsapp: string;
    orderWhatsApp: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    loading: string;
    somoni: string;
  };
  lang: {
    switcherLabel: string;
    ru: string;
    tg: string;
    en: string;
  };
  theme: {
    toggle: string;
    light: string;
    dark: string;
  };
  nav: {
    home: string;
    menu: string;
    about: string;
    offers: string;
    gallery: string;
    contact: string;
    fullMenu: string;
    aboutCafe: string;
    admin: string;
  };
  header: {
    homeAria: string;
    mainNav: string;
    tagline: string;
    openMenu: string;
  };
  mobileMenu: {
    closeOverlay: string;
    close: string;
    mobileNav: string;
  };
  hero: {
    titleLine1: string;
    titleHighlight: string;
    viewMenu: string;
    imageAlt: string;
    todayInMenu: string;
    dishesCount: string;
  };
  menu: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fullMenu: string;
    pageTitle: string;
    pageDescription: string;
    filterAria: string;
    emptyTitle: string;
    emptyHint: string;
    loadError: string;
    loadErrorHint: string;
    supabaseNotConfigured: string;
    menuLoadFailed: string;
  };
  categories: Record<ProductCategory | "all", string>;
  product: {
    available: string;
    unavailable: string;
    unavailableShort: string;
    order: string;
    showMore: string;
    showLess: string;
    priceFrom: string;
  };
  about: {
    eyebrow: string;
    title: string;
    subtitle: string;
    benefits: {
      fresh: { title: string; description: string };
      fast: { title: string; description: string };
      tasty: { title: string; description: string };
      affordable: { title: string; description: string };
    };
  };
  offers: {
    eyebrow: string;
    title: string;
    subtitle: string;
    orderPromo: string;
    items: {
      street: { title: string; description: string; badge: string };
      xl: { title: string; description: string; badge: string };
      evening: { title: string; description: string; badge: string };
    };
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    alts: {
      shawarma: string;
      pizza: string;
      process: string;
      facade: string;
      interior: string;
      delivery: string;
    };
  };
  contact: {
    eyebrow: string;
    title: string;
    subtitle: string;
    address: string;
    phone: string;
    whatsappWrite: string;
    workingHours: string;
    mapTitle: string;
  };
  footer: {
    navigation: string;
    contacts: string;
    socials: string;
    rights: string;
    tagline: string;
    description: string;
  };
  site: {
    tagline: string;
    description: string;
    workingHours: string;
  };
  whatsapp: {
    order: (name: string, price: number) => string;
    general: string;
  };
  orderModal: {
    title: string;
    whatsapp: string;
    telegram: string;
    instagram: string;
    close: string;
  };
  cart: {
    title: string;
    openAria: string;
    empty: string;
    emptyHint: string;
    addToCart: string;
    added: string;
    chooseVariant: string;
    addonsLabel: string;
    noOptionsHint: string;
    quantity: string;
    increase: string;
    decrease: string;
    remove: string;
    clear: string;
    subtotal: string;
    delivery: string;
    total: string;
    checkoutSoon: string;
    close: string;
    configTitle: string;
    addForTotal: (total: string) => string;
  };
  admin: {
    panelTitle: string;
    sidebarTitle: string;
    backToSite: string;
    loginTitle: string;
    loginPageTitle: string;
    configError: string;
    nav: {
      dashboard: string;
      products: string;
      add: string;
    };
    logout: string;
    dashboard: {
      title: string;
      description: string;
      addProduct: string;
      loadError: string;
      totalProducts: string;
      available: string;
      unavailable: string;
      byCategory: string;
    };
    products: {
      title: string;
      description: string;
      add: string;
      loadError: string;
      loadErrorHint: string;
      empty: string;
      addFirst: string;
      deleted: string;
      deleteError: string;
      table: {
        dish: string;
        category: string;
        price: string;
        status: string;
        actions: string;
      };
    };
    productForm: {
      newTitle: string;
      newDescription: string;
      editTitle: string;
      namesSection: string;
      descriptionsSection: string;
      nameRu: string;
      nameTg: string;
      nameEn: string;
      descriptionRu: string;
      descriptionTg: string;
      descriptionEn: string;
      price: string;
      category: string;
      inStock: string;
      photo: string;
      previewSelected: string;
      previewCurrent: string;
      uploadingImage: string;
      selectPhoto: string;
      replacePhoto: string;
      uploading: string;
      fileHint: string;
      currentPhotoUploaded: string;
      uploadingToServer: string;
      create: string;
      save: string;
      imageUploaded: string;
      created: string;
      updated: string;
      errors: {
        nameRuRequired: string;
        priceInvalid: string;
      };
    };
    login: {
      email: string;
      password: string;
      submit: string;
      supabaseNotConfigured: string;
      credentialsRequired: string;
      invalidCredentials: string;
      accessDenied: string;
    };
    deleteDialog: {
      title: string;
      message: (name: string) => string;
    };
  };
}
