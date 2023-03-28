let sum = 0

const add = (num = 1): number => {
  sum += num
  return sum
}

const del = (num = 1): number => {
  sum -= num
  return sum
}

const change = (num: number): number => {
  sum = num
  return sum
}

const look = (): number => {
  return sum
}

const lookFormat = (arg: number[]): string[] => {
  console.log(111, arg)
  return arg.map(item => String(item))
}

export { add, del, change, look, lookFormat }
