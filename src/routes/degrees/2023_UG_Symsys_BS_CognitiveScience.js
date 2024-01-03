let degree = {
  "degree": "B.S. SymSys (Cog Sci)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_CognitiveScience",
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

    "Cognitive Neuroscience": ["PSYCH 30", "PSYCH 45", "PSYCH 50"],
    "Inferential Statistics": ["ANTHRO 116", "MS&E 125", "MS&E 226", "PSYCH 10", "PSYCH 253", "SOC 180B", "STATS 110", "STATS 191", "STATS 101", "STATS 200", "STATS 202"],
    "Research Methods": ["CS 107", "CS 107E", "CS 129", "CS 229", "LINGUIST 180", "LINGUIST 188", "LINGUIST 245B", "PHIL 167D", "PSYCH 164", "PSYCH 170", "PSYCH 187", "PSYCH 204", "PSYCH 209", "PSYCH 221", "PSYCH 240A", "PSYCH 242", "PSYCH 249", "PSYCH 251", "PSYCH 253", "PSYCH 262", "STATS 220"],
    "Cog Sci Depth": ["CS 224N", "LINGUIST 110", "LINGUIST 140", "LINGUIST 180", "LINGUIST 188", "LINGUIST 236", "LINGUIST 248", "PHIL 181", "PHIL 194D", "PHIL 385D", "PSYCH 140", "CS 131", "CS 205A", "CS 231A", "LINGUIST 105", "MUSIC 251", "OTOHNS 206", "PSYCH 30", "PSYCH 221", "PSYCH 250", "PSYCH 263", "COMM 108", "COMM 322", "CS 227B", "CS 228", "CS 238", "CS 398", "EDUC 307", "EDUC 368", "PHIL 184", "PHIL 184B", "PHIL 186", "PHIL 187", "PHIL 194A", "PHIL 386", "PSYCH 45", "PSYCH 60", "PSYCH 70", "PSYCH 75", "PSYCH 118F", "PSYCH 141", "PSYCH 144", "PSYCH 147", "PSYCH 154", "PSYCH 160", "PSYCH 169", "PSYCH 175", "PSYCH 205", "PSYCH 226", "PSYCH 266", "PSYCH 278", "PSYCH 285", "PSYCH 293", "SYMSYS 203", "BIO 150", "EDUC 266", "GENE 104Q", "MED 142", "NBIO 206", "NBIO 258", "PHIL 167D", "PHIL 360", "PHIL 368A", "PSYCH 50", "PSYCH 162", "PSYCH 164", "PSYCH 168", "PSYCH 202", "PSYCH 204A", "PSYCH 204B", "PSYCH 209", "PSYCH 232", "PSYCH 249", "PSYCH 254", "PSYCH 263", "PSYCH 287", "CS 154", "CS 205A", "CS 229M", "CS 234", "CS 237A", "ECON 160", "EE 376A", "ETHICSOC 187", "HUMBIO 174A", "PHIL 82T", "PHIL 152", "PHIL 153L", "PHIL 154", "PHIL 351D", "PSYCH 204", "PSYCH 220A", "SYMSYS 207", "SYMSYS 208"],
    "Integ concentration": ["COMM 326", "COMM 372G", "CS 131", "CS 181", "CS 182", "CS 221", "CS 227B", "CS 228", "CS 229", "CS 230", "CS 231A", "CS 234", "CS 238", "CS 325B", "CS 379C", "CS 470", "EDUC 218", "EE 104", "LINGUIST 180", "MUSIC 220C", "MUSIC 257", "NBIO 101", "OTOHNS 206", "PHIL 134A", "PHIL 356C", "PHIL 357", "PHIL 359", "PHIL 360", "PHIL 368A", "PSYC 125", "PSYCH 164", "PSYCH 204", "PSYCH 209", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 293", "STATS 220", "SYMSYS 202", "SYMSYS 205", "SYMSYS 207", "SYMSYS 208"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 205L", "CS 257", "ENGLISH 384B", "EE 374", "GLOBAL 124", "HUMBIO 4B", "HUMBIO 146", "HUMBIO 171E", "LAW 807S", "LINGUIST 154", "PHIL 134A", "PHIL 171", "PSYC 60N", "PSYC 135", "PSYC 265", "PUBLPOL 103F", "SOC 45Q", "SYMSYS 104"],
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
          "lut": "Cognitive Neuroscience"
        },
        {
          "type": "observe",
          "lut": "Inferential Statistics"
        },
        {
          "type": "observe",
          "lut": "Research Methods"
        },
        {
          "type": "observe",
          "lut": "Cog Sci Depth"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Cognitive Neuroscience", "Inferential Statistics", "Research Methods", "Cog Sci Depth", "Contingent Electives"]
    }
  ]
}

export default degree;