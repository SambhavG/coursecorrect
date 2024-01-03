let degree = {
  "degree": "B.S. Computer Science (Graphics)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_CS_BS_Graphics",
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
    "Core": ["CS 225A", "CS 248A", "CS 248B", "CS 231N"],
    "Depth": ["CS 205L", "CS 223A", "CS 225A", "CS 231A", "CS 231N", "CS 233", "CS 248A", "CS 248B", "CS 348B", "CS 348C", "CS 348E", "CS 348K", "CS 348I", "CS 348N", "CS 448I", "EE 267"],
    "Track Elective": ["CS 123", "CS 131", "CS 148", "CS 149", "CS 221", "CS 224N", "CS 224R", "CS 229", "CS 230", "CS 234", "CS 236", "CS 236G", "CS 331B", "CS 448B", "CS 448M", "CS 448Z", "EE 261"],
    "General CS Elective": ["CS 108", "CS 112", "CS 123", "CS 124", "CS 131", "CS 140E", "CS 142", "CS 143", "CS 144", "CS 145", "CS 147", "CS 147L", "CS 148", "CS 149", "CS 151", "CS 154", "CS 155", "CS 157", "CS 163", "CS 166", "CS 168", "CS 173A", "CS 177", "CS 190", "CS 195", "CS 197", "CS 197C", "CS 205L", "CS 206", "CS 210A", "CS 212", "CS 217", "CS 221", "CS 223A", "CS 224N", "CS 224R", "CS 224S", "CS 224U", "CS 224V", "CS 224W", "CS 225A", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 230", "CS 231A", "CS 231N", "CS 232", "CS 233", "CS 234", "CS 235", "CS 237A", "CS 237B", "CS 238", "CS 240", "CS 240LX", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 245", "CS 246", "CS 247[A-Z]?", "CS 248[A-Z]?", "CS 249I", "CS 250", "CS 251", "CS 252", "CS 253", "CS 254", "CS 254B", "CS 255", "CS 256", "CS 257", "CS 259Q", "CS 261", "CS 263", "CS 265", "CS 269I", "CS 269O", "CS 269Q", "CS 270", "CS 271", "CS 272", "CS 273B", "CS 273C", "CS 274", "CS 275", "CS 276", "CS 278", "CS 279", "CS 281", "CS 330", "CS 333", "CS 336", "CS 342", "CS 348[A-Z]?", "CS 351", "CS 368", "CS 398", "CS 448B", "PHIL 151", "CME 138", "EE 180", "EE 267", "EE 282", "EE 364A", "EE 374", "MS&E 234"],
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
          "amount": 0,
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
          "amount": 0,
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
          "amount": 0,
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
      "minUnits": 25,
      "content": [
        {
          "lut": "Core",
          "amount": 2
        },
        {
          "lut": "Depth",
          "amount": 2,
        },
        {
          "type": "and",
          "name": "Elective",
          "amount": 2,
          "bundle": true,
          "content": [
            {
              "lutList": ["Depth", "Track Elective"]
            },
            {
              "lut": "General CS Elective"
            }
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