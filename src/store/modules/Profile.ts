import { Module, VuexModule, Mutation, Action } from 'vuex-module-decorators'
import CookieHandler from '@/store/utils/CookieHandler'
import { ServerResponse } from '@/interfaces/_index'
import vuexStore from '@/store/store'
import * as firebase from 'firebase'
import axios, { AxiosResponse, AxiosError } from 'axios'

interface Profile {
  current_title: string
  gender: number
  is_online: boolean
  name: string
  photourl: string | null
  pk: number
  role_claims: number
  signature: string
  titles: null | string
  total_posts: number
}

@Module({ dynamic: true, store: vuexStore, name: 'profile', namespaced: true })
export default class ProfileModule extends VuexModule {
  public isFetching: boolean = false
  public isFetched: boolean = false
  public errorCode: number | null = null
  public profile: Profile | null = null
  public userprofile: Profile | null = null

  @Action
  public async FETCH(payload: { pk: number }) {
    const user = firebase.auth().currentUser
    const { pk } = payload

    /* ProfileHandler.fetchOwnUserProfile(pk).then((response: AxiosResponse) => {
      console.log('PROFILE RESPONSE: ', response)
    }) */
  }

  @Action({ commit: 'MOUNT_CURRENT' })
  public async FETCH_CURRENT_USER_PROFILE(): Promise<Profile[]> {
    const user = firebase.auth().currentUser
    const pk = vuexStore.getters['session/responseGetter'].user.pk
    return ProfileHandler.fetchOwnUserProfile(pk, user).then(
      (profile: Profile[]) => {
        return profile
      },
    )
  }

  @Action
  public async FETCH_USER_PROFILE(payload: { pk: number }): Promise<void> {
    await ProfileHandler.fetchUserProfile(payload.pk)
      .then((profile: Profile[]) => {
        this.context.commit('MOUNT', profile)
      })
      .catch((err: AxiosError) => {
        this.context.commit('MOUNT_SERVER_ERROR', err.response!.status)
      })
  }

  @Action
  public async UPDATE_PROFILE(payload: {
    name: string
    photourl: string | null
    gender: number
  }): Promise<void> {
    console.log('PAYLOAD', payload)

    const user = firebase.auth().currentUser
    if (user) {
      user
        .updateProfile({
          displayName: payload.name,
          photoURL: payload.photourl,
        })
        .then(() => {})
    }
  }

  @Mutation
  public MOUNT(profile: Profile[]) {
    this.userprofile = profile[0]
  }

  @Mutation
  public MOUNT_SERVER_ERROR(status: number): void {
    this.errorCode = status
  }

  @Action
  public async CHANGE_PROFILE_USER_DATA(payload: {
    name: string
    photourl: string
    gender: number
  }): Promise<void> {
    console.log('CHANGE PROFILE PAYLOAD:', payload)
  }

  @Mutation
  public MOUNT_CURRENT(profile: Profile[]): void {
    this.profile = profile[0]
  }
}

class ProfileHandler {
  public static async fetchUserProfile(pk: number): Promise<Profile[]> {
    console.log('START FETCHIN')
    return axios
      .get('http://localhost:8010/profile/' + pk)
      .then((response: AxiosResponse) => {
        console.log('RESPONSE', response)
        return ProfileHandler.bakeData(response)
      })
  }

  public static async fetchOwnUserProfile(
    pk: number,
    user: firebase.User | null,
  ): Promise<Profile[]> {
    const ctrf = CookieHandler.createCtrf()
    return user!.getIdToken().then((idToken: any) => {
      return axios
        .get('http://localhost:3111/profile', {
          params: { idtoken: idToken, ctrftoken: ctrf, pk },
          withCredentials: true,
        })
        .then((response: AxiosResponse) => {
          return ProfileHandler.bakeData(response)
        })
    })
  }

  private static bakeData(response: AxiosResponse): Profile[] {
    const profile: Profile[] = []
    const data = response.data
    const profileData: Profile = {
      current_title: data.current_title[0],
      gender: data.gender[0],
      is_online: data.is_online[0],
      name: data.name[0],
      photourl: data.photourl[0],
      pk: data.pk[0],
      role_claims: data.role_claims[0],
      signature: data.signature[0],
      titles: data.titles[0],
      total_posts: data.total_posts[0],
    }
    profile.push(profileData)
    return profile
  }
}
