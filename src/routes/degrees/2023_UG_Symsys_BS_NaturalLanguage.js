let degree = {
  "degree": "B.S. SymSys (Natural Language)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_NaturalLanguage",
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

    "Mathematical/Computational Foundations": ["CS 154", "CS 221", "CS 229", "PHIL 154", "PSYCH 204", "PSYCH 209", "PSYCH 251"],
    "Computational Linguistics": ["CS 124", "CS 224N", "CS 224S", "CS 224U", "CS 276", "PSYCH 290"],
    "Phonetics/Phonology/Speech": ["LINGUIST 105", "LINGUIST 107", "LINGUIST 110", "LINGUIST 112", "LINGUIST 157", "LINGUIST 205B", "LINGUIST 207A", "LINGUIST 210A", "LINGUIST 213", "LINGUIST 260A"],
    "Morphosyntax": ["LINGUIST 121A", "LINGUIST 121B", "LINGUIST 217", "LINGUIST 222A", "LINGUIST 225D", "LINGUIST 260B"],
    "Semantics/Pragmatics/Philosophy of Language": ["LINGUIST 130A", "LINGUIST 130B", "LINGUIST 134A", "LINGUIST 230B", "LINGUIST 230C", "LINGUIST 232A", "LINGUIST 236", "LINGUIST 272B", "PHIL 137", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 194D", "PHIL 194K", "LINGUIST 230P", "PHIL 348", "PHIL 385D"],
    "Psycholinguistics": ["LINGUIST 140", "LINGUIST 245B", "LINGUIST 246", "LINGUIST 248", "PSYCH 131", "PSYCH 132", "PSYCH 140", "PSYCH 209"],
    "Sociolinguistics and Language Change": ["LINGUIST 47N", "LINGUIST 65", "LINGUIST 116A", "LINGUIST 134A", "LINGUIST 150", "LINGUIST 150E", "LINGUIST 152", "LINGUIST 154", "LINGUIST 155F", "LINGUIST 156", "LINGUIST 157", "LINGUIST 160", "LINGUIST 167", "LINGUIST 168", "LINGUIST 250", "LINGUIST 255K"],
    "Integ concentration": ["COMM 324", "CS 221", "CS 276", "CS 384", "LINGUIST 180", "PHIL 137", "PHIL 181", "PHIL 182", "PHIL 182A", "PHIL 194D", "PHIL 194K", "PHIL 348", "PHIL 356C", "PHIL 357", "PHIL 359", "PHIL 385D", "PSYC 126", "PSYCH 204", "PSYCH 209", "PSYCH 247", "PSYCH 278", "SYMSYS 205", "SYMSYS 207"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "CS 152", "CS 205L", "CS 257", "EE 374", "ENGLISH 384B", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "INTLPOL 259", "LAW 807S", "MUSIC 451A", "OTOHNS 206", "PSYC 60N", "PSYC 135", "PSYCH 10", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 220A", "PUBLPOL 103F", "SOC 45Q", "STATS 191", "STATS 200", "SYMSYS 104"]
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
      "type": "observe",
      "name": "Conc Core",
      "amount": 4,
      "lutList": ["Mathematical/Computational Foundations", "Computational Linguistics", "Phonetics/Phonology/Speech", "Morphosyntax", "Semantics/Pragmatics/Philosophy of Language", "Psycholinguistics", "Sociolinguistics and Language Change"]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Mathematical/Computational Foundations", "Computational Linguistics", "Phonetics/Phonology/Speech", "Morphosyntax", "Semantics/Pragmatics/Philosophy of Language", "Psycholinguistics", "Sociolinguistics and Language Change", "Contingent Electives"]
    }
  ]
}

export default degree;