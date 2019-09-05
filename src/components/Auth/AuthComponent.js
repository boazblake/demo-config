import m from 'mithril'
import {
  Login,
  Register,
  validateLoginTask,
  validateRegistrationTask,
} from '../../Forms/index.js'
import Modal from '../Modal.js'
import { jsonCopy } from 'utils'

const initData = {
  name: '',
  email: '',
  password: '',
  confirmEmail: '',
  confirmPassword: '',
}

const state = {
  forms: { 1: Register, 0: Login },
  page: 0,
  title: {
    1: 'Register',
    0: 'Login',
  },
  isSubmitted: false,
  errors: {},
  httpError: undefined,
  data: jsonCopy(initData),
}

const resetState = () => {
  state.data = jsonCopy(initData)
  state.errors = {}
  state.httpError = undefined
  state.isSubmitted = false
  state.page = 0
}

const onRegisterError = (error) => {
  console.log('error with registering', error)
  state.httpError = error.message
  state.isSubmitted = false
}

const onRegisterSuccess = (mdl) => (data) => {
  state.page = 1
  console.log('succes with registering', data, mdl)
}
const onLoginError = (error) => {
  console.log('error with login', error)
  state.httpError = error.message
  state.isSubmitted = false
}

const onLoginSuccess = (mdl) => (user) => {
  window.sessionStorage.setItem('user-token', user['user-token'])
  mdl.user = user
  mdl.state.isAuth(true)
  mdl.toggleAuthModal(mdl)
  resetState()
}

const validateForm = (mdl) => (data) => {
  const onValidationError = (errs) => {
    state.errors = errs
    console.log('failed - state', state)
  }

  const onValidationSuccess = (data) => {
    state.errors = {}
    state.page
      ? registerUser(mdl)(data).fork(onRegisterError, onRegisterSuccess(mdl))
      : loginUser(mdl)(data).fork(onLoginError, onLoginSuccess(mdl))
  }

  state.isSubmitted = true
  state.page
    ? validateRegistrationTask(data).fork(
      onValidationError,
      onValidationSuccess
    )
    : validateLoginTask(data).fork(onValidationError, onValidationSuccess)
}

const loginUser = (mdl) => (dto) =>
  mdl.http.postTask(mdl)('users/login')({
    dto: { login: dto.email, password: dto.password },
  })

const registerUser = (mdl) => (dto) =>
  mdl.http.postTask(mdl)('users/register')({ dto })

const changePage = () => {
  state.httpError = undefined
  return state.page ? (state.page = 0) : (state.page = 1)
}

const AuthLink = () => {
  return {
    view: ({ attrs: { title } }) =>
      m(
        'a.AuthLinkBtn btn-link',
        {
          onclick: changePage,
        },
        title
      ),
  }
}

const AuthComponent = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(Modal, {
        isActive: mdl.state.showAuthModal(),
        close: () => {
          mdl.toggleAuthModal(mdl)
        },
        title: state.title[state.page],
        content: m(state.forms[state.page], {
          data: state.data,
          errors: state.errors,
          httpError: state.httpError,
          isSubmitted: state.isSubmitted,
        }),
        footer: [
          m(
            'button.btn.btn-primary authBtn',
            { onclick: () => validateForm(mdl)(state.data) },
            state.title[state.page]
          ),
          m(AuthLink, {
            mdl,
            title: state.page ? 'Login' : 'Register',
          }),
        ],
      }),
  }
}

export default AuthComponent
