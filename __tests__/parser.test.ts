import Parser from '../src/parser'
import { CodingUtils } from '@tacoinfra/tezos-core'
import { OperationType } from '../src/operation'

/**
 * Operations and expected parse values.
 *
 * Taken from: https://gitlab.com/polychainlabs/tezos-hsm-signer/-/blob/master/signer/test_data.go
 */
const testOperations = [
  // TODO(keefertaylor): See https://github.com/tacoinfra/tezos-kms-remote-signer/issues/5
  // Generic operations
  // {
  //   hex:
  //     '03715f7cfa2f197261de8f30277ac78011f01132a4ba703e503642a9345d7653266c0154f5d8f71ce18f9f05bb885a4120e64c667bc1b4830aec8617c35000c0843d000154f5d8f71ce18f9f05bb885a4120e64c667bc1b400',
  //   operationType: OperationType.Generic,
  //   chainId: 'NetXeSG6ShTTieu',
  //   blockLevel: undefined,
  // },
  {
    hex:
      '0307456de90f901440e17e76d95a79b74827cc5663ca36994d8603992bea6d66376c0002d0ea30de52fb4806d075ab8d312d19be7d0c23e9fb09be8e35d84f00c0843d0002d0ea30de52fb4806d075ab8d312d19be7d0c23e900',
    operationType: OperationType.Generic,
    chainId: 'NetXJDZUe2asiD2',
    blockLevel: undefined,
  },

  // Endorsement operations
  {
    hex:
      '027a06a770e6cebe5b3e39483a13ac35f998d650e8b864696e31520922c7242b88c8d2ac55000003eb6d',
    operationType: OperationType.Endorsement,
    chainId: 'NetXdQprcVkpaWU',
    blockLevel: 256877n,
  },
  {
    hex:
      '027a06a7706ed859dc7394d7216ed6ab088b51089d0dba1707e8544b5c898ef084df727aa4000003f762',
    operationType: OperationType.Endorsement,
    chainId: 'NetXdQprcVkpaWU',
    blockLevel: 259938n,
  },
  {
    hex:
      '027a06a7705aa1570d2cd7d36982adcc4d58c08601f32654131017e19b6b36fdbfd1cbc9da000003f763',
    operationType: OperationType.Endorsement,
    chainId: 'NetXdQprcVkpaWU',
    blockLevel: 259939n,
  },

  // Block Operations
  {
    hex:
      '018eceda2f00023df201a43530a7ac35eb2b0000c51c29e21b943355242b73d76cfee53dd80908e3e843000000005c562260047d63043ed1c565061d83ef6ce2fed35410549d87350808ee050c25c1a2dc7795000000110000000100000000080000000000435a1af44a000a5e6a5297b6531706fed4438e7e1c134a9e70d239f4c17c3d81411258000000000003dcf012f600',
    operationType: OperationType.Block,
    chainId: 'NetXgtSLGNJvNye',
    blockLevel: 146930n,
  },
]

test('parse', function () {
  // FOR each operation in the test data
  for (let i = 0; i < testOperations.length; i++) {
    const testOperationData = testOperations[i]

    // WHEN it is parsed
    const bytes = CodingUtils.hexToBytes(testOperationData.hex)
    const operation = Parser.parse(bytes)

    // THEN it parses to the expected values.
    expect(operation.operationType).toStrictEqual(
      testOperationData.operationType,
    )
    expect(operation.blockLevel).toEqual(testOperationData.blockLevel)
    expect(operation.chainId).toStrictEqual(testOperationData.chainId)
  }
})
