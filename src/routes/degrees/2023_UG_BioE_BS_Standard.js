let degree = {
  "degree": "B.S. BioE",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_BioE_BS_Standard",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CME": ["CME 10[02]"],
    "MATH": ["MATH 5[13]"],
    "Stats": ["CME 106", "STATS 110", "STATS 141"],
    "Science": ["CHEM 31[ABMX]", "CHEM 33", "BIO 8[234]", "PHYS 4[13]"],
    "PHYS 41": ["PHYSICS 41"],
    "PHYS 43": ["PHYSICS 43"],
    "CHEM 31 AB": ["CHEM 31[AB]"],
    "CHEM 31 MX": ["CHEM 31[MX]"],
    "Other Science": ["CHEM 33", "BIO 8[234]"],
    "TIS": ["BIOE 131"],
    "Eng Fund Req": ["BIOE 80", "CS 106[ABX]"],
    "Eng Fund Elec": ["ENGR 10", "ENGR 14", "ENGR 15", "ENGR 20", "ENGR 21", "ENGR 40M", "ENGR 42", "ENGR 50", "ENGR 50E", "ENGR 50M", "ENGR 55", "ENGR 60", "ENGR 62", "ENGR 62X", "ENGR 65", "ENGR 76", "ENGR 80", "BIOE 80", "ENGR 90", "CEE 70"],
    "Core": ["BIOE 42", "BIOE 44", "BIOE 101", "BIOE 103", "BIOE 123", "BIOE 141A", "BIOE 141B"],
    "Depth": ["BIOE 51", "BIOE 220", "BIOE 122", "BIOE 201C", "BIOE 209", "BIOE 211", "BIOE 212", "BIOE 214", "BIOE 217", "BIOE 221", "BIOE 222", "BIOE 224", "BIOE 225", "BIOE 227", "BIOE 231", "BIOE 260", "BIOE 279", "BIOE 281", "BIOE 291", "BIOE 301A", "BIOE 301B", "BIOE 301E", "BIOE 301P"],
  },
  "requirements": [
    {
      "type": "and",
      "name": "Calculus",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 3
            },
            {
              "lut": "MATH 19"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 20",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 6
            },
            {
              "lut": "MATH 20"
            }
          ]
        },
        {
          "type": "or",
          "name": "MATH 21",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Math AP",
              "cutoff": 10
            },
            {
              "lut": "MATH 21"
            }
          ]
        },
      ]
    },
    {
      "name": "Math",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "CME",
              "amount": 2
            },
            {
              "lut": "MATH",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Stats",
          "amount": 0
        },
      ]
    },
    {
      "name": "Science",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "CHEM 31 AB",
              "amount": 2
            },
            {
              "lut": "CHEM 31 MX"
            }
          ]
        },
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "PHYS 41"
            }
          ]
        },
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "E&M AP",
              "cutoff": 5
            },
            {
              "lut": "PHYS 43"
            }
          ]
        },
        {
          "lut": "Other Science",
          "amount": 3
        }
      ]
    },
    {
      "lut": "TIS",
    },
    {
      "name": "Eng Fund",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "lut": "Eng Fund Req",
          "amount": 2
        },
        {
          "lut": "Eng Fund Elec",
        }
      ]
    },
    {
      "lut": "Core",
      "amount": 7,
    },
    {
      "lut": "Depth",
      "amount": 3
    }
  ]
}

export default degree;