let degree = {
  "degree": "B.S. SymSys (Comp Soc Sci)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Symsys_BS_ComputationalSocialScience",
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
    
    "Social Behavior": ["BIO 30", "BIO 81", "COMM 1", "ECON 1", "ECON 46", "ECON 50", "ECON 160", "ECON 178", "ECON 180", "EDUC 101", "LINGUIST 150", "MS&E 135", "MS&E 180", "MS&E 232", "OSPSANTG 46", "POLISCI 1", "POLISCI 101", "POLISCI 120C", "PSYCH 70", "PSYCH 154", "SOC 1", "SOC 126", "SOC 130", "SOC 146", "SOC 160"],
    "Statistical Inference": ["ECON 102A", "ECON 102B", "EDUC 400A", "MS&E 125", "MS&E 226", "SOC 180B", "STATS 110", "STATS 191", "STATS 200", "STATS 202"],
    "Computational Data Methods": ["CS 129", "CS 224N", "CS 224W", "CS 228", "CS 229", "CS 230", "CS 238", "CS 246", "CS 448B", "ECON 102B", "LINGUIST 180", "LINGUIST 188", "PSYCH 204", "PSYCH 209", "PSYCH 220A", "STATS 216"],
    "Social Data Science": ["COMM 106", "COMM 206", "COMM 173E", "ENGR 150", "ECON 102D", "ECON 151", "POLISCI 151", "EDUC 143", "EDUC 423", "SOC 302", "MS&E 231", "SOC 278", "POLISCI 150A", "POLISCI 355A", "POLISCI 150C", "POLISCI 355C", "PSYCH 290", "SOC 281", "SYMSYS 195T", "SOC 180A", "CSRE 180A", "SOC 280A", "SOC 194", "SOC 369", "EDUC 316"],
    "Integ concentration": ["COMM 322", "COMM 326", "CS 124", "LINGUIST 180", "LINGUIST 280", "CS 152", "CS 181", "CS 182", "COMM 180", "ETHICSOC 182", "PHIL 82", "POLISCI 182", "PUBLPOL 182", "CS 184", "PUBLPOL 170", "CS 206", "COMM 281", "CS 224W", "CS 246", "CS 278", "CS 281", "CS 325B", "EARTHSYS 162", "EARTHSYS 262", "CS 384", "ECON 160", "ECON 178", "ECON 180", "MS&E 234", "PHIL 171", "ETHICSOC 171", "POLISCI 103", "POLISCI 336S", "PUBLPOL 103C", "PHIL 171P", "ETHICSOC 130", "POLISCI 130", "PHIL 359", "PSYCH 154", "PSYCH 262", "PSYCH 293", "PHIL 350", "SOC 154", "COMM 154", "COMM 254", "CSRE 154T", "SOC 254C", "SYMSYS 104", "ANTHRO 104D", "CSRE 104"],
    "Contingent Electives": ["ANTHRO 100X", "ANTHRO 116", "ANTHRO 132D", "BIO 61", "BIO 85", "BIO 103", "BIO 145", "BIOE 177", "BIOE 273", "COMM 106", "COMM 153B", "COMM 158", "COMM 173E", "COMM 176", "COMM 177B", "COMM 177P", "COMM 177T", "COMM 230A", "CS 102", "CS 145", "CS 205L", "CS 236", "CS 257", "ECON 47", "ECON 106", "ECON 118", "ECON 125", "ECON 144", "ECON 150", "ECON 155", "EDUC 260B", "EE 374", "ENGLISH 384B", "ENGR 145", "ENGR 148", "ESS 224", "GLOBAL 124", "INTLPOL 259", "INTLPOL 268D", "LAW 807S", "LINGUIST 154", "LINGUIST 156", "LINGUIST 157", "LINGUIST 234", "LINGUIST 250", "LINGUIST 258", "LINGUIST 285", "LINGUIST 278", "MGTECON 634", "MS&E 121", "MS&E 125", "MS&E 184", "MS&E 190", "MS&E 201", "MS&E 221", "MS&E 223", "MS&E 230", "MS&E 231", "MS&E 234", "MS&E 243", "MS&E 280", "MS&E 292", "OSPOXFRD 16", "OSPOXFRD 76", "OTOHNS 206", "PHIL 2", "PHIL 60", "PHIL 170", "PHIL 171", "PHIL 171P", "PHIL 174B", "PHIL 175B", "POLISCI 1", "POLISCI 120Z", "POLISCI 150A", "POLISCI 150C", "POLISCI 223A", "POLISCI 227C", "POLISCI 241A", "POLISCI 241S", "PSYC 60N", "PSYC 86Q", "PSYC 135", "PSYCH 12N", "PSYCH 24N", "PSYCH 144", "PSYCH 170", "PSYCH 265", "PSYCH 278", "PUBLPOL 103F", "SOC 1", "SOC 3", "SOC 10", "SOC 14N", "SOC 31N", "SOC 45Q", "SOC 114", "SOC 118", "SOC 124", "SOC 130", "SOC 133D", "SOC 167VP", "SOC 168", "SOC 179A", "STATS 101", "STATS 191", "STATS 200", "STATS 202", "STATS 203", "STATS 209", "STATS 211", "STS 191W", "SYMSYS 176S", "OSPGEN 47", "SYMSYS 201"]
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
          "lut": "Social Behavior"
        },
        {
          "type": "observe",
          "lut": "Statistical Inference"
        },
        {
          "type": "observe",
          "lut": "Computational Data Methods"
        },
        {
          "type": "observe",
          "lut": "Social Data Science"
        }
      ]
    },
    //Concentration courses (not including those applied to core)
    {
      "name": "Conc",
      "amount": 4,
      "lutList": ["Social Behavior", "Statistical Inference", "Computational Data Methods", "Social Data Science", "Contingent Electives"]
    }
  ]
}

export default degree;