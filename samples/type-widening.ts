enum Tastes {
  Bitterness,
  Sweetness,
  Sourness,
  Saltiness,
  Umami,
}

const umami = Tastes.Umami // umami: Tastes.Umami
let taste = umami // taste: Tastes


const http = 'http' // http: 'http'
let protocol = http // protocol: string
if (protocol === 'ftp') { // it's fine, since 'ftp' is a string

}

const https: 'https' = 'https' // https: 'https'
let protocol2 = https // protocol2: 'https'
if (protocol2 === 'ftp') { // [ts] This condition will always return 'false' since the types '"https"' and '"ftp"' have no overlap.

}