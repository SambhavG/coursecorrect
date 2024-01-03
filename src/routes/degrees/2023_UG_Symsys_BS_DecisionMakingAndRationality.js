let degree = {
  "degree": "B.S. SymSys (Decision Making)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_DecisionMakingAndRationality",
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
    "Philosophical Inquiry": ["HUMBIO 171E", "ME 120", "MS&E 234", "MS&E 254", "MS&E 299", "PHIL 73", "PHIL 82", "PHIL 111", "PHIL 133S", "PHIL 164", "PHIL 166", "PHIL 169", "PHIL 170", "PHIL 171", "PHIL 172", "PHIL 176A", "PHIL 184", "PHIL 184B", "PHIL 184M", "PHIL 187", "PHIL 359", "PHIL 388", "POLISCI 131L", "POLISCI 230A", "PSYCH 160", "SYMSYS 202", "SYMSYS 205", "THINK 57"],
    "Formal Decision Theories": ["ECON 51", "ECON 136", "ECON 160", "ECON 180", "ECON 182", "ECON 289", "ECON 290", "IPS 204A", "MS&E 232", "MS&E 232H", "PHIL 154", "Phil 157", "PHIL 351", "PHIL 351C", "PHIL 351D", "PHIL 359", "POLISCI 356A", "PUBLPOL 51"],
    "Empirical Findings and Explanations": ["BIO 150", "COMM 137W", "ECON 178", "ECON 179", "ECON 279", "EDUC 375A", "GSBGEN 646", "LAW 333", "POLISCI 123", "POLISCI 351B", "POLISCI 351C", "PSYCH 154", "PSYCH 160", "PSYCH 168", "PSYCH 205", "PSYCH 212", "PSYCH 215", "PSYCH 223", "PSYCH 232", "PSYCH 254", "PUBLPOL 102", "SOC 114", "SOC 115", "SOC 126", "SOC 187", "SYMSYS 203"],
    "Methods and Applications": ["BIOE 177", "BIOMEDIN 219", "BIOMEDIN 251", "CEE 146A", "CEE 206", "COMM 106", "COMM 124", "CS 29N", "CS 181", "CS 182", "CS 228", "CS 234", "CS 238", "CS 239", "CS 261", "CS 325B", "ECON 50", "ECON 102B", "ECON 102C", "ECON 135", "ECON 136", "ECON 137", "ECON 141", "ECON 150", "ECON 155", "ECON 162", "ECON 181", "ECON 182", "ECON 288", "EDUC 247", "EE 374", "ENGR 62", "ESS 224", "INTLPOL 259", "IPS 207A", "MED 275B", "MS&E 121", "MS&E 135", "MS&E 152", "MS&E 175", "MS&E 180", "MS&E 189", "MS&E 226", "MS&E 230", "MS&E 231", "MS&E 239", "MS&E 245A", "MS&E 250A", "MS&E 250B", "MS&E 251", "MS&E 252", "MS&E 260", "MS&E 272", "MS&E 332", "MS&E 352", "MS&E 353", "MS&E 355", "PHIL 49", "PHIL 73", "POLISCI 153", "PSYCH 10", "PSYCH 152", "PSYCH 170", "PSYCH 251", "PSYCH 253", "PSYCH 265", "PSYCH 278", "STATS 191", "STATS 200", "STATS 202", "STATS 211", "STATS 217", "STATS 218", "STATS 263", "STATS 310A", "STATS 310B", "STATS 310C", "SYMSYS 195B", "SYMSYS 195D", "SYMSYS 201", "URBANST 132"],
    "Integ concentration": ["COMM 154", "CS 152", "CS 181", "CS 182", "CS 228", "CS 234", "CS 238", "CS 239", "CS 261", "CS 281", "CS 325B", "MS&E 231", "MS&E 239", "PHIL 184", "PHIL 184B", "PHIL 187", "PHIL 359", "PSYC 125", "PSYCH 154", "PSYCH 160", "PSYCH 220A", "PSYCH 223", "PSYCH 232", "PSYCH 254", "SYMSYS 104", "SYMSYS 201", "SYMSYS 203"],
    "Contingent Electives": ["ANTHRO 100X", "BIO 103", "BIOE 177", "BIOE 273", "COMM 153B", "COMM 230A", "CS 205L", "CS 257", "ECON 102D", "ECON 151", "ENGR 140A", "ENGR 145", "ENGR 148", "ENGR 245", "GLOBAL 124", "HUMBIO 4B", "HUMBIO 146", "LAW 807S", "MS&E 33N", "OTOHNS 206", "OSPOXFRD 76", "PHIL 134A", "PSYC 60N", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PUBLPOL 103F", "SOC 45Q", "SYMSYS 176S", "OSPGEN 47"]
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
          "lut": "Philosophical Inquiry"
        },
        {
          "type": "observe",
          "lut": "Formal Decision Theories"
        },
        {
          "type": "observe",
          "lut": "Empirical Findings and Explanations"
        },
        {
          "type": "observe",
          "lut": "Methods and Applications"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Philosophical Inquiry", "Formal Decision Theories", "Empirical Findings and Explanations", "Methods and Applications", "Contingent Electives"]
    }
  ]
}

export default degree;