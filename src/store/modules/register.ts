export type ModulesOptions =
  | 'parser'
  | 'presence'
  | 'messages'
  | 'chat'
  | 'profile'

interface IModules {
  parser: boolean
  presence: boolean
  messages: boolean
  chat: boolean
  profile: boolean
}

const modules: IModules = {
  parser: false,
  presence: false,
  messages: false,
  chat: false,
  profile: false,
}

export default function registerModule(module: ModulesOptions): void {
  modules[module as keyof typeof modules] = true
}

export function isModuleRegistered(module: ModulesOptions): boolean {
  const review = modules[module as keyof typeof modules]
  if (review) {
    return true
  } else {
    return false
  }
}
