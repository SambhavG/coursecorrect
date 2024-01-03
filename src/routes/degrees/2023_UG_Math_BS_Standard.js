let degree = {
  "degree": "B.S. Mathematics",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Math_BS_Standard",
  "lookuptables": {
    'Core above 63, counts towards 57 req': [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^MATH'
      },
      {
        "type": 'remove',
        "method": 'number',
        "comparator": '<=',
        "number": 63
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": '^MATH (19[389]|193X)$'
      },
      {
        "type": 'add',
        "method": 'regex',
        "string": '^(MATH 56|STATS 116|PHIL 15[12])$'
      }
    ],
    'All Math, counts towards 57 req': [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^MATH'
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": '^MATH (19[389]|193X|51M)$'
      },
      {
        "type": 'add',
        "method": 'regex',
        "string": '^(STATS 116|PHIL 15[12])$'
      }
    ],
    'Graduate Math': [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^MATH'
      },
      {
        "type": 'remove',
        "method": 'number',
        "comparator": '<',
        "number": 200
      },
    ],
    'Electives': [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^MATH'
      },
      {
        "type": 'remove',
        "method": 'number',
        "comparator": '<',
        "number": 101
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": '^MATH 19[38]$'
      },
      {
        "type": 'add',
        "method": 'regex',
        "string": '^(AA 100|AA 218|BIO 141|BIOE 101|CHEM 15[13]|CHEM 17[135]|CLASSICS 136|CS 10[39]|CS 121|CS 148|CS 154|CS 154N|CS 157|CS 16[1678]|CS 205L|CS 22[189]|CS 229A|CS 229T|CS 229M|CS 23[0345]|CS 25[01456]]|CS 259Q|CS 26[1578]|CS 269Q|CS 35[45]|CME 108|ECON 50|ECON 51|ECON 52|ECON 102A|ECON 102B|ECON 102C|ECON 103|ECON 111|ECON 136|ECON 137|ECON 140|ECON 160|ECCON 162|ECON 18[012]|ECON 20[234]|ECON 284|EE 1[45]|EE 30|EE 6[02]|EE 263|EE 274|EE 276A|EE 364[AB]|EE 376A|EE 387|ENGR 1[45]|ENGR 30|ENGR 6[02]|ESS 246A|MS&E 11[12]|MS&E 121|MS&E 211|MS&E 220|MS&E 232H|MS&E 245A|MS&E 245B|MS&E 310|MUSIC 320|MUSIC 423|MUSIC 424|PHIL 15[01249]|PHIL 162|PHIL 25[04]|PHYSICS 14N|PHYSICS 45|PHYSICS 6[35]|PHYSICS 70|PHYSICS 10[0478]|PHYSICS 11[023]|PHYSICS 12[01]|PHYSICS 13[014]|PHYSICS 16[01]|PHYSICS 17[012]|PHYSICS 21[026]|PHYSICS 22[03]|PHYSICS 23[014]|PHYSICS 24[01]|PHYSICS 252|PHYSICS 26[01269]|STATS 110|STATS 116|STATS 141|STATS 160|STATS 191|STATS 20[03567]|STATS 21[378]|STATS 229|STATS 231|STATS 240|STATS 27[01]|STATS 305A|STATS 315B|STATS 318|STATS 376A)$'
      }
    ],
    'WIM': ['^MATH (101|109|110|120|171)$']
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "minUnits": 57,
      "content": [
        {
          "name": "8 above 63",
          "amount": 8,
          "lut": "Core above 63, counts towards 57 req",
          "modifiers": ["countGradAsFour"]
        },
        {
          "type": "or",
          "name": "More units",
          "content": [
            {
              "type": "transferUnits",
              "id": "Math AP",
            },
            {
              "type": "transferUnits",
              "id": "Other math",
            },
            {
              "lut": "All Math, counts towards 57 req",
              "amount": 0,
            },
          ]
        }
      ]
    },
    {
      "lut": 'Electives',
      "amount": 4,
      "csnc": 1
    },
    {
      "type": "observe",
      "lut": "WIM"
    }
  ]
}

export default degree;