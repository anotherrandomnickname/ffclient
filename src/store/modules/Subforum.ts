import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import { ServerResponse, ServerError, isServerError } from '@/interfaces/_index'
import axios, { AxiosResponse, AxiosError, AxiosRequestConfig } from 'axios'
import vuexStore from '@/store/store'
import LocalDate from '@/store/utils/LocalDate'
import {
  RoleClass,
  AccessLevel,
  Groups,
  replaceClaimText,
  GroupClass,
  defineNicknameColor,
} from '@/store/utils/RoleClaims'
import * as firebase from 'firebase'
import CookieHandler from '@/store/utils/CookieHandler'

interface ISubforumData {
  pk: number
  description: string
  isFixed: boolean
  lastPostdate: LocalDate
  lastUsername: string
  lastUserClaim: string
  lastUserPk: number
  topicName: string
  totalViews: number
  totalPosts: number
  tsPk: number
  tsName: string
  tsUserClaim: string
}

export interface ISubforum {
  forumDesc: string
  forumName: string
  pk: number
  pic?: string
  data?: ISubforumData[]
}

@Module({ dynamic: true, store: vuexStore, name: 'subforum', namespaced: true })
class Subforum extends VuexModule {
  public isFetching: boolean = false
  public isFetched: boolean = false
  public error: string | null = null
  public response: ServerResponse<ISubforum> = {
    status: 0,
  }

  @Action
  public async CREATE_NEW_THEME(payload: {
    name: string
    description: string
    body: string
    userpk: number
    fid: number
  }): Promise<void> {
    const user = firebase.auth().currentUser!
    if (user) {
      SubforumHandler.createTheme(payload, user)
    }
  }

  @Action({ commit: 'MOUNT_RESPONSE' })
  public async FETCH_SUBFORUM_THEMES(
    payload: any,
  ): Promise<ServerResponse<ISubforum> | ServerError | void> {
    return SubforumHandler.fetch(payload.id)
      .then((response: ServerResponse<ISubforum> | ServerError) => {
        console.log('RESULT', response)
        return response
      })
      .catch((error: ServerError) => {
        console.log('ERROR', error)
        this.context.commit('FINISH_FETCH_FAILURE', {})
        this.context.commit('HANDLE_SERVER_ERROR', error)
      })
  }

  @Mutation
  public MOUNT_RESPONSE(response: ServerResponse<ISubforum>): void {
    console.log('MOUNTED')
    this.response = response
  }
}

class SubforumHandler {
  public static bakeData(data: any) {
    const result: ISubforum = {
      forumDesc: data.forum_description,
      forumName: data.forum_name,
      pk: data.forum_pk,
      pic: data.forum_pic,
      data: [],
    }

    const forums = data.data
    console.log(forums.pk instanceof Array)
    if (forums.pk instanceof Array) {
      for (let i = 0; i < forums.pk.length; i++) {
        const userRole = AccessLevel[forums.last_user_role[i]]
        const tsRole = AccessLevel[forums.topicstarter_role[i]]
        const userGroupCss = Groups[0]
        const tsGroupCss = Groups[0]
        console.log(userRole)
        console.log(tsRole)
        const res: ISubforumData = {
          pk: forums.pk[i],
          description: forums.description[i],
          isFixed: forums.is_fixed[i],
          lastPostdate: new LocalDate(forums.last_postdate[i]),
          lastUsername: forums.last_user_name[i],
          lastUserPk: forums.last_user_pk[i],
          lastUserClaim: defineNicknameColor(
            forums.last_user_role[i],
            userRole,
            GroupClass[userGroupCss as keyof typeof GroupClass],
          ),
          topicName: forums.name[i],
          totalViews: forums.total_views[i],
          totalPosts: forums.total_posts[i],
          tsPk: forums.topicstarter_pk[i],
          tsName: forums.topicstarter_name[i],
          tsUserClaim: defineNicknameColor(
            forums.topicstarter_role[i],
            tsRole,
            GroupClass[tsGroupCss as keyof typeof GroupClass],
          ),
        }
        if (result.data) {
          result.data.push(res)
        }
      }
    }
    return result
  }

  public static async fetch(
    id: number,
  ): Promise<ServerResponse<ISubforum> | ServerError> {
    return axios
      .get('http://localhost:8010/subforum/' + id)
      .then((response: any) => {
        console.log('TOPICS RESPONSE', response)
        return {
          status: response.status,
          data: this.bakeData(response.data),
        }
      })
  }

  public static async createTheme(
    payload: {
      name: string
      description: string
      body: string
      userpk: number
      fid: number
    },
    user: firebase.User,
  ): Promise<AxiosResponse> {
    const ctrfToken = CookieHandler.createCtrf()

    return user.getIdToken().then((idToken: string) => {
      return axios
        .put(
          'http://localhost:3111/createtheme',
          { ...payload, idToken, ctrfToken },
          { withCredentials: true },
        )
        .then((response: AxiosResponse) => {
          console.log('RESPONSE: ', response)
          return response
        })
    })
  }
}

export default Subforum
