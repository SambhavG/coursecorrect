let degree = {
  "degree": "B.A. Psychology",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Psychology_BA_Standard",
  "lookuptables": {
    "Intro": ["PSYCH 1", "PSYCH 10"],
    "A": ["PSYCH 30", "PSYCH 35", "PSYCH 45", "PSYCH 50"],
    "B": ["PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 80, PSYCH 90", "PSYCH 95"],
    "WIM": ["PSYCH 138", "PSYCH 144", "PSYCH 164", "PSYCH 175", "PSYCH 180", "PSYCH 150"],
    "Elective": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^PSYCH'
      },
      {
        "type": 'add',
        "method": 'regex',
        "string": '^(BIO 150|PSYC 135|PSYC 139)$'
      }
    ],
  },
  "requirements": [
    {
      "type": "and",
      "name": "Units",
      "minUnits": 70,
      "content": [
        {
          "lut": "Intro",
          "amount": 2
        },
        {
          "name": "Core",
          "type": "and",
          "bundle": true,
          "content": [
            {
              "lut": "A",
              "amount": 2
            },
            {
              "lut": "B",
              "amount": 2
            },
            {
              "lutList": ["A", "B"],
              "amount": 1
            },
          ]
        },
        {
          "lut": "Elective",
        },
      ]
    },
    {
      "type": "observe",
      "lut": "WIM",
    },
  ]
}

export default degree;