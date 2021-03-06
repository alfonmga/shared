import safeGet from 'lodash.get'
import { toBN } from 'web3-utils'
import { addressesMatch } from './address'

export const PARTICIPANT_STATUS = {
  UNKNOWN: 'UNKNOWN',
  REGISTERED: 'REGISTERED',
  SHOWED_UP: 'SHOWED_UP',
  WITHDRAWN_PAYOUT: 'WITHDRAWN_PAYOUT',
}

export const isParticipant = (participants, address) =>
  address && !!participants.find(a => addressesMatch(safeGet(a, 'user.address'), address))

export const calculateNumAttended = participants => participants.reduce((m, v) => {
  const attended =
    (v.status === PARTICIPANT_STATUS.SHOWED_UP || v.status === PARTICIPANT_STATUS.WITHDRAWN_PAYOUT)
  return m + (attended ? 1 : 0)
}, 0)

export const calculateFinalizeMaps = participants => {
  // sort participants array
  participants.sort((a, b) => (a.index < b.index ? -1 : 1))

  const maps = []
  let currentMap = toBN(0)
  for (let i = 0; participants.length > i; i += 1) {
    if (i && 0 === i % 256) {
      maps.push(currentMap)
      currentMap = toBN(0)
    }

    switch (participants[i].status) {
      case PARTICIPANT_STATUS.SHOWED_UP:
        currentMap = currentMap.bincn(i % 256)
        break
      case PARTICIPANT_STATUS.REGISTERED:
        break
      default:
        throw new Error(`Unexpected participant status: ${participants[i].status}`)
    }
  }
  maps.push(currentMap)

  return maps.map(m => m.toString(10))
}

export const updateParticipantListFromMaps = (participants, maps) => {
  // sort
  participants.sort((a, b) => (
    (parseInt(a.index, 10) < parseInt(b.index, 10)) ? -1 : 1
  ))

  // check maps length
  const totalBits = maps.length * 256
  const numMapsCorrect = totalBits >= participants.length && totalBits - participants.length < 256
  if (!numMapsCorrect) {
    this._log.warn(`Invalid no. of maps provided for updating participant list`)

    return
  }

  const mapBNs = maps.map(m => toBN(m))
  const zeroBN = toBN(0)
  participants.forEach((a, index) => {
    const mapIndex = parseInt(Math.floor(index / 256), 10)
    const bitIndex = index % 256

    const result = mapBNs[mapIndex].and(toBN(0).bincn(bitIndex))

    a.status = result.gt(zeroBN) ? PARTICIPANT_STATUS.SHOWED_UP : PARTICIPANT_STATUS.REGISTERED
  })
}
