export default interface IStore<T> {
  isFetching: boolean
  isFetched: boolean
  response: T
}
