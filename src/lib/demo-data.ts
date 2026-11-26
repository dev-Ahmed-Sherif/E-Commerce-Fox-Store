/** In-memory catalog used when MongoDB is unavailable — powers UI design. */

export type DemoCategory = {
  id: string;
  name: string;
  nameAr: string;
  showOnHome: boolean;
  billboardLabel: string;
  billboardLabelAr: string;
  imageUrl: string;
  images: { id: string; url: string; order: number }[];
  createdAt: string;
};

export type DemoProduct = {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  price: number;
  quantity: number;
  categoryId: string;
  isFeatured: boolean;
  isArchived: boolean;
  imageUrl: string;
  createdAt: string;
};

const catalogCreatedAt = "2026-11-10T00:00:00.000Z";

let categories: DemoCategory[] = [
  {
    id: "cat-weddings",
    name: "Weddings & Engagement",
    nameAr: "أفراح وخطوبة",
    showOnHome: true,
    billboardLabel: "Fans, trays, and engagement stands",
    billboardLabelAr: "مسكات، صواني، وستاندات خطوبة",
    imageUrl: "/catalog/engagement-stand.jpg",
    images: [
      { id: "img-wd-1", url: "/catalog/wedding-fans.jpg", order: 0 },
      { id: "img-wd-2", url: "/catalog/engagement-tray.jpg", order: 1 },
      { id: "img-wd-3", url: "/catalog/wedding-toppers.jpg", order: 2 },
    ],
    createdAt: catalogCreatedAt,
  },
  {
    id: "cat-katb",
    name: "Marriage Contract",
    nameAr: "بصمات كتب الكتاب",
    showOnHome: true,
    billboardLabel: "Acrylic keepsakes for the contract day",
    billboardLabelAr: "لوحات أكريليك ليوم كتب الكتاب",
    imageUrl: "/catalog/katb-kitab.jpg",
    images: [
      { id: "img-kb-1", url: "/catalog/katb-1.jpg", order: 0 },
      { id: "img-kb-2", url: "/catalog/katb-2.jpg", order: 1 },
    ],
    createdAt: catalogCreatedAt,
  },
  {
    id: "cat-graduation",
    name: "Graduation",
    nameAr: "تخرج",
    showOnHome: true,
    billboardLabel: "Shields, holders, brooches, and prints",
    billboardLabelAr: "دروع، مسكات، بروش، وبصمات",
    imageUrl: "/catalog/graduation.jpg",
    images: [
      { id: "img-gd-1", url: "/catalog/graduation-1.jpg", order: 0 },
      { id: "img-gd-2", url: "/catalog/graduation-2.jpg", order: 1 },
    ],
    createdAt: catalogCreatedAt,
  },
  {
    id: "cat-decor",
    name: "Laser Décor",
    nameAr: "ديكور ليزر",
    showOnHome: true,
    billboardLabel: "Names, frames, letters, and verses",
    billboardLabelAr: "أسماء، براويز، حروف، وآيات",
    imageUrl: "/catalog/nursery-names.jpg",
    images: [
      { id: "img-dc-1", url: "/catalog/nursery-names-1.jpg", order: 0 },
      { id: "img-dc-2", url: "/catalog/nursery-names-2.jpg", order: 1 },
    ],
    createdAt: catalogCreatedAt,
  },
  {
    id: "cat-models",
    name: "Laser Models",
    nameAr: "مجسمات ليزر",
    showOnHome: true,
    billboardLabel: "School and occasion models",
    billboardLabelAr: "مجسمات للمدارس والمناسبات",
    imageUrl: "/catalog/october-models.jpg",
    images: [
      { id: "img-mm-1", url: "/catalog/october-models-1.jpg", order: 0 },
      { id: "img-mm-2", url: "/catalog/october-models-2.jpg", order: 1 },
    ],
    createdAt: catalogCreatedAt,
  },
  {
    id: "cat-gifts",
    name: "Practical Gifts",
    nameAr: "هدايا عملية",
    showOnHome: true,
    billboardLabel: "Acrylic key holders and custom gifts",
    billboardLabelAr: "علاقات مفاتيح وهدايا حسب الطلب",
    imageUrl: "/catalog/key-holder.jpg",
    images: [
      { id: "img-gf-1", url: "/catalog/key-holder-1.jpg", order: 0 },
      { id: "img-gf-2", url: "/catalog/key-holder-2.jpg", order: 1 },
    ],
    createdAt: catalogCreatedAt,
  },
];

let products: DemoProduct[] = [
  {
    id: "prod-fans",
    name: "Wedding Feather Fans",
    nameAr: "هوايات الأفراح بالريش",
    description:
      "Gold laser-cut wedding fans with feathers, the couple’s names, and the date. Any shape can be made.",
    descriptionAr:
      "هوايات أفراح ذهبية بقص ليزر وريش، بأسماء العروسين والتاريخ. متاح تنفيذ أي شكل.",
    price: 0,
    quantity: 1,
    categoryId: "cat-weddings",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/wedding-fans.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-toppers",
    name: "Wedding Cake Toppers",
    nameAr: "مسكات وتوبات الأفراح",
    description:
      "Wooden laser-cut toppers and holders with the couple’s names, for weddings and occasions.",
    descriptionAr:
      "مسكات وتوبات خشب مقصوصة بالليزر بأسماء العروسين، للأفراح والمناسبات.",
    price: 0,
    quantity: 1,
    categoryId: "cat-weddings",
    isFeatured: false,
    isArchived: false,
    imageUrl: "/catalog/wedding-toppers.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-tray",
    name: "Engagement Ring Tray",
    nameAr: "صينية خطوبة",
    description:
      "Personalized engagement tray with the couple’s names, the date, and a place for the ring boxes.",
    descriptionAr:
      "صينية خطوبة بالأسماء والتاريخ، مع مكان لعلب الدبل. التنفيذ حسب الطلب.",
    price: 0,
    quantity: 1,
    categoryId: "cat-weddings",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/engagement-tray.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-stand",
    name: "Engagement Acrylic Stand",
    nameAr: "ستاند خطوبة أكريليك",
    description:
      "White and gold acrylic engagement stand with names, date, and floral styling. Any design can be made.",
    descriptionAr:
      "ستاند خطوبة أكريليك أبيض وذهبي بالأسماء والتاريخ وتنسيق الورد. متاح تنفيذ أي شكل.",
    price: 0,
    quantity: 1,
    categoryId: "cat-weddings",
    isFeatured: false,
    isArchived: false,
    imageUrl: "/catalog/engagement-stand.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-katb",
    name: "Marriage Contract Plaque",
    nameAr: "بصمة كتب الكتاب",
    description:
      "Luxury acrylic plaques that keep the names, date, and verse from the marriage-contract day.",
    descriptionAr:
      "لوحات أكريليك فاخرة لكتب الكتاب، بالأسماء والتاريخ والآية. تصميم حسب الطلب.",
    price: 0,
    quantity: 1,
    categoryId: "cat-katb",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/katb-kitab.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-grad",
    name: "Graduation Set",
    nameAr: "مجموعة التخرج",
    description:
      "Graduation shield, holder, fingerprint keepsake, and brooch in clear acrylic with laser cutting and print. Year and photo on request.",
    descriptionAr:
      "درع التخرج، ومسكة، وبصمة، وبروش من أكريليك شفاف مع قص ليزر وطباعة. السنة والصورة حسب الطلب.",
    price: 0,
    quantity: 1,
    categoryId: "cat-graduation",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/graduation.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-nursery",
    name: "Nursery Name Board",
    nameAr: "لوحة اسم أطفال",
    description:
      "Colorful laser-cut name boards for children’s rooms, with shapes and themes made to order.",
    descriptionAr:
      "لوحات أسماء أطفال ملونة بقص ليزر، بأشكال ومقاسات مختلفة حسب الطلب.",
    price: 0,
    quantity: 1,
    categoryId: "cat-decor",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/nursery-names.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-light",
    name: "Lighted Photo Frame",
    nameAr: "برواز مضيء",
    description:
      "Hexagonal lighted décor frame for a photo, with a mirrored base and warm light.",
    descriptionAr:
      "برواز ديكور سداسي مضيء للصورة، بقاعدة عاكسة وإضاءة دافئة.",
    price: 0,
    quantity: 1,
    categoryId: "cat-decor",
    isFeatured: false,
    isArchived: false,
    imageUrl: "/catalog/lighted-frame.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-letters",
    name: "Custom Letter Décor",
    nameAr: "حروف وديكور للبيت",
    description:
      "Laser-cut letters and home décor pieces, made to the design and size you choose.",
    descriptionAr:
      "حروف وقطع ديكور للبيت بقص ليزر، بالتصميم والمقاس اللي تختاره.",
    price: 0,
    quantity: 1,
    categoryId: "cat-decor",
    isFeatured: false,
    isArchived: false,
    imageUrl: "/catalog/letter-decor.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-quran",
    name: "Quran Verse Frame",
    nameAr: "برواز آية قرآنية",
    description:
      "Round acrylic frame with a pearl border, a verse, and the names you want remembered.",
    descriptionAr:
      "برواز دائري أكريليك بحدود لؤلؤ وآية وأسماء، تذكار للمناسبة.",
    price: 0,
    quantity: 1,
    categoryId: "cat-decor",
    isFeatured: false,
    isArchived: false,
    imageUrl: "/catalog/quran-frame.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-october",
    name: "October War Laser Models",
    nameAr: "مجسمات حرب أكتوبر",
    description:
      "Laser-cut military vehicle models for school activities and October celebrations, in several sizes.",
    descriptionAr:
      "مجسمات مركبات عسكرية مقصوصة بالليزر لنشاط المدارس واحتفالات أكتوبر، بأحجام مختلفة.",
    price: 0,
    quantity: 1,
    categoryId: "cat-models",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/october-models.jpg",
    createdAt: catalogCreatedAt,
  },
  {
    id: "prod-keys",
    name: "Acrylic Key Holder",
    nameAr: "علاقة مفاتيح أكريليك",
    description:
      "Clear acrylic wall key holder with utility icons and hooks. A name or logo can be added.",
    descriptionAr:
      "علاقة مفاتيح حائط من أكريليك شفاف بأيقونات المرافق وخطافات، ويمكن إضافة الاسم.",
    price: 0,
    quantity: 1,
    categoryId: "cat-gifts",
    isFeatured: true,
    isArchived: false,
    imageUrl: "/catalog/key-holder.jpg",
    createdAt: catalogCreatedAt,
  },
];

export const demoStore = {
  getCategories: () => [...categories],
  getHomeCategories: () => categories.filter((c) => c.showOnHome),
  getCategory: (id: string) => categories.find((c) => c.id === id),
  upsertCategory: (input: Partial<DemoCategory> & { name: string }) => {
    if (input.id) {
      categories = categories.map((c) =>
        c.id === input.id ? { ...c, ...input, id: c.id } : c
      );
      return categories.find((c) => c.id === input.id)!;
    }
    const created: DemoCategory = {
      id: `cat-${Date.now()}`,
      name: input.name,
      nameAr: input.nameAr || input.name,
      showOnHome: input.showOnHome ?? true,
      billboardLabel: input.billboardLabel || input.name,
      billboardLabelAr: input.billboardLabelAr || input.nameAr || input.name,
      imageUrl: input.imageUrl || "/catalog/letter-decor.jpg",
      images: [],
      createdAt: new Date().toISOString(),
    };
    categories = [created, ...categories];
    return created;
  },
  deleteCategory: (id: string) => {
    categories = categories.filter((c) => c.id !== id);
    products = products.filter((p) => p.categoryId !== id);
  },
  getProducts: () => [...products],
  getFeaturedProducts: () =>
    products.filter((p) => p.isFeatured && !p.isArchived),
  getProduct: (id: string) => products.find((p) => p.id === id),
  upsertProduct: (
    input: Partial<DemoProduct> & { name: string; categoryId: string; price: number }
  ) => {
    if (input.id) {
      products = products.map((p) =>
        p.id === input.id ? { ...p, ...input, id: p.id } : p
      );
      return products.find((p) => p.id === input.id)!;
    }
    const created: DemoProduct = {
      id: `prod-${Date.now()}`,
      name: input.name,
      nameAr: input.nameAr || input.name,
      description: input.description || "",
      descriptionAr: input.descriptionAr || input.description || "",
      price: input.price,
      quantity: input.quantity ?? 0,
      categoryId: input.categoryId,
      isFeatured: input.isFeatured ?? false,
      isArchived: input.isArchived ?? false,
      imageUrl: input.imageUrl || "/catalog/letter-decor.jpg",
      createdAt: new Date().toISOString(),
    };
    products = [created, ...products];
    return created;
  },
  deleteProduct: (id: string) => {
    products = products.filter((p) => p.id !== id);
  },
  setCategoryImage: (categoryId: string, imageUrl: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      category.imageUrl = imageUrl;
      category.images = category.images || [];
      if (!category.images.find((img) => img.id === categoryId)) {
        category.images.push({ id: categoryId, url: imageUrl, order: 0 });
      }
    }
  },
  stats: () => ({
    products: products.filter((p) => !p.isArchived).length,
    categories: categories.length,
    featured: products.filter((p) => p.isFeatured && !p.isArchived).length,
  }),
};
