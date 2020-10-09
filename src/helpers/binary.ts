export function intToBin(value: number): string {
  return Number(value).toString(2)
}

export function getBinValue(value: number, bits: number): string {
  return intToBin(value).padStart(bits, '0')
}
