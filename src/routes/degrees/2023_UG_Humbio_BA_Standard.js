let degree = {
  "degree": "B.A. Humbio",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Humbio_BA_Standard",
  "infoText": "No lookup tables for breadth/depth; bump courses as needed",
  "lookuptables": {
    "Core": ["HUMBIO [234][AB]"],
    "Stats": ["BIO 141", "CME 106", "CS 109", "ECON 102A", "EDUC 400A", "EPI 259", "EPI 262", "HUMBIO 88", "HUMBIO 89", "MATH 151", "SOC 180B", "STATS 101", "STATS 110", "STATS 116"],
    "Upper Division": [
      {
        type: 'add',
        method: 'regex',
        string: '^HUMBIO'
      },
      {
        type: 'remove',
        method: 'number',
        comparator: '<',
        number: 100
      },
      {
        type: 'remove',
        method: 'number',
        comparator: '>',
        number: 189
      },
      {
        type: 'add',
        method: 'regex',
        string: '^(OSPCPTWN 43|OSPCPTWN 49|OSPCPTWN 67|OSPHONGK 44|OPSMADRD 10|OSPMADRD 57|OSPMADRD 72|OSPOXFRD 67|OSPPARIS 18|OSPPARIS 76|OSPSANTG 25|OSPSANTG 57|OSPSANTG 58|OSPAUSTL 10|OSPAUSTL 28|OSPAUSTL 32)$'
      }
    ],
    "WIM": ["HUMBIO [234][AB]"],
    "Capstone practicum": ["HUMBIO 191"],
    "Capstone thesis": ["HUMBIO 192[AWS]"],
    "Breadth": [".*"],
    "Depth": [".*"],
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 6
    },
    {
      "name": "Stats, upper div",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "lut": "Stats",
          "amount": 3
        },
        {
          "lut": "Upper Division",
          "amount": 2
        }
      ]
    },
    {
      "name": "Capstone",
      "type": "or",
      "content": [
        {
          "lut": "Capstone practicum"
        },
        {
          "lut": "Capstone thesis",
          "amount": 2,
          "minUnits": 6
        }
      ]
    },
    {
      "type": "observe",
      "lut": "WIM",
      "amount": 3
    },
    {
      "lut": "Breadth",
      "minUnits": 20
    },
    {
      "lut": "Depth",
      "minUnits": 20
    }
  ]
}

export default degree;