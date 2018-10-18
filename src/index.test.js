import {
  isEmailAddress,
  assertEmailAddress,
  isUsername,
  assertUsername,
  isRealName,
  assertRealName,
  hasAcceptedLegalAgreements,
  assertHasAcceptedLegalAgreements,
  stringsMatchIgnoreCase,
  addressesMatch
} from './'

describe('email address', () => {
  it('checks and assertions', () => {
    const tests = [
      [ 1024, false ],
      [ 'str', false ],
      [ 'str@', false ],
      [ 'str@sd', false ],
      [ 'str@sd.com', true ],
      [ '你好@哦好.com', true ],
    ]

    expect.assertions(tests.length * 2)

    tests.forEach(([ input, expected ]) => {
      expect(isEmailAddress(input)).toEqual(expected)

      if (expected) {
        expect(() => assertEmailAddress(input)).not.toThrow()
      } else {
        expect(() => assertEmailAddress(input)).toThrow()
      }
    })
  })
})

describe('username', () => {
  it('checks and assertions', () => {
    const tests = [
      [ 1024, false ],
      [ 'str str', false ],
      [ 'str.23', false ],
      [ 'a-str', false ],
      [ '2234234', true ],
      [ ' 2234234  ', false ],
      [ '23adsc', true ],
      [ '23adsc_2234', true ],
      [ '_23adsc_22', true ],
      [ '99234_', true ],
      [ '你好', false ],
    ]

    expect.assertions(tests.length * 2)

    tests.forEach(([ input, expected ]) => {
      expect(isUsername(input)).toEqual(expected)

      if (expected) {
        expect(() => assertUsername(input)).not.toThrow()
      } else {
        expect(() => assertUsername(input)).toThrow()
      }
    })
  })
})

describe('real name', () => {
  it('checks and assertions', () => {
    const tests = [
      [ 1024, false ],
      [ 'str str', true ],
      [ 'str.23', false ],
      [ 'a-str', true ],
      [ '2234234', false ],
      [ ' str  ', true ],
      [ '23adsc', false ],
      [ '23adsc_2234', false ],
      [ 'asd _sdf', false ],
      [ 'sdf sdf', true ],
      [ ' sdf sdf  ', true ],
      [ '你好', true ],
    ]

    expect.assertions(tests.length * 2)

    tests.forEach(([ input, expected ]) => {
      expect(isRealName(input)).toEqual(expected)

      if (expected) {
        expect(() => assertRealName(input)).not.toThrow()
      } else {
        expect(() => assertRealName(input)).toThrow()
      }
    })
  })
})

describe('legal agreements', () => {
  it('checks and assertions', () => {
    const tests = [
      [ undefined, false ],
      [ [], false ],
      [ [ { type: 'TERMS_AND_CONDITIONS' }, { type: 'PRIVACY_POLICY' }, { type: 'MARKETING' } ], false ],
      [ [ { type: 'TERMS_AND_CONDITIONS', accepted: true } ], false ],
      [ [ { type: 'TERMS_AND_CONDITIONS', accepted: true }, { type: 'PRIVACY_POLICY' } ], false ],
      [ [ { type: 'TERMS_AND_CONDITIONS' }, { type: 'PRIVACY_POLICY' } ], false ],
      [ [ { type: 'TERMS_AND_CONDITIONS' }, { type: 'PRIVACY_POLICY', accepted: true } ], false ],
      [ [ { type: 'TERMS_AND_CONDITIONS', accepted: true }, { type: 'PRIVACY_POLICY', accepted: true } ], true ],
      [
        [
          { type: 'TERMS_AND_CONDITIONS', accepted: true },
          { type: 'PRIVACY_POLICY', accepted: true },
          { type: 'MARKETING' }
        ],
        true
      ],
    ]

    expect.assertions(tests.length * 2)

    tests.forEach(([ input, expected ]) => {
      expect(hasAcceptedLegalAgreements(input)).toEqual(expected)

      if (expected) {
        expect(() => assertHasAcceptedLegalAgreements(input)).not.toThrow()
      } else {
        expect(() => assertHasAcceptedLegalAgreements(input)).toThrow()
      }
    })
  })
})

describe('string matching', () => {
  it('ignores case', () => {
    expect(stringsMatchIgnoreCase('abc', 'ABC')).toEqual(true)
    expect(stringsMatchIgnoreCase('abc23324', 'ABC23324')).toEqual(true)
    expect(stringsMatchIgnoreCase('2332', '998')).toEqual(false)
    expect(stringsMatchIgnoreCase('你好', '你好')).toEqual(true)
    expect(stringsMatchIgnoreCase('你好', '你好吗')).toEqual(false)
  })
})

describe('address matching', () => {
  it('same as string matching', () => {
    expect(addressesMatch).toEqual(stringsMatchIgnoreCase)
  })
})