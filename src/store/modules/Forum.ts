import {
  Module,
  VuexModule,
  Mutation,
  Action,
  getModule,
} from 'vuex-module-decorators'
import {
  ServerResponse,
  asServerResponse,
  ServerError,
  isServerError,
} from '@/interfaces/_index'
import ErrorHandler from '@/store/utils/ErrorHandler'
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

export interface IForum {
  fpk: number
  section: number
  order: number
  sectionName: string
  forumName: string
  forumDescription: string
  lastTopicName: string
  lastUsername: string
  lu_css: string
  lastPostdate: LocalDate
  lastTopicPk: number
  lastUserPk: number
}

@Module({ dynamic: true, store: vuexStore, name: 'forum', namespaced: true })
class Forum extends VuexModule {
  public isFetching: boolean = false
  public isFetched: boolean = false
  public error: string | null = null
  public response: ServerResponse<IForum[]> = {
    status: 0,
  }

  @Action({ commit: 'MOUNT_RESPONSE' })
  public async FETCH_FORUM_PAGE(): Promise<
    ServerResponse<IForum[]> | ServerError | void
  > {
    this.context.commit('START_FETCH')
    return ForumHandler.fetchForumPage()
      .then((response: ServerResponse<IForum[]> | ServerError) => {
        console.log('RESULT', response)
        return response
      })
      .catch((error: ServerError) => {
        console.log('ERROR?', error)
        this.context.commit('FINISH_FETCH_FAILURE', {})
        this.context.commit('HANDLE_SERVER_ERROR', error)
      })
    /* return response */
  }

  @Mutation
  public MOUNT_RESPONSE(response: ServerResponse<IForum[]>): void {
    if (response.status === 200) {
      this.response = response
      this.isFetched = true
    }
  }

  @Mutation
  public START_FETCH(): void {
    this.isFetching = true
    this.isFetched = false
  }

  @Mutation
  public FINISH_FETCH(success: boolean): void {
    console.log('FINISH FORUM FETCHING!')
    this.isFetched = success ? true : false
    this.isFetching = false
  }

  get isFetchingGetter() {
    return this.isFetching
  }

  get isFetchedGetter() {
    return this.isFetched
  }

  get responseGetter() {
    return this.response
  }
}

class ForumHandler {
  public static handleForumData(data: any): IForum[] {
    const values: any[] = Object.values(data)
    const result: IForum[] = []

    if (data.fpk instanceof Array) {
      for (let i = 0; i < data.fpk.length; i++) {
        const userRole = AccessLevel[data.last_user_role[i]]
        const group = Groups[0]
        const res: IForum = {
          fpk: data.fpk[i],
          section: data.section[i],
          order: data.order[i],
          sectionName: data.section_name[i],
          forumName: data.forum_name[i],
          forumDescription: data.forum_description[i],
          lastTopicName: data.last_topic_name[i],
          lastUsername: data.last_user_name[i],
          lu_css: defineNicknameColor(
            data.last_user_role[i],
            userRole,
            GroupClass[group as keyof typeof GroupClass],
          ),
          lastPostdate: new LocalDate(data.last_post_date[i]),
          lastTopicPk: data.topic_pk[i],
          lastUserPk: data.user_pk[i],
        }
        result.push(res)
      }
    }
    return result
  }

  public static bakeForumData = (forums: IForum[]): any => {
    const result: any = []
    let sections: any

    if (forums.length > 1) {
      sections = forums.reduce(
        (prev: any, curr: any, index: number): any => {
          if (index === 1) {
            return [prev.section, curr.section]
          }
          return [...prev, curr.section]
        },
      )
    } else {
      sections = [forums[0].section]
    }
    const totalSections = new Set(sections as number[])

    for (let i = 0; i < totalSections.size; i++) {
      const sec = forums.filter((val: any) => {
        return val.section === i + 1
      })

      result.push(sec)
    }
    return result
  }

  public static async fetchForumPage(): Promise<
    ServerResponse<IForum[]> | ServerError
  > {
    return axios
      .get('http://localhost:8010/forum')
      .then((response: AxiosResponse) => {
        console.log('RESPONSE', response)
        if (response.status === 200) {
          const rawForums = this.handleForumData(response.data)
          const bakedForums = this.bakeForumData(rawForums)
          return {
            status: response.status,
            data: bakedForums,
          }
        } else {
          console.log('ERROR FUCKING ERROR')
          return response
        }
      })
  }
}

export default Forum
