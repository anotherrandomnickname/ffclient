/* enum GuildClass {
  Хвост_Феи = 'green'
}

enum Guild {
  Хвост_Феи
}

const guild = 0
const guildType: string = Guild[guild].toString()
const guildText: string = replaceClaimText(guildType)
const guildColor: GuildClass = GuildClass[guildType as keyof typeof GuildClass]
console.log('GUILD TYPE', guildType)
console.log('GUILD COLOR', guildColor)
console.log('GUILD TEXT', guildText)
const color: keyof typeof GuildColor = 'Хвост_Феи' */

export enum RoleClass {
  Гость = 'guest',
  Заблокированный = 'blocked',
  Пользователь = 'user',
  Младший_Модератор = 'junior-mod',
  Модератор = 'mod',
  Младший_Библиарий = 'junior-bible',
  Младший_Пидаль = 'junior-admin',
  Библиарий = 'bible',
  Пидаль = 'admin',
}

/* export enum RoleClassFemale {
  Гостья = 'guest',
  Заблокированная = 'blocked',
  Пользовательница = 'user',
  Модератор = 'mod',
  Библиария = 'bible',
  Пидальша = 'admin',
} */

export enum GroupClass {
  Странник = 'noguild',
  Хвост_Феи = 'fairy-tail',
}

export enum Groups {
  Странник,
  Хвост_Феи,
}

export enum AccessLevel {
  Гость = 0,
  Заблокированный = 1,
  Пользователь = 2,
  Младший_Модератор = 4,
  Модератор = 5,
  Младший_Библиарий = 7,
  Младший_Пидаль = 8,
  Библиарий = 9,
  Пидаль = 100,
}

export function replaceClaimText(claim: string): string {
  return claim.replace(/_/g, ' ')
}

export function defineNicknameColor(
  accessLevel: number,
  userRole: string,
  group: string,
): string {
  if (accessLevel >= 5 /* || accessLevel <= 1 */) {
    return RoleClass[userRole as keyof typeof RoleClass]
  } else {
    return group
  }
}
