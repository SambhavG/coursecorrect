let degree = {
  "degree": "B.S. SymSys (Human-Centered AI)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_HumanCenteredAI",
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

    "Digital Technology Ethics and Policy": ["CS 181", "CS 182", "CS 281"],
    "Human Impact": ["AFRICAAM 200N", "ANTHRO 132D", "ANTHRO 134A", "BIOE 177", "COMM 120W", "COMM 124", "COMM 145", "COMM 154", "COMM 172", "COMM 184", "COMM 322", "COMPLIT 244", "CS 139", "CS 209", "CS 323", "CS 384", "DESIGN 283Q", "ENGLISH 106A", "GLOBAL 124", "INTLPOL 221", "LAW 4039", "LAW 4045", "LAW 4050", "MS&E 184", "MS&E 193", "MS&E 234", "NBIO 101", "OSPOXFRD 29", "PHIL 174B", "POLISCI 115", "PSYC 63Q", "PUBLPOL 134", "SOC 124", "STS 1", "SYMSYS 104", "SYMSYS 201"],
    "Augmenting Human Capabilities": ["BIOE 273", "BIOMEDIN 220", "COMM 166", "COMM 177B", "COMM 280", "COMM 326", "CEE 329", "CS 147", "CS 152", "CS 184", "CS 247A", "CS 247B", "CS 247I", "CS 247S", "CS 278", "CS 325B", "CS 335", "CS 372", "CS 448B", "CS 470", "ECON 136", "EDUC 211", "EDUC 236", "EDUC 266", "EDUC 281", "EDUC 302", "ENGLISH 108A", "ENGLISH 384B", "GSBGEN 596", "HUMBIO 135S", "HUMBIO 151R", "MUSIC 220C", "MUSIC 257", "LAW 808J", "OTOHNS 206", "PSYC 60N", "PSYC 124", "PSYC 135", "PSYC 223B", "PSYC 240", "PSYCH 12N", "PSYCH 24N", "PSYCH 273", "PSYCH 290", "SOC 167VP", "SYMSYS 245"],
    "Intelligence": ["CS 124", "CS 129", "CS 131", "CS 221", "CS 223A", "CS 224N", "CS 229", "CS 230", "CS 231N", "LINGUIST 188", "LINGUIST 285"],
    "Integ concentration": ["COMM 166", "COMM 172", "CS 184", "CS 206", "CS 221", "CS 223A", "CS 229", "CS 230", "CS 238", "CS 247I", "CS 278", "CS 281", "CS 325B", "CS 335", "CS 372", "CS 379C", "CS 384", "EDUC 234", "EDUC 266", "EDUC 281", "EDUC 342", "LINGUIST 180", "LINGUIST 285", "OTOHNS 206", "PHIL 167D", "PHIL 168M", "PHIL 359", "PHIL 360", "PHIL 368A", "PHIL 385B", "PHIL 386", "PSYC 124", "PSYC 223B", "PSYC 240", "PSYCH 121", "PSYCH 145", "PSYCH 154", "PSYCH 164", "PSYCH 162", "PSYCH 169", "PSYCH 202", "PSYCH 204", "PSYCH 209", "PSYCH 220A", "PSYCH 232", "PSYCH 242", "PSYCH 247", "PSYCH 249", "PSYCH 254", "PSYCH 273", "PSYCH 278", "PSYCH 293", "STATS 216", "STATS 220", "STATS 315B", "SYMSYS 202", "SYMSYS 205", "SYMSYS 245"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "COMM 153B", "COMM 230A", "CS 110", "CS 193A", "CS 257", "EE 374", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "ESS 224", "HUMBIO 171E", "INTLPOL 259", "INTLPOL 268", "LAW 807S", "PHIL 20N", "PHIL 134A", "PSYCH 24N", "PSYCH 144", "PSYCH 265", "PUBLPOL 103F", "SOC 45Q", "STATS 191", "STATS 200", "SYMSYS 176S", "OSPGEN 47"]
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
          "lut": "Digital Technology Ethics and Policy"
        },
        {
          "type": "observe",
          "lut": "Human Impact"
        },
        {
          "type": "observe",
          "lut": "Augmenting Human Capabilities"
        },
        {
          "type": "observe",
          "lut": "Intelligence"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Digital Technology Ethics and Policy", "Human Impact", "Augmenting Human Capabilities", "Intelligence", "Contingent Electives"]
    }
  ]
}

export default degree;