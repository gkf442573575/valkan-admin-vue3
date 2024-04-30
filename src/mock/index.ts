export interface MockResData<T> {
  state: number
  message: string
  data: T
}

export const successRes = <T>(data: T): MockResData<T> => {
  return {
    state: 1,
    message: 'success',
    data
  }
}

export const failRes = (): MockResData<null> => {
  return {
    state: 0,
    message: 'fail',
    data: null
  }
}
