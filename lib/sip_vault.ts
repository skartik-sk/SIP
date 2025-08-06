/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/sip_vault.json`.
 */
export type SipVault = {
  "address": "JAXfUBqk3rTzyFPq1NPBv3S4HUCUfcsuo1oT5GzGXMgt",
  "metadata": {
    "name": "sipVault",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "disburseRewards",
      "docs": [
        "2) Disburse the SOL in the vault to the top-3 winners (50/30/20)"
      ],
      "discriminator": [
        171,
        229,
        60,
        0,
        227,
        3,
        4,
        158
      ],
      "accounts": [
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "creator"
              },
              {
                "kind": "arg",
                "path": "campaignId"
              }
            ]
          }
        },
        {
          "name": "winner1",
          "writable": true
        },
        {
          "name": "winner2",
          "writable": true
        },
        {
          "name": "winner3",
          "writable": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "creater",
          "type": "pubkey"
        },
        {
          "name": "campaignid",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "creater",
          "writable": true,
          "signer": true
        },
        {
          "name": "vault",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "account",
                "path": "creater"
              },
              {
                "kind": "arg",
                "path": "campaignid"
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "campaignid",
          "type": "u64"
        },
        {
          "name": "deadline",
          "type": "u64"
        },
        {
          "name": "authority",
          "type": "pubkey"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "vault",
      "discriminator": [
        211,
        8,
        232,
        43,
        2,
        152,
        117,
        119
      ]
    }
  ],
  "events": [
    {
      "name": "depositEvent",
      "discriminator": [
        120,
        248,
        61,
        83,
        31,
        142,
        107,
        144
      ]
    },
    {
      "name": "initializeVaultEvent",
      "discriminator": [
        179,
        75,
        50,
        161,
        191,
        28,
        245,
        107
      ]
    },
    {
      "name": "toggleLockEvent",
      "discriminator": [
        194,
        162,
        188,
        255,
        218,
        105,
        100,
        249
      ]
    },
    {
      "name": "withdrawEvent",
      "discriminator": [
        22,
        9,
        133,
        26,
        160,
        44,
        71,
        192
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "vaultLocked",
      "msg": "Vault is locked"
    },
    {
      "code": 6001,
      "name": "overflow",
      "msg": "overflow"
    },
    {
      "code": 6002,
      "name": "insufficientBalance",
      "msg": "Insufficient balance"
    }
  ],
  "types": [
    {
      "name": "depositEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "u64"
          },
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "vault",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "initializeVaultEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "vaultAuthority",
            "type": "pubkey"
          },
          {
            "name": "locked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "toggleLockEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "vault",
            "type": "pubkey"
          },
          {
            "name": "vaultAuthority",
            "type": "pubkey"
          },
          {
            "name": "locked",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "vault",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "string"
          },
          {
            "name": "isDispersed",
            "type": "bool"
          },
          {
            "name": "deadline",
            "type": "u64"
          },
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    },
    {
      "name": "withdrawEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "campaignId",
            "type": "string"
          },
          {
            "name": "w1",
            "type": "u64"
          },
          {
            "name": "w2",
            "type": "u64"
          },
          {
            "name": "w3",
            "type": "u64"
          },
          {
            "name": "vault",
            "type": "pubkey"
          }
        ]
      }
    }
  ]
};
