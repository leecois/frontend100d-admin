import type { Dayjs } from 'dayjs';

// interfaces.ts
export interface IUser {
  _id: string;
  membername: string;
  email: string;
  YOB?: number;
  isAdmin: boolean;
  authentication: {
    _id: string;
  };
  __v: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IIdentity {
  id: number;
  name: string;
  avatar: string;
}

export interface IUserFilterVariables {
  name?: string;
  email?: string;
  YOB?: number;
  isAdmin?: boolean;
  _id?: string;
}

export interface IImage {
  id: number;
  link: string;
}

// Define the Brand interface
export interface IBrand {
  _id: string;
  brandName: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Define the Watch interface
export interface IWatches {
  _id: string;
  watchName: string;
  image: string;
  price: number;
  automatic: boolean;
  watchDescription: string;
  brand: IBrand;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Define the Author interface for comments
export interface IAuthor {
  _id: string;
  membername: string;
  email: string;
  YOB: number;
  isAdmin: boolean;
  authentication: {
    _id: string;
  };
  __v: number;
  updatedAt: Date;
}

// Define the Comment interface
export interface IComment {
  _id: string;
  rating: number;
  content: string;
  author: IAuthor;
  watch: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

// Define the ProductDetail interface, which includes watch details and comments
export interface IProductDetail {
  watch: IWatches;
  comments: IComment[];
}

export interface ICategory {
  id: number;
  name: string;
  description: string;
  status: number;
  imageUrl: string;
  isFeatured: boolean;
}

export interface IOrderFilterVariables {
  q?: string;
  store?: string;
  user?: string;
  createdAt?: [Dayjs, Dayjs];
  status?: string;
}

export interface IReview {
  id: number;
  content: string;
  title: string;
  numberStars: number;
  customerId: number;
  productId: number;
  reviewImages: string[];
}
