let degree = {
  "degree": "B.S. MS&E",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MS&E_BS_Standard",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Math": ["CME 100", "MATH 51", "ENGR 108", "MS&E 12[015]"],
    "Science": ["BIO 8[123456]", "CHEM 31B", "CHEM 33", "PHYS [24][13]"],
    
    "Math/Stats/Engr fund": ["CME 100", "CME 102", "ENGR 108", "CME 104", "CME 108", "CME 192", "MATH 5[123]", "MATH 6[123][CD]M", "CEE 101D", "CEE 201D", "CS 103", "ENGR 62", "ENGR 62X", "MATH 104", "MATH 106", "MATH 109", "MATH 110", "MATH 113", "MATH 115", "MATH 120", "MATH 121", "MATH 131P", "MS&E 121", "CME 106", "STATS 60", "STATS 160", "STATS 110", "STATS 116", "CS 109", "EE 178", "MATH 151", "MS&E 120", "MS&E 125", "CEE 203", "BIO 30", "BIO 81", "BIO 82", "BIO 83", "BIO 84", "BIO 85", "BIO 86", "BIO 45", "BIO 46", "BIO 47", "BIO 150", "CEE 63", "CEE 64", "CEE 70", "CHEM 31A", "CHEM 31B", "CHEM 31M", "CHEM 33", "CHEM 121", "CHEM 123", "EARTHSYS 2", "EARTHSYS 10", "EARTHSYS 11", "PHYSICS 21", "PHYSICS 22", "PHYSICS 23", "PHYSICS 24", "PHYSICS 25", "PHYSICS 26", "PHYSICS 41", "PHYSICS 41E", "PHYSICS 42", "PHYSICS 43", "PHYSICS 44", "PHYSICS 45", "PHYSICS 46", "PHYSICS 61", "PHYSICS 61L", "PHYSICS 71", "PHYSICS 71L", "PHYSICS 81", "PHYSICS 89L", "ENGR 10", "ENGR 14", "ENGR 15", "ENGR 20", "CHEME 20", "ENGR 21", "ENGR 40M", "ENGR 42", "ENGR 50", "ENGR 50E", "ENGR 50M", "ENGR 55", "ENGR 62", "MS&E 111", "ENGR 62X", "MS&E 111X", "ENGR 65", "EE 65", "ENGR 76", "ENGR 80", "BIOE 80", "ENGR 90", "CEE 70", "PSYCH 50"],
    
    "TIS": ["AA 252", "BIOE 131", "CEE 102A", "COMM 120W", "CS 152", "CS 181", "CS 182", "CS 278", "EARTHSYS 125", "ENGR 117", "ENGR 148", "MS&E 134", "MS&E 193", "POLISCI 114S", "PUBLPOL 134", "STS 1"],
    "Eng Fund": ["CS 106[AB]", "MS&E 111", "MS&E 111DS", "MS&E 111X"],
    "Eng Depth": ["CS 106B", "ECON 1", "ECON 50", "MS&E 108", "MS&E 180"],
    "F&D": ["ECON 51", "MS&E 141", "ECON 143", "MS&E 140", "MS&E 240", "MS&E 145", "MS&E 245A", "MS&E 146", "MS&E 249", "MS&E 152", "MS&E 252", "MS&E 245B", "MS&E 246", "MS&E 248", "MS&E 250A", "MS&E 250B"],
    "O&A": ["MS&E 112", "MS&E 212", "MS&E 130", "MS&E 134", "MS&E 135", "MS&E 213", "MS&E 223", "MS&E 226", "MS&E 228", "MS&E 230", "MS&E 231", "MS&E 232", "MS&E 232H", "MS&E 233", "MS&E 234", "MS&E 236", "MS&E 251", "MS&E 260", "MS&E 262", "MS&E 263", "MS&E 267", "MS&E 463", "MS&E 264"],
    "OTP": ["ENGR 145", "ENGR 145S", "ENGR 148", "ENGR 248", "MS&E 175", "MS&E 182", "MS&E 183", "MS&E 184", "MS&E 185", "MS&E 188", "MS&E 193", "MS&E 243", "MS&E 292"],
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math, Science",
      "minUnits": 36,
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
            {
              "lut": "Math",
              "amount": 5
            }
          ]
        },
        {
          "type": "and",
          "name": "Science",
          "bundle": true,
          "content": [
            {
              "lut": "Science"
            },
            {
              "lut": "Math/Stats/Engr fund"
            }
          ]
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "type": "observe",
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Eng Depth",
      "amount": 5
    },
    {
      "type": "and",
      "name": "Depth Conc",
      "bundle": true,
      "content": [
        {
          "lut": "F&D",
          "amount": 2
        },
        {
          "lut": "O&A",
          "amount": 2
        },
        {
          "lut": "OTP",
          "amount": 2
        },
        {
          "type": "or",
          "amount": 2,
          "content": [
            {
              "lut": "F&D",
              "amount": 2
            },
            {
              "lut": "O&A",
              "amount": 2
            },
            {
              "lut": "OTP",
              "amount": 2
            }
          ]
        }
      ]
    }
  ]
}

export default degree;