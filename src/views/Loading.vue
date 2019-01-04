<template lang='pug'>
  div(class='loading-screen')
    div(class='circle-chan')
      div(class='circle-eye')
      div(class='circle-eye')
      div(class='circle-mouth')
    div(class='shadow-kun')
    div(class='loading-text text-head') {{currMsg}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Loading extends Vue {
  public msgs: string[]
  public currMsg: string = 'Генерация сущностей...'
  public interval: any = null
  constructor() {
    super()
    this.msgs = [
      'Генерация лишних сущностей...',
      'Модерация проводит карательные акции. Пожалуйста, подождите',
      'Чай сам себя не заварит. Помни это.',
      'Кто не работает, тот ест',
      'Девушек не существует, Нео',
      'Читать книги полезно. Иногда',
      'Соскучился по мне?',
      'Бассейн закрыт, в нем СИНДРОМ ВАХТЕРА',
      'Ничто не спасет от банхаммера',
      'Лучше быть пьяным, чем грустным',
      'А ты ставишь точки в конце предложений?',
      'Ты узнаешь меня из тысячи.. Правда ведь?',
      'Снова ты. Заходи',
      'Все будет заебись',
      'Сайт закрыт, админ слишком пьян. Шутка. Но админ все равно пьян',
      'За решеткой есть жизнь, и на кладбище есть плюсы',
      'Все люди братья, но некоторые та-акие тупые',
      'Счастливое коммьюнити, мы живем в счастливом коммьюнити',
      'У нас есть один выход - в окно',
      'А ты точно филолог?',
      'Мы скучали по тебе',
      'Сегодня день поебды',
      'Большому Брату плевать на тебя',
      'Жил без страха и умер без денег',
      'Опять не пошел в школу? Ну и правильно',
      'Факт дня: ты умничка',
      'Безграмотность рождает возмездие!',
      'А вы знали, что модераторы тоже люди?',
      'Запятые богу запятых!',
      'Я ужас летящий на крыльях ночи! Шучу, я просто синий шарик',
      'Время спать и просыпаться, время рождаться и время умирать',
      'Зло здесь за каждым углом. Смотри под ноги, не вляпайся в него!',
      'Необязательно быть хорошим стрелком. Достаточно просто много стрелять',
      'Я существую только в твоей голове',
      'Жизнь за Нер-Зула!',
      'Какой богатый внутренний мир. Ну-ка дай глянуть',
      'Утром заходили админы, жаловались на юзеров. Но ты не беспокойся, их трупы я убрал в мусоросжигатель',
      'Юзеры покидают нас, милорд',
      'Синего шара не существует',
      'Мы следим за тобой, ничтожество,',
      'я не Ио, я его младший брат',
    ]
    this.start()
  }

  public start = (): void => {
    const rand = Math.floor(Math.random() * this.msgs.length)
    console.log('RAND', rand)
    this.currMsg = this.msgs[rand]
    console.log('MSG', this.currMsg)
  }
}
</script>

<style scoped lang='sass'>

.shadow-kun
    box-shadow: inset 0px 0px 15px 5px #A50021
    //box-shadow: 0px 0px 100px 25px #5cc4de
    background: rgba(0, 0, 0, 0.5)
    position: absolute
    top: 51.5%
    left: 48%
    height: 100px
    width: 100px
    border-radius: 100px
    transform: skew(0deg) scale(1, 0.2)
    animation: shadow-kun-animate 1.1s infinite

@keyframes shadow-kun-animate
    0%
        top: 46.5%
        left: 48%
        transform: skew(0deg) scale(0.8, 0.08)
    50%
        top: 51.5%
        left: 48%
        transform: skew(0deg) scale(1, 0.3)
    100%
        top: 46.5%
        left: 48%
        transform: skew(0deg) scale(0.8, 0.08)

.loading-text
    text-shadow: 5px 4px 2px #000000
    width: 100%
    font-size: 30px
    position: absolute
    text-align: center
    top: 70%
    opacity: 1
    animation: loading-text-appear .5s ease-out

@keyframes loading-text-appear
    0%
        top: 67%
        opacity: 0
    100%
        top: 70%
        opacity: 1

.loading-screen
    position: absolute
    z-index: 9000
    width: 100%
    height: 100%
    background: -webkit-linear-gradient(290deg, #030303 35%, #A50021 35.2%, #A50021 45%, #A50021 79.8%, #030303 80%, #030303 100%, #1f1f1f 360%)

.circle-chan
    box-shadow: inset 0px 0px 3px 1px  #A50021
    z-index: 100
    position: absolute
    top: 35%
    left: 48%
    height: 100px
    width: 100px
    border-radius: 100px
    background: #6dd5ed
    animation: circle-chan-anim 1.1s infinite
    //border: 2px solid rgba(0, 0, 0, 0.05)
    transform: rotate(0deg) scale(10, 10)

@keyframes circle-chan-anim
    0%
        transform: rotate(7deg) scale(0.75, 0.75)
        top: 35%
    50%
        transform: rotate(0deg) scale(1.35, 1)
        top: 45%
    75%
        transform: rotate(-7deg) scale(0.9, 0.9)
    100%
        transform: rotate(7deg) scale(0.8, 0.8)
        top: 35%

.circle-eye
    position: absolute
    top: 30%
    height: 10px
    width: 10px
    border-radius: 50px
    animation: circle-chan-eyes-anim 1.1s infinite
    //border: 2px solid rgba(55, 55, 55, 0.8)
    background: #A50021
    left: 10%
    &:first-of-type
        left: 66%

@keyframes circle-chan-eyes-anim
    0%
        top: 30%
        height: 11px
        width: 11px
    50%
        top: 38%
        height: 20px
        width: 21px
    100%
        top: 30%
        height: 11px
        width: 11px

.circle-mouth
    position: absolute
    top: 66%
    left: 40%
    height: 10px
    width: 10px
    border-radius: 10px
    background: #A50021
    //border: 2px solid rgba(55, 55, 55, 0.8)
    transform: skew(0deg) scale(1, 1.5)
    animation: circle-mouth-anim 1.1s infinite

@keyframes circle-mouth-anim
    0%
        height: 15px
        width: 15px
        //transform: skew(0deg) scale(2.3, 2.5)
    50%
        height: 10px
        width: 10px
        //transform: skew(0deg) scale(1, 0.6)
    100%
        height: 15px
        width: 15px
        //transform: skew(0deg) scale(2.3, 2.5)

</style>
