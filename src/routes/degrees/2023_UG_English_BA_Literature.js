let degree = {
  "degree": "B.A. English (Literature)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_English_BA_Literature",
  "lookuptables": {
    "Intro I": ["ENGLISH 10[ABCDEF]"],
    "Intro II": ["ENGLISH 11[ABC]"],
    "Intro III": ["ENGLISH 12[ABCD]"],
    "Methodology": ["ENGLISH 16[01]"],
    "Pre-1800": ["ENGLISH 115E", "ENGLISH 122C", "ENGLISH 104C", "ENGLISH 114B", "ENGLISH 107B", "ENGLISH 114C", "ENGLISH 115C", "ENGLISH 115G", "ENGLISH 200C", "ENGLISH 201", "ENGLISH 237", "ENGLISH 251B", "ENGLISH 180A", "ENGLISH 175", "ENGLISH 215E", "ENGLISH 140C"],
    "Literature": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^ENGLISH'
      }
    ],
    "WIM": ["ENGLISH 5[ABCDEFGHIJKLMNOPRSTUVW]", "ENGLISH 5[ABCDEFG]A"],
  },
  "requirements": [
    {
      "type": "and",
      "name": "Intro",
      "bundle": true,
      "content": [
        {
          "lut": "Intro I"
        },
        {
          "lut": "Intro II"
        },
        {
          "lut": "Intro III"
        }
      ]
    },
    {
      "lut": "Methodology",
      "amount": 2
    },
    {
      "lut": "Pre-1800"
    },
    {
      "lut": "WIM"
    },
    {
      "lut": "Literature",
      "amount": 7,
      "minUnits": 35,
      "bundleName": " "
    },
  ]
}

export default degree;