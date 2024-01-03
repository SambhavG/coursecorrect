let degree = {
  "degree": "B.S. SymSys (Biomed)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_Biomed",
  "lookuptables": {
    "SYMSYS 1": ["SYMSYS 1"],
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21", "MATH 21A"],
    "Multivariate systems": ["MATH 51", "MATH 51A", "MATH 61[CD]M", "CME 100", "CME 100A"],
    "PHIL intro": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^PHIL'
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": '^PHIL 99$'
      },
      {
        "type": 'add',
        "method": 'regex',
        "string": '^THINK 69$'
      }
    ],
    "WIM": ["PHIL 80"],
    "Advanced PHIL": ["PHIL 107B", "PHIL 167D", "PHIL 172", "PHIL 173B", "PHIL 175", "PHIL 177K", "PHIL 180", "PHIL 180A", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 182H", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 186", "PHIL 187", "PHIL 189G", "SYMSYS 205", "SYMSYS 207"],
    "Formal logic 1": ["PHIL 150", "PHIL 151", "CS 157"],
    "Formal logic 2": ["PHIL 49", "MATH 56"],
    "Theory of comp": ["CS 103", "CS 154", "PHIL 152"],
    "Probability": ["CS 109", "STATS 116", "STATS 110", "MS&E 120", "MS&E 220", "EE 178", "CME 106", "MATH 151", "MATH 63DM"],
    "Programming I": ["CS 106A", "CS 106B", "CS 106X", "CS 107"],
    "Programming II": ["CS 106B", "CS 106X"],
    "Programming III 1": ["CS 107", "CS 107E", "CS 129", "CS 221", "CS 229", "CS 230"],
    "Programming III 2A": ["CS 147"],
    "Programming III 2B": ["CS 193[ACPXH]"],
    "Intro psych": ["PSYCH 1"],
    "Advanced psych": ["BIO 150", "LINGUIST 105", "LINGUIST 130A", "LINGUIST 130B", "LINGUIST 145", "LINGUIST 150", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 141", "PSYCH 154"],
    "Linguistic theory": ["LINGUIST 110", "LINGUIST 116A", "LINGUIST 121[AB]", "LINGUIST 130[AB]", "LINGUIST 145", "LINGUIST 160"],
    "Cross area": ["PHIL 152", "PHIL 154", "PHIL 162", "PHIL 181", "CS 181", "CS 182", "PHIL 167D", "PHIL 186", "CS 151", "CS 154", "CS 161", "CS 229", "CS 238", "LINGUIST 130A", "LINGUIST 180", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 242", "PSYCH 249", "PSYCH 253", "CS 229", "ECON 178", "CS 147", "CS 448B", "PSYCH 164", "PSYCH 240A"],
    "Small seminar": ["BIO 151", "COMM 322", "COMM 324", "CS 206", "CS 325B", "LINGUIST 230C", "MUSIC 220C", "MUSIC 351A", "PHIL 194Y", "PHIL 359", "PSYCH 169", "PSYCH 232", "PSYCH 247", "PSYCH 254", "SYMSYS 202", "SYMSYS 203", "SYMSYS 205", "SYMSYS 207", "SYMSYS 245"],
    "Practicum": ["SYMSYS 190", "SYMSYS 195[A-Z]", "CS 177", "SYMSYS 196", "SYMSYS 192", "SYMMSYS 197", "PSYCH 182", "CS 198"],
    "Integ standard": ["SYMSYS 190", "SYMSYS 195[A-Z]", "CS 177", "SYMSYS 196"],

    "Phil/Eth inquiry": ["BIOE 131", "BIOE 177", "HUMBIO 171E", "HUMBIO 178A", "HUMBIO 174", "NBIO 101", "PHIL 85", "PHIL 134A", "PHIL 167D", "PHIL 168M", "PHIL 178M", "PHIL 360", "PHIL 368A", "SYMSYS 202", "SYMSYS 205"],
    "Theory and math": ["BIO 183", "BIO 223", "BIO 251", "BIODS 215", "BIOMEDIN 219", "ECON 136", "EE 102A", "GEOPHYS 128", "HUMBIO 88", "HUMBIO 89", "HUMBIO 154B", "MS&E 292", "STATS 141", "STATS 215"],
    "Comp/Design methods": ["BIODS 220", "BIOE 273", "BIOE 313", "BIOE 375", "BIOMEDIN 210", "BIOMEDIN 260", "BIOMEDIN 273B", "BIOMEDIN 279", "CS 247B", "CS 247S", "CS 273A", "CS 372", "CS 379C", "CS 448B", "GENE 211", "HUMBIO 51", "HUMBIO 151R", "OTOHNS 206", "PSYC 223B", "PSYCH 204B", "STATS 155", "STATS 220", "SYMSYS 245"],
    "Science": ["BIO 81", "BIO 82", "BIO 84", "BIO 150", "BIO 151", "BIO 204", "BIODS 215", "HUMBIO 4B", "HUMBIO 51", "HUMBIO 151R", "HUMBIO 154B", "MS&E 292", "NBIO 206", "PSYC 124", "PSYCH 30", "PSYCH 45", "PSYCH 50", "PSYCH 60", "PSYCH 121", "PSYCH 162", "PSYCH 168", "PSYCH 169", "PSYCH 202", "PSYCH 204A", "PSYCH 232", "PSYCH 254"],
    "Integ concentration": ["BIOMEDIN 210", "BIOMEDIN 220", "BIOMEDIN 260", "BIOMEDIN 273A", "BIOMEDIN 273B", "BIOMEDIN 279", "COMM 326", "COMM 372G", "CS 325B", "CS 372", "CS 379C", "HUMBIO 146", "OTOHNS 206", "PHIL 167D", "PHIL 168M", "PHIL 178M", "PHIL 360", "PHIL 368A", "PSYC 223B", "PSYCH 121", "PSYCH 162", "PSYCH 169", "PSYCH 202", "PSYCH 204A", "PSYCH 204B", "PSYCH 232", "PSYCH 254", "PSYCH 273", "STATS 220", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 83", "BIO 103", "BIOE 177", "COMM 153B", "CS 152", "CS 257", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "LAW 807S", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 118F", "PSYCH 144", "PSYCH 220A", "PSYCH 278", "PUBLPOL 103F", "SOC 45Q", "SYMSYS 104", "SYMSYS 176S", "OSPGEN 47"]
  },
  "requirements": [
    {
      "lut": "SYMSYS 1",
    },
    {
      "type": "and",
      "name": "Math, Multi",
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
          "lut": "Multivariate systems",
        },
      ]
    },
    {
      "type": "and",
      "name": "Philosophy",
      "bundle": true,
      "content": [
        {
          "lut": "PHIL intro",
        },
        {
          "lut": "WIM",
        },
        {
          "lut": "Advanced PHIL",
        }
      ]
    },
    {
      "type": "and",
      "name": "Formal",
      "bundle": true,
      "content": [
        {
          "type": "or",
          "content": [
            {
              "lut": "Formal logic 1",
            },
            {
              "lut": "Formal logic 2",
              "amount": 2
            }
          ]
        },
        {
          "lut": "Theory of comp",
        },
        {
          "lut": "Probability",
        },
      ]
    },
    {
      "type": "and",
      "name": "Comp",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Programming I"
        },
        {
          "lut": "Programming II",
        },
        {
          "type": "or",
          "content": [
            {
              "lut": "Programming III 1",
            },
            {
              "type": "and",
              "bundle": true,
              "content": [
                {
                  "lut": "Programming III 2A",
                },
                {
                  "lut": "Programming III 2B",
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "type": "and",
      "name": "Cog Sci",
      "bundle": true,
      "content": [
        {
          "lut": "Intro psych",
        },
        {
          "lut": "Advanced psych",
        },
        {
          "lut": "Linguistic theory",
        }
      ]
    },
    {
      "type": "and",
      "name": "Cross/Sem/ Practicum",
      "bundle": true,
      "content": [
        {
          "lut": "Cross area",
        },
        {
          "lut": "Small seminar",
        },
        {
          "lut": "Practicum",
        }
      ]
    },
    {
      "name": "Integrative",
      "lutList": ["Integ standard", "Integ concentration"],
    },
    //Concentration checkboxes
    {
      "name": "Conc Core",
      "type": "and",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Phil/Eth inquiry"
        },
        {
          "type": "observe",
          "lut": "Theory and math"
        },
        {
          "type": "observe",
          "lut": "Comp/Design methods"
        },
        {
          "type": "observe",
          "lut": "Science"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Phil/Eth inquiry", "Theory and math", "Comp/Design methods", "Science", "Contingent Electives"]
    }
  ]
}

export default degree;