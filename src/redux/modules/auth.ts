import { call, put, select, takeEvery } from "@redux-saga/core/effects";
import { push } from "connected-react-router";
import { Action, createActions, handleActions } from "redux-actions";
import TokenService from "../../services/TokenService";
import UserService from "../../services/UserService";
import { AuthState, LoginReqType } from "../../types";


const initialState: AuthState = {
  token: null,
  loading: false,
  error: null
};

const prefix = 'my-books/auth';

export const {pending, success, fail } = createActions(
  'PENDING', 
  'SUCCESS', 
  'FAIL', 
  {prefix}
);

const reducer = handleActions<AuthState, string>({
  PENDING: (state) => ({
    ...state,
    loading: true,
    error: null,
  }),
  SUCCESS: (state, action) => ({
    token: action.payload,
    loading: false,
    error: null,
  }),
  FAIL: (state, action: any) => ({
    ...state,
    loading: false,
    error: action.payload,
  }),
}, initialState, {prefix});

export default reducer;


//saga
export const { login, logout } = createActions("LOGIN", "LOGOUT", { prefix });

function* loginSaga(action: Action<LoginReqType>) {
  try {
    yield put(pending());
    const token: string = yield call(UserService.login, action.payload); // 오류 해소. redux-action의 Action을 받아와야함
    // localstorage
    TokenService.set(token);
    yield put(success(token));  //state 변경처리
    //push
    yield put(push('/'));       //이동
  } catch (error) {
    yield put(fail(new Error(error?.response?.data?.error || "UNKNOWN_ERROR")));
  }
}

function* logoutSaga() {
  try {
    yield put(pending());
    const token: string = yield select(state => state.auth.token);
    yield call(UserService.logout, token);
    TokenService.set(token);
  } catch (error) {    
  } finally{
    TokenService.remove();
    yield put(success(null));
  }
}

export function* authSaga() {
  yield takeEvery(`${prefix}/LOGIN`, loginSaga);
  yield takeEvery(`${prefix}/LOGOUT`, logoutSaga);
}