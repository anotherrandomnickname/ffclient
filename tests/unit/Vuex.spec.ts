import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import {} from 'mocha'
import Session from '@/store/modules/Session'
import Vuex, { Store } from 'vuex'
import { VuexModule } from 'vuex-module-decorators'

const localVue = createLocalVue()
localVue.use(Vuex)

describe('Vuex: Session', () => {
  const store: Store<any> = new Vuex.Store({
    modules: {
      session: Session,
    },
  })

  it('Должно ИНИЦИАЛИЗИРОВАТЬ СЕССИЮ', async done => {
    const session = store.state.session
    const token = session.s.init()

    const submit: any = {
      login: 'Overlord',
      password: 'sarinaru007123',
      token,
    }

    expect(token).equal(
      document.cookie.replace(
        /(?:(?:^|.*;\s*)st\s*\=\s*([^;]*).*$)|^.*$/,
        '$1',
      ),
    )

    await session.auth.fetchAuth(submit).then((data: any) => {
      expect(data).not.equal(undefined)
      expect(data.name).equal('Overlord')
      expect(data.token).equal(token)
      done()
    })
  })

  it('НЕ должно ИНИЦИАЛИЗИРОВАТЬ СЕССИЮ', async done => {
    const session = store.state.session

    const wrongSubmit1: any = {
      login: 'Pawn3',
      password: '3422sss',
      token: '',
    }

    const wrongSubmit2: any = {
      login: 'Overlord',
      password: 'sdfs3432',
      token: '',
    }

    await session.auth.fetchAuth(wrongSubmit1).then((data: any) => {
      expect(data).not.equal(undefined)
      expect(data.msg).equal(1)
      done()
    })
    await session.auth.fetchAuth(wrongSubmit2).then((data: any) => {
      expect(data).not.equal(undefined)
      expect(data.isError).not.equal(undefined)
      expect(data.msg).equal(1)
      done()
    })
  })

  it('Логин НЕ ДОЛЖЕН быть ВАЛИДНЫМ', async done => {
    const session = store.state.session
    const submit: any = {
      login: '324ddsf',
      password: '',
      token: '',
    }

    const submit2: any = {
      login: '43',
      password: '0006',
      token: '',
    }

    await session.auth.fetchAuth(submit).then((data: any) => {
      expect(data).not.equal(undefined)
      expect(data.isError).equal(true)
      expect(data.msg).not.equal(null)
      done()
    })

    await session.auth.fetchAuth(submit2).then((data: any) => {
      expect(data).not.equal(undefined)
      expect(data.isError).equal(true)
      expect(data.msg).not.equal(null)
      done()
    })
  })

  /* it('Должно попытаться взять ТОКЕН ИЗ КУК и записать в SessionHandler', () => {
    let session = store.state.session
    let token = session.s.token
    session.s.token = null
    session.s.tryCatchToken()
    expect(store.state.session.s.token).equal(token)
  }) */

  it('Должно ИНИЦИАЛИЗИРОВАТЬ сессию ПО ТОКЕНУ', async done => {
    const session = store.state.session
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)st\s*\=\s*([^;]*).*$)|^.*$/,
      '$1',
    )
    await session.auth.fetchTokenAuth(token).then((data: any) => {
      expect(token).equal(session.s.token)
      expect(data).not.equal(undefined)
      expect(data.name).equal('Overlord')
      expect(data.token).equal(token)
      done()
    })
  })

  it('Должно сделать ЛОГАУТ и удалить ТОКЕН К ХУЯМ', async done => {
    const session: any = store.state.session
    session.s.tryCatchToken()
    const token = session.s.token
    await session.auth
      .fetchLogout(token)
      .then((status: any) => {
        expect(status).equal(200)
        if (status === 200) {
          session.s.token = null
          session.user = null
        }
      })
      .then((data: any) => {
        expect(session.s.token).equal(null)
        expect(session.user).to.equal(null)
        done()
      })
  })

  /* it('НЕ ДОЛЖНО инициализировать сессию ПО ТОКЕНУ', () => {}) */

  it('Должно ЗАРЕГИСТРИРОВАТЬСЯ и инициализировать СЕССИЮ', async done => {
    const session = store.state.session
    const token = session.s.init()
    const submit: any = {
      login: 'Pawn',
      pass: 'sooqalubov',
      passConf: 'sooqalubov',
      email: 'exanasds@dot.com',
      token: session.s.token,
    }
    await session.auth.fetchReg(submit).then((data: any) => {
      expect(data.isError).equal(undefined)
      expect(data.name).equal(submit.login)
      expect(data.email).equal(submit.email)
      expect(data.token).equal(session.s.token)
      done()
    })
  })

  it('Должно АВТОРИЗИРОВАТЬСЯ по зарегистрированному ЛОГИНУ', () => {
    const session = store.state.session
    const submit: any = {
      login: 'Pawn',
      password: 'sooqalubov',
      token: '',
    }

    store.commit('HANDLE_LOGIN', submit)
    expect(session.s.user).to.equal(submit.login)
  })
})
