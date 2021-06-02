import { RouterState } from "connected-react-router";
import { Reducer } from "react";
import { AnyAction } from "redux";

export type LoginReqType = {
  email: string;
  password: string;
}

export interface AuthState {
  token: string | null;
  loading: boolean;
  error: Error | null;
}


export interface BooksState {
  books: BookType[] | null;
  loading: boolean;
  error: Error | null;
}

export interface RootState{
  auth: AuthState;
  books: BooksState;
  router: Reducer<RouterState<unknown>, AnyAction>;
}

export interface BookType {
  bookId: number;
  title: string;
  author: string;
  createdAt: string;
  url: string;
}

export interface BookReqType {
  title: string;
  message: string;
  author: string;
  url: string;
}