export type PackageCategory =
  | 'graduation-indoor'
  | 'graduation-outdoor'
  | 'pass-foto'
  | 'group'
  | 'family'
  | 'maternity'
  | 'personal'
  | 'prewed'
  | 'couple'
  | 'sewa-studio'
  | 'undangan'
  | 'self-studio'
  | 'birthday';

export interface CategoryInfo {
  id: PackageCategory;
  name: string;
  subPackageCount: number;
  subPackageNote?: string;
  description: string;
  iconName: string;
}

export interface PackageItem {
  id: string;
  name: string;
  category: PackageCategory;
  subCategory?: string; // e.g. "Special", "Normal", "Color Spotlight" for Self Studio
  tag?: string;
  durationMinutes: number;
  selectionTimeMinutes: number;
  includedPeople: number;
  includedPrints: string;
  softFilesIncluded: boolean;
  price: number;
  originalPrice?: number;
  description: string;
  highlights: string[];
  popular?: boolean;
  image: string;
}

export type StudioBranch = 'cabang-1' | 'cabang-2';

export interface BranchInfo {
  id: StudioBranch;
  name: string;
  shortName: string;
  tagline: string;
  address: string;
  badge: string;
  description: string;
  highlights: string[];
  icon: string;
  mapsUrl?: string;
}

export interface BackdropOption {
  id: string;
  name: string;
  category: 'spotlight-special' | 'spotlight-normal' | 'solid-color';
  hex: string;
  secondaryHex?: string;
  description: string;
  previewImage: string;
  applicableTo?: ('self-studio' | 'pro-studio')[];
  applicableBranches?: StudioBranch[];
}

export interface FrameTemplate {
  id: string;
  name: string;
  gridType: '4-cut' | '6-cut' | 'polaroid' | 'wide-angle';
  description: string;
  aspectRatio: string;
  previewImage: string;
}

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  unit: string;
  description: string;
  category: 'selfstudio' | 'pass-foto' | 'person' | 'print' | 'frame' | 'file' | 'prop';
  isSelfStudioOnly?: boolean;
  applicableCategories?: string[];
}

export interface PricelistSheet {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  imageUrl: string;
  galleryImages?: string[];
  aspectRatio: string;
  description: string;
  relatedPackageIds: string[];
}

export interface BookingFormData {
  packageId: string;
  backdropId: string;
  frameTemplateId: string;
  selectedAddOns: { [addOnId: string]: number }; // addOnId -> quantity
  date: string;
  timeSlot: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  notes?: string;
}

export interface ReviewItem {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
  packageName: string;
}
