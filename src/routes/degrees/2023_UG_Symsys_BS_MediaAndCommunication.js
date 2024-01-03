let degree = {
  "degree": "B.S. SymSys (Media & Comm)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_MediaAndCommunication",
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

    "Introduction": ["COMM 1"],
    "Statistical and Data Analysis Methods": ["ANTHRO 116", "COMM 173E", "CS 229", "MS&E 125", "MS&E 226", "PSYCH 253", "SOC 180B", "STATS 60", "STATS 110", "STATS 191", "STATS 101", "STATS 200", "STATS 202"],
    "Research Methods": ["COMM 106", "CSRE 433", "CS 142", "CS 147", "CS 347", "CS 448B", "EDUC 143", "EDUC 200B", "EDUC 211", "EDUC 236", "HUMBIO 82A", "MS&E 135", "MS&E 231", "MS&E 387", "ME 341", "PHIL 60", "POLISCI 150A", "POLISCI 150C", "PSYCH 170", "PSYCH 251", "SOC 10", "SOC 180A", "SOC 194", "SOC 369", "STATS 209", "STATS 211", "STS 191W"],
    "Effects, Ethics, and Policy": ["AFRICAAM 200N", "ANTHRO 132D", "ANTHRO 134A", "BIOE 177", "COMM 1B", "COMM 108", "COMM 120W", "COMM 124", "COMM 125", "COMM 135", "COMM 145", "COMM 153B", "COMM 154", "COMM 162", "COMM 164", "COMM 166", "COMM 172", "COMM 180", "COMM 184", "COMM 186W", "COMM 230A", "COMM 322", "CS 181", "CS 182", "CS 281", "CS 209", "ENGLISH 106A", "ECON 46", "ECON 47", "INTLPOL 221", "LAW 4039", "LAW 4045", "LAW 4050", "LINGUIST 156", "MS&E 135", "MS&E 184", "MS&E 234", "NBIO 101", "PHIL 174B", "POLISCI 223A", "POLISCI 227C", "PSYC 86Q", "PSYCH 103", "SOC 31N", "SOC 124", "SOC 126", "SOC 141P", "STS 1", "SYMSYS 201"],
    "Integ concentration": ["COMM 164", "COMM 166", "COMM 172", "COMM 176", "COMM 177B", "COMM 177P", "COMM 177T", "COMM 322", "COMM 324", "COMM 326", "COMM 372G", "CS 152", "CS 181", "CS 182", "CS 206", "CS 224W", "CS 278", "LINGUIST 134A", "LINGUIST 150", "OTOHNS 206", "PSYCH 278", "SOC 154", "SYMSYS 201"],
    "Contingent Electives": ["ANTHRO 100X", "ANTHRO 166A", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 257", "EDUC 260B", "EE 374", "ENGLISH 384B", "GLOBAL 124", "HUMBIO 82B", "INTLPOL 259", "LAW 807S", "LINGUIST 1", "LINGUIST 54N", "LINGUIST 127", "LINGUIST 154", "LINGUIST 234", "LINGUIST 258", "LINGUIST 285", "LINGUIST 278", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 80", "PSYCH 144", "PSYCH 155", "PSYCH 220A", "PSYCH 241", "PSYCH 265", "PUBLPOL 103F", "SOC 45Q", "STATS 202", "STATS 203", "SYMSYS 104"]
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
          "lut": "Introduction"
        },
        {
          "type": "observe",
          "lut": "Statistical and Data Analysis Methods"
        },
        {
          "type": "observe",
          "lut": "Research Methods"
        },
        {
          "type": "observe",
          "lut": "Effects, Ethics, and Policy"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Introduction", "Statistical and Data Analysis Methods", "Research Methods", "Effects, Ethics, and Policy", "Contingent Electives"]
    }
  ]
}

export default degree;