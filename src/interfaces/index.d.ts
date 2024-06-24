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
export interface IBrand {
  _id: string;
  brandName: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface IAuthor {
  _id: string;
  membername: string;
  email: string;
}

export interface IComment {
  _id: string;
  rating: number;
  content: string;
  author: IAuthor;
  createdAt: Date;
  updatedAt: Date;
}

export interface IWatches {
  _id: string;
  watchName: string;
  image: string;
  price: number;
  automatic: boolean;
  watchDescription: string;
  brand: IBrand;
  comments: IComment[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
