let degree = {
  "degree": "B.S. Biology (General)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Biology_BS_General",
  "lookuptables": {
    "Core": ["BIO 8[123456]"],
    "Lab": ["BIO 4[3567]"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Math": ["MATH 51", "CME 100"],
    "Mechanics": ["PHYSICS 2[12]", "PHYSICS 4[12]"],
    "E&M": ["PHYSICS 2[34]", "PHYSICS 4[34]"],
    "First chem": ["CHEM 31A", "CHEM 31B"],
    "Second chem": ["CHEM 33", "CHEM 121"],

    "Stats": ["BIO 141", "STATS 60", "CME 106", "CS 109"],

    "Electives": [
      {
        "type": "add",
        "method": "regex",
        "string": "^BIO "
      },
      {
        "type": 'remove',
        "method": 'number',
        "comparator": '<',
        "number": 100
      },
    ],

    "Out-of-department Electives": ["BIOC 241", "BIOE 241", "BIOPHYS 241", "SBIO 241", "BIOE 101", "BIOE 103", "BIOE 214", "BIOMEDIN 214", "GENE 214", "CS 274", "BIOE 217", "BIOMEDIN 217", "GENE 217", "CS 275", "BIOE 220", "RAD 220", "BIOE 231", "BIOE 279", "BIOPHYS 279", "BIOMEDIN 279", "CME 279", "CS 279", "BIOE 450", "CHEMENG 450", "BIOMEDIN 210", "CS 270", "BIOMEDIN 214", "BIOMEDIN 217", "BIOMEDIN 273A", "CS 273A", "DBIO 273A", "BIOMEDIN 273B", "BIODS 237", "CS 273B", "GENE 236", "BIOMEDIN 279", "BIOPHYS 279", "BIOE 279", "CME 279", "CS 279", "BIOPHYS 241", "BIOPHYS 279", "BIOMEDIN 221", "BIODS 237", "BIOMEDIN 273B", "CS 273B", "GENE 236", "CBIO 101", "PATH 101", "CBIO 240", "CBIO 275", "IMMUNOL 275", "CHEMENG 450", "CSB 210", "CSB 220", "CHEM 141", "CHEM 143", "CHEM 181", "CHEM 183", "CHEM 184", "CHEM 185", "CEE 162I", "CEE 177", "CEE 274D", "CS 109", "CS 270", "CS 273A", "CS 273B", "CS 274", "CS 275", "CS 279", "DBIO 201", "DBIO 210", "DBIO 273A", "EARTHSYS 114", "EARTHSYS 132", "EARTHSYS 141", "EARTHSYS 142", "EARTHSYS 144", "EARTHSYS 146B", "EARTHSYS 151", "EARTHSYS 152", "EARTHSYS 155", "EARTHSYS 158", "EARTHSYS 240", "ENERGY 240", "ESS 132", "ESS 141", "ESS 151", "ESS 152", "ESS 155", "ESS 158", "ESS 162", "ESS 164", "ESS 239", "GENE 202", "GENE 211", "GENE 214", "GENE 217", "GENE 235", "GENE 236", "GEOLSCI 132", "GEOLSCI 240", "GEOPHYS 141", "HUMBIO 113", "HUMBIO 114", "HUMBIO 135", "HUMBIO 153", "HUMBIO 154C", "IMMUNOL 201", "IMMUNOL 202", "IMMUNOL 205", "IMMUNOL 206", "IMMUNOL 209", "IMMUNOL 275", "IMMUNOL 286", "MI 115B", "MI 185", "MCP 156", "NBIO 206", "OSPAUSTL 10", "OSPAUSTL 28", "OSPAUSTL 32", "OSPSANTG 85", "PATH 101", "PHYSICS 105", "PSYCH 121", "PSYCH 202", "PSYCH 221", "RAD 220", "STATS 116", "STATS 191", "STATS 200", "SBIO 241", "STEMREM 201A", "SURG 101", "SUSTAIN 103", "MED 103", "PUBLPOL 183", "SOC 103", "SYMSYS 195I"],
    "WIM": ["BIO 46", "BIO 47", "BIO 127", "BIO 168", "BIO 196A", "BIO 199A", "BIO 199W"],
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 4,
    },
    {
      "lut": "Lab",
      "amount": 2,
    },
    {
      "type": "or",
      "name": "Math",
      "content": [
        {
          "type": "and",
          "name": "Math",
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
          "lut": "Math"
        }
      ]
    },
    {
      "type": "and",
      "name": "Physics",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "type": "transfer",
              "id": "Mechanics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics",
              "amount": 2
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
              "lut": "E&M",
              "amount": 2
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Chemistry",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Science Elective",
          "amount": 0,
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "First chem",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Second chem",
          "amount": 2
        }
      ]
    },
    {
      "lut": "Stats"
    },
    {
      "name": "Electives",
      "minUnits": 23,
      "bundleName": " ",
      "csnc": 1,
      "lutList": ["Core", "Lab", "Electives", "Out-of-department Electives"],
    },
    {
      "type": "observe",
      "lut": "WIM"
    },
  ]
}

export default degree;