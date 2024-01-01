let degree = {
  "degree": "B.S. Computer Science (Comp Eng)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_CompEng",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "CS 103": ["CS 103"],
    "CS 109": ["CS 109"],
    "Math Elective": ["MATH 51", "MATH 52", "MATH 53", "MATH 104", "MATH 107", "MATH 108", "MATH 109", "MATH 110", "MATH 113", "CS 157", "CS 205L", "PHIL 151", "CME 100", "CME 102", "CME 104", "ENGR 108"],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Science Elective": ["BIO 30", "BIO 45", "BIO 46", "BIO 47", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "PSYCH 30"],
    "TIS": ["AA 252", "ANTHRO 132C", "CSRE 132C", "ARCHLGY 151", "CLASSICS 151", "BIOE 131", "BIOE 177", "DESIGN 259", "CEE 102A", "CEE 145E", "CEE 177X", "CEE 177S", "ENGR 177A", "ENGR 177B", "CLASSICS 168", "ARCHLGY 186", "COMM 120W", "COMM 166", "CS 125", "CS 152", "CS 181", "CS 181W", "CS 182", "CS 182W", "CS 256", "CS 278", "DATASCI 154", "EARTHSYS 125", "ENGR 117", "ENGR 145", "ENGR 148", "ENGR 248", "HUMBIO 174", "MS&E 193", "ME 267", "POLISCI 114S", "PUBPOL 134", "STS 1"],
    "CS 106B": ["CS 106B"],
    "ENGR 40M/76": ["ENGR 40M", "ENGR 76"],
    "CS 107": ["CS 107", "CS 107E"],
    "CS 111": ["CS 111"],
    "CS 161": ["CS 161"],
    "A": ["EE 108", "EE 180"],
    "B": ["EE 10[12][AB]"],
    "C Digital Systems": ["EE 109", "EE 271", "CS 112", "CS 140E"],
    "C Robotics and Mechatronics": ["CS 205L", "CS 223A", "ME 210", "CS 225A"],
    "C Networking": ["CS 112", "CS 140E", "CS 144", "CS 240", "CS 240LX", "CS 241", "CS 244", "CS 244B", "EE 179"],
    "Senior Project": ["CS 191", "CS 191W", "CS 194", "CS 194H", "CS 194W", "CS 210B", "CS 294"],
    "WIM": ["CS 181W", "CS 182W", "CS 191W", "CS 194W", "CS 210B"]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "MATH 19",
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
      "type": "and",
      "name": "103, 109",
      "bundle": true,
      "content": [
        {
          "lut": "CS 103"
        },
        {
          "lut": "CS 109"
        }
      ]
    },
    {
      "lut": "Math Elective",
      "amount": 2
    },
    {
      "type": "and",
      "name": "Science",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "name": "Mechanics",
          "content": [
            {
              "type": "transfer",
              "id": "Physics AP",
              "cutoff": 5
            },
            {
              "lut": "Mechanics"
            }
          ]
        },
        {
          "type": "or",
          "name": "E&M",
          "content": [
            {
              "type": "transfer",
              "id": "Physics AP",
              "cutoff": 5
            },
            {
              "lut": "E&M"
            }
          ]
        },
        {
          "type": "or",
          "name": "Science Elective",
          "content": [
            {
              "type": "transfer",
              "id": "Chemistry AP",
              "cutoff": 5
            },
            {
              "lut": "Science Elective"
            }
          ]
        },
      ]
    },
    
    {
      "type": "and",
      "name": "106B/07/11/61",
      "bundle": true,
      "content": [
        {
          "lut": "CS 106B"
        },
        {
          "lut": "CS 107"
        },
        {
          "lut": "CS 111"
        },
        {
          "lut": "CS 161"
        }
      ]
    },
    {
      "name": "40M/76",
      "lut": "ENGR 40M/76"
    },
    {
      "type": "and",
      "name": "Depth",
      "content": [
        {
          "type": "and",
          "name": "A, B",
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
          ]
        },
        {
          "type": "or",
          "name": "C",
          "amount": 3,
          "content": [
            {
              "lut": "C Digital Systems",
              "amount": 3
            },
            {
              "lut": "C Robotics and Mechatronics",
              "amount": 3
            },
            {
              "lut": "C Networking",
              "amount": 3
            },
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "TIS/WIM/Proj",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "TIS"
        },
        {
          "type": "observe",
          "lut": "WIM"
        },
        {
          "lut": "Senior Project"
        }
      ]
    }
  ]
}

export default degree;