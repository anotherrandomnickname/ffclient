import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import {
  ServerResponse,
  asServerResponse,
  ServerError,
  isServerError,
} from '@/interfaces/_index'
import axios, { AxiosResponse, AxiosError } from 'axios'
import vuexStore from '@/store/store'
import {
  RoleClass,
  AccessLevel,
  Groups,
  replaceClaimText,
  GroupClass,
  defineNicknameColor,
} from '@/store/utils/RoleClaims'
import LocalDate from '@/store/utils/LocalDate'
import * as firebase from 'firebase'
import CookieHandler from '@/store/utils/CookieHandler'

interface IPost {
  post_body: string
  post_date: LocalDate
  post_likes: number
  post_pk: number
  user_pk: number
  user_name: string
  user_role: string /* enum AccessLevel */
  user_css: string /* enum RoleClass */
  user_group: string
  user_posts: number
  user_current_title: string
  user_signature: string
  user_is_online: boolean
}

interface ITheme {
  created_on: LocalDate
  data: IPost[]
  topic_body: string
  topic_description: string
  topic_name: string
  topic_total_posts: number
  ts_name: string
  ts_pk: number
  ts_group: string
  ts_role: string /* enum AccessLevel */
  ts_css: string /* enum RoleClass */
}

@Module({ dynamic: true, store: vuexStore, name: 'theme', namespaced: true })
export default class Theme extends VuexModule {
  public isFetching: boolean = false
  public isFetched: boolean = false
  public error: string | null = null
  public response: ServerResponse<ITheme> = {
    status: 0,
  }
  public postCreated: boolean = false

  @Action({ commit: 'MOUNT_RESPONSE' })
  public async FETCH(payload: {
    id: number
    page: number
    saveMountedData?: boolean
  }): Promise<ServerResponse<ITheme> | ServerError | void> {
    this.context.commit('START_FETCH', {
      saveMountedData: payload.saveMountedData,
    })
    return ThemeHandler.fetch(payload.id, payload.page)
      .then((response: ServerResponse<ITheme> | ServerError) => {
        console.log('RESULT', response)
        return response
      })
      .catch((error: ServerError) => {
        /* console.log('ERROR', error) */
        this.context.commit('FINISH_FETCH_FAILURE', {})
        this.context.commit('HANDLE_SERVER_ERROR', error)
      })
  }

  @Action
  public async UPDATE_POST(payload: {
    ppk: string
    post: string
    id: number
    page: number
  }): Promise<void> {
    const user = firebase.auth().currentUser
    if ((user as firebase.User) && user !== null) {
      await user.getIdToken().then((idToken: any) => {
        const ctrfToken = CookieHandler.createCtrf()
        return axios
          .post(
            'http://localhost:3111/updatepost',
            {
              idToken,
              ctrfToken,
              ppk: payload.ppk,
              post: payload.post,
            },
            {
              withCredentials: true,
            },
          )
          .then((response: AxiosResponse) => {
            if (response.status === 200) {
              this.context.dispatch('FETCH', {
                id: payload.id,
                page: payload.page,
                saveMountedData: true,
              })
            }
          })
      })
    }
  }

  @Action
  public async UPDATE_THEME(payload: {
    body: string
    name: string
    description: string
    pk: number
  }): Promise<void> {
    console.log('PAYLOAD: ', payload)
    const user = firebase.auth().currentUser
    if (user) {
      await ThemeHandler.updateTheme({ ...payload, user })
    }
  }

  @Action
  public async DELETE_POST(payload: {
    pk: string
    tid: string
    page: string
    fid: number
  }): Promise<void> {
    const user = firebase.auth().currentUser
    if ((user as firebase.User) && user !== null) {
      user.getIdToken().then((idToken: any) => {
        const ctrfToken = CookieHandler.createCtrf()
        /* const params = new URLSearchParams()
        params.append('idtoken', '32432423') */
        const params = {
          idtoken: idToken,
          ctrftoken: ctrfToken,
          postpk: payload.pk,
          topicpk: payload.tid,
          forumpk: payload.fid,
        }
        /* params.append('ctrf_token', '578744') */
        return axios
          .delete('http://localhost:3111/deletepost', {
            params,
            withCredentials: true,
          })
          .then((response: AxiosResponse) => {
            if (response.status === 200) {
              this.context.dispatch('FETCH', {
                id: payload.tid,
                page: payload.page,
                saveMountedData: true,
              })
            }
          })
      })
    }
  }

  @Action
  public async CREATE_POST(payload: {
    post: string
    tid: number
    page: number
    fid: number
  }): Promise<void> {
    const user = firebase.auth().currentUser
    if ((user as firebase.User) && user !== null) {
      user.getIdToken().then((idToken: any) => {
        const ctrfToken = CookieHandler.createCtrf()
        return axios
          .put(
            'http://localhost:3111/createpost',
            {
              idToken,
              ctrfToken,
              post: payload.post,
              tid: payload.tid,
              fid: payload.fid,
            },
            { withCredentials: true },
          )
          .then((response: AxiosResponse) => {
            console.log('RESPONSE STATUS', response)
            if (response.status === 201) {
              this.context.dispatch('FETCH', {
                id: payload.tid,
                page: payload.page,
                saveMountedData: true,
              })
              this.context.commit('MOUNT_POST_CREATED_STATE', {
                success: true,
              })
            }
            CookieHandler.deleteCookie()
          })
      })
    }
  }

  @Action
  public async DELETE_THEME(payload: { forumId: number; themeId: number }) {
    const user = firebase.auth().currentUser!
    if (user) {
      await ThemeHandler.createTheme({ ...payload, user })
    }
  }

  @Mutation
  public MOUNT_RESPONSE(response: ServerResponse<ITheme>): void {
    if (response.status === 200) {
      this.response = response
      this.isFetched = true
    }
    this.isFetching = false
    console.log('RESPONSE MOUNTED! ISFETCHING? ', this.isFetching)
  }

  @Mutation
  public MOUNT_POST_CREATED_STATE(payload: { success: boolean }): void {
    this.postCreated = payload.success
  }

  @Mutation
  public START_FETCH(payload: { saveMountedData: boolean }): void {
    console.log('START FETCHING', payload.saveMountedData)

    if (payload.saveMountedData) {
      this.isFetched = true
    } else {
      this.isFetching = true
      this.isFetched = false
    }
  }

  @Mutation
  public HANDLE_SERVER_ERROR(): void {
    console.log('FINISH FETCHING FAILURE')
    this.isFetching = false
    this.isFetched = false
  }
}

class ThemeHandler {
  public static async fetch(
    id: number,
    page: number,
  ): Promise<ServerResponse<ITheme> | ServerError> {
    /* { id, page } */
    return axios
      .get('http://localhost:8010/theme/' + id + '/' + page)
      .then(
        (response: AxiosResponse): ServerResponse<ITheme> => {
          /* console.log('RESPONSE', response) */
          const tsRole = AccessLevel[response.data.ts_role]
          const tsGroupCss = Groups[0]
          /* 
          *** Returns server response as ServerResponse interface object
          */
          return asServerResponse({
            ...response,
            data: {
              ...response.data,
              created_on: new LocalDate(response.data.created_on),
              ts_css: defineNicknameColor(
                response.data.ts_role,
                tsRole,
                GroupClass[tsGroupCss as keyof typeof GroupClass],
              ),
              ts_role: tsRole.toString(),
              ts_group: replaceClaimText(Groups[0]),
              data: this.bake({
                ...response.data.data,
                post_date: response.data.data.post_date,
              }),
            },
          })
        },
      )
      .catch(
        (error: AxiosError): ServerError => {
          return error as ServerError
        },
      )
  }

  public static async updateTheme(payload: {
    body: string
    name: string
    description: string
    pk: number
    user: firebase.User
  }): Promise<AxiosResponse> {
    const { body, name, description, pk } = payload
    const ctrfToken = CookieHandler.createCtrf()

    return payload.user
      .getIdToken()
      .then((idToken: any) => {
        return axios.post(
          'http://localhost:3111/updatetheme',
          {
            body,
            name,
            description,
            pk,
            idToken,
            ctrfToken,
          },
          { withCredentials: true },
        )
      })
      .then((response: AxiosResponse) => {
        console.log('RESPONSE', response)
        CookieHandler.deleteCookie()
        return response
      })
  }

  public static async createTheme(payload: {
    forumId: number
    themeId: number
    user: firebase.User
  }): Promise<AxiosResponse> {
    return payload.user.getIdToken().then((idToken: any) => {
      const ctrfToken = CookieHandler.createCtrf()
      const params = {
        forumid: payload.forumId,
        topicid: payload.themeId,
        idtoken: idToken,
        ctrftoken: ctrfToken,
      }
      return axios
        .delete('http://localhost:3111/deletetheme', {
          params,
          withCredentials: true,
        })
        .then((response: AxiosResponse) => {
          console.log('RESPONSE: ', response)
          CookieHandler.deleteCookie()
          return response
        })
    })
  }

  private static bake(data: any): IPost[] {
    const result: IPost[] = []
    for (let i = 0; i < data.post_body.length; i++) {
      const userRole = AccessLevel[data.user_role[i]]
      /* const roleClass = RoleClass[userRole as keyof typeof RoleClass] */
      const userGroupCss = Groups[0]
      const userGroup = userGroupCss.toString()
      result.push({
        post_body: data.post_body[i],
        post_date: new LocalDate(data.post_date[i]),
        post_likes: data.post_likes[i],
        post_pk: data.post_pk[i],
        user_pk: data.user_pk[i],
        user_name: data.user_name[i],
        user_role: userRole.toString(),
        user_css: defineNicknameColor(
          data.user_role[i],
          userRole,
          GroupClass[userGroupCss as keyof typeof GroupClass],
        ),
        user_group: replaceClaimText(userGroup),
        user_posts: data.user_posts[i],
        user_current_title: data.user_current_title[i],
        user_signature: data.user_signature[i],
        user_is_online: data.user_is_online[i],
      })
    }

    return result
  }
}
