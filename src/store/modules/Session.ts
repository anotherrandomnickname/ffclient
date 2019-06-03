import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import CookieHandler from '@/store/utils/CookieHandler'
import { ServerResponse } from '@/interfaces/_index'
import axios, { AxiosResponse } from 'axios'
import vuexStore from '@/store/store'
import * as firebase from 'firebase'
import { AccessLevel } from '@/store/utils/RoleClaims'

export interface UserData {
  pk: number
  name: string
  last_login: Date
  created_on: Date
  gender: number
}

type SessionTypes = 'guest' | 'user' | 'blocked' | 'admin'

interface Session {
  type: SessionTypes
  accessLevel: AccessLevel
  user?: UserData
}

function defineSessionType(payload: {
  user: UserData
  accessLevel: number
}): Session {
  let type: SessionTypes
  let session: Session
  const { user, accessLevel } = payload
  if (accessLevel === 0) {
    type = 'guest'
  } else if (accessLevel === 1) {
    type = 'blocked'
  } else if (accessLevel === 2) {
    type = 'user'
  } else if (accessLevel === 100) {
    type = 'admin'
  } else {
    type = 'guest'
  }
  session = {
    user,
    type,
    accessLevel,
  }
  return session
}

interface ISession {
  session: Session
}

@Module({ dynamic: true, store: vuexStore, name: 'session', namespaced: true })
export default class SessionModule extends VuexModule implements ISession {
  public isFetching: boolean = false
  public isFetched: boolean = false
  public error: string | null = null
  public regError: string | null = null
  public isAuthed: boolean | null = null
  public currentConnection: any = ''
  public session: Session = {
    type: 'guest',
    accessLevel: 0,
  }

  @Action
  public async CREATE_USER(payload: any) {
    const ctrf: string = CookieHandler.createCtrf()
    AuthHandler.register(payload.email, payload.pass, ctrf)
      .catch((err: any) => {
        this.context.commit('HANDLE_ERROR_MESSAGE', err.code)
        console.log(err)
      })
      .then((res: any) => {
        if (res.status === 200) {
          vuexStore.dispatch('msg/WRITE_MESSAGE', {
            type: 'registration',
            args: [res.data.name],
          })
          CookieHandler.deleteCookie()
        }
      })
  }

  @Action
  public async SIGN_IN(payload: any): Promise<void> {
    await firebase
      .auth()
      .signInWithEmailAndPassword(payload.email, payload.password)
      .then((res: any) => {
        console.log('RES', res)
      })
      .catch((err: any) => {
        this.context.commit('HANDLE_ERROR_MESSAGE', err.code)
      })
  }

  @Action
  public async SIGN_OUT(): Promise<void> {
    firebase
      .auth()
      .signOut()
      .then(() => {
        console.log('SIGNED OUT!')
        this.context.commit('DISCARD_USER_STATE', {})
      })
  }

  @Action
  public REGISTER_SESSION_OBSERVER(): void {
    firebase.auth().onAuthStateChanged((user: any) => {
      if (user) {
        this.context.dispatch('INIT_SESSION', { user })
      } else {
        console.log('GUESTED!')
        this.context.commit('MOUNT_GUEST_SESSION', {})
      }
    })
  }

  @Action
  public async INIT_SESSION(payload: { user: firebase.User }): Promise<void> {
    this.context.commit('START_FETCH', {})
    const ctrf: string = CookieHandler.createCtrf()
    const user = payload.user
    await AuthHandler.fetchSessionAuth(ctrf, user).then(
      (response: AxiosResponse) => {
        if (response.status === 200) {
          this.context.commit('MOUNT_SESSION', { response })
          this.context.commit('FINISH_FETCH_SUCCESS', {})
          this.context.dispatch('REGISTER_PRESENCE_OBSERVER', {
            user: response.data.user,
            accessLevel: response.data.accessLevel,
            uid: user.uid,
          })
          CookieHandler.deleteCookie()
        } else {
          this.context.commit('HANDLE_ERROR_MESSAGE', response.data)
        }
      },
    )
  }

  @Action
  public async REGISTER_PRESENCE_OBSERVER(payload: {
    user: UserData
    accessLevel: number
    uid: string
  }): Promise<void> {
    const userPresence: { accessLevel: number; name: string; pk: number } = {
      accessLevel: payload.accessLevel,
      name: payload.user.name,
      pk: payload.user.pk,
    }

    const amOnline = firebase.database().ref('.info/connected')
    const myConnectionsRef = firebase
      .database()
      .ref('users/' + payload.uid + '/connections')
    const lastOnlineRef = firebase
      .database()
      .ref('users/' + payload.uid + '/lastOnline')

    this.context.commit('SET_USERDATA_TO_FIREBASE_DB', {
      user: payload.user,
      uid: payload.uid,
      accessLevel: payload.accessLevel,
    })

    this.context.commit('REGISTER_USER_CONNECTION', { uid: payload.uid })
  }

  @Mutation
  public REGISTER_USER_CONNECTION(payload: { uid: string }): void {
    const amOnline = firebase.database().ref('.info/connected')
    const myConnectionsRef = firebase
      .database()
      .ref('users/' + payload.uid + '/connections')
    const lastOnlineRef = firebase
      .database()
      .ref('users/' + payload.uid + '/lastOnline')

    amOnline.on('value', (snap: any) => {
      if (snap.val() === true) {
        console.log('TRUE!', snap.val())
        this.currentConnection = myConnectionsRef.push()
        this.currentConnection.onDisconnect().remove()
        this.currentConnection.set(true)
        lastOnlineRef
          .onDisconnect()
          .set(firebase.database.ServerValue.TIMESTAMP)
      }
    })
  }

  @Mutation
  public SET_USERDATA_TO_FIREBASE_DB(payload: {
    user: UserData
    uid: string
    accessLevel: number
  }) {
    const userDataRef = firebase
      .database()
      .ref('users/' + payload.uid + '/info')

    userDataRef.set({
      name: payload.user.name,
      accessLevel: payload.accessLevel,
      pk: payload.user.pk,
      gender: payload.user.gender,
    })
  }

  @Mutation
  public DISCARD_USER_STATE(): void {
    this.session = {
      type: 'guest',
      accessLevel: 0,
    }
    this.isFetched = false
    this.currentConnection.remove()
  }

  @Mutation
  public HANDLE_ERROR_MESSAGE(code: string): void {
    let error: string | null = null
    if (code === 'auth/user-not-found') {
      error = 'Пользователь с таким email не найден'
    } else if (code === 'auth/wrong-password') {
      error = 'Проверьте правильность ввода пароля'
    } else if (code === 'auth/email-already-in-use') {
      this.regError = 'Такая почта уже зарегистрирована!'
    } else if (code === 'CTRF ATTACK!') {
      error =
        'Доступ в данный момент запрещен. Приносим извинения за неудобства!'
    }
    this.error = error
  }

  @Mutation
  public CLEAR_ERROR_HANDLER(): void {
    this.error = null
    this.regError = null
  }

  @Mutation
  public MOUNT_SESSION(payload: { response: AxiosResponse<any> }): void {
    const { response } = payload
    const session = defineSessionType({
      user: response.data.user,
      accessLevel: response.data.accessLevel,
    })
    if (session.type !== 'guest') {
      this.isAuthed = true
      this.isFetched = true
    }
    this.isFetching = false
    this.session = session
  }

  @Mutation
  public MOUNT_GUEST_SESSION(): void {
    this.isFetching = false
    this.isFetched = true
    this.isAuthed = false
  }

  @Mutation
  public START_FETCH(): void {
    this.isFetching = true
  }

  @Mutation
  public FINISH_FETCH_SUCCESS(): void {
    this.isFetched = true
    this.isFetching = false
  }

  @Mutation
  public FINISH_FETCH_FAIL(): void {
    this.isFetched = false
    this.isFetching = false
  }

  get isFetchingGetter() {
    return this.isFetching
  }

  get isAuthedGetter() {
    return this.isAuthed
  }

  get isFetchedGetter() {
    return this.isFetched
  }

  get responseGetter() {
    return this.session
  }
}

class AuthHandler {
  public static async fetchSessionAuth(
    ctrfToken: string,
    user: firebase.User,
  ): Promise<AxiosResponse> {
    return user.getIdToken().then((idToken: any) => {
      return axios
        .post(
          'http://localhost:3111/login',
          { idToken, ctrfToken },
          { withCredentials: true },
        )
        .then((response: AxiosResponse) => {
          /* firebase.auth().signInWithCustomToken(res.data.token) */
          return response
        })
        .catch((err: any) => {
          console.log(err.response)
          return err
        })
    })
  }

  public static async register(
    email: string,
    password: string,
    ctrfToken: string,
  ): Promise<ServerResponse<UserData>> {
    return firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(
        (credential: firebase.auth.UserCredential): any => {
          if (credential.user) {
            return credential.user.getIdToken().then((idToken: string) => {
              return axios
                .put(
                  'http://localhost:3111/register',
                  { idToken, ctrfToken, email },
                  { withCredentials: true },
                )
                .then((response: AxiosResponse) => {
                  return response
                })
            })
          }
        },
      )
  }
}
