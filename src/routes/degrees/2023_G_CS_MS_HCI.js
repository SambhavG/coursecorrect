let degree = {
  "degree": "M.S. Computer Science (HCI)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_HCI",
  "infoText": "Assumes all MS courses are valid. Apply at most 2 foundations.",
  "lookuptables": {
    "Logic": ["CS 103", "CS 154"],
    "Probability": ["CS 109", "STATS 116", "CME 106", "MS&E 220", "EE 178"],
    "Algorithms": ["CS 161"],
    "Systems": ["CS 107", "CS 107E"],
    "OS": ["CS 110", "CS 111"],
    "Sig imp": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 145", "CS 148", "CS 151", "CS 190", "CS 210B", "CS 212", "CS 221", "CS 227B", "CS 231N", "CS 243", "CS 248", "CS 248A", "CS 341"],
    "Breadth A": ["CS 154", "CS 157", "CS 168", "CS 254", "CS 261", "CS 265", "EE 364A", "EE 364B", "PHIL 251"],
    "Breadth B": ["CS 140", "CS 140E", "CS 143", "CS 144", "CS 149", "CS 212", "CS 242", "CS 243", "CS 244", "CS 244B", "CS 295", "CS 316", "CS 358", "EE 180", "EE 282", "EE 382E"],
    "Breadth C": ["CS 145", "CS 147", "CS 148", "CS 155", "CS 173", "CS 221", "CS 223A", "CS 224N", "CS 224U", "CS 224W", "CS 227B", "CS 228", "CS 229", "CS 229M", "CS 231A", "CS 231N", "CS 234", "CS 236", "CS 237A", "CS 245", "CS 246", "CS 247[A-Z]*", "CS 248[A-Z]*", "CS 251", "CS 255", "CS 273A", "CS 273B", "CS 279", "CS 345", "CS 347", "CS 348[A-Z]*", "CS 355", "CS 356", "CS 373"],
    "Breadth D": ["CS 152", "CS 181", "CS 182", "CS 256", "CS 281", "CS 329T", "CS 384", "AMSTUD 133", "AMSTUD 145", "ANTHRO 132D", "COMM 118S", "COMM 120W", "COMM 124", "COMM 130D", "COMM 145", "COMM 154", "COMM 166", "COMM 186W", "COMM 230A", "COMM 230B", "COMM 230C", "DESINST 215", "DESINST 240", "EARTHSYS 213", "ENGLISH 184D", "ENGR 248", "HISTORY 244F", "INTLPOL 268", "LAW 4039", "ME 177", "MS&E 193", "MS&E 231", "MS&E 234", "MS&E 254", "POLISCI 150A", "PSYCH 215", "PUBLPOL 103F", "PUBLPOL 353B"],
    "Depth A": ["CS 147", "CS 247[A-Z]*", "CS 347", "CS 142", "CS 147L"],
    "Depth B": ["CS 278", "CS 448B"],
    "Depth C": ["CS 177", "CS 194H", "CS 206", "CS 210A", "CS 224C", "CS 247[A-Z]*", "CS 329X", "CS 377[A-Z]*"],
    "Depth D": ["ARTSTUD 130", "ARTSTUD 163", "ARTSTUD 165A", "ARTSTUD 169A", "ARTSTUD 231A", "COMM 224", "COMM 272", "COMM 324", "ME 115A", "ME 115C", "ME 216A", "COMM 254", "COMM 314", "EDUC 200B", "MS&E 125", "PSYCH 251", "PSYCH 252", "PSYCH 253", "STATS 203", "CS 498C", "EDUC 281", "EDUC 342", "EDUC 432", "MS&E 184", "MS&E 231", "MS&E 334", "ME 203", "ME 210", "ME 216A", "MUSIC 220A", "MUSIC 220B", "MUSIC 220C", "MUSIC 250A", "MUSIC 256A", "PSYCH 204", "PSYCH 209", "SYMSYS 245", "DESIGN 204", "DESIGN 292", "DESIGN 231", "DESIGN 236P", "DESIGN 240", "LAW 809E", "DESIGN 283Q", "DESIGN 262", "DESIGN 315", "DESIGN 259", "DESIGN 282", "DESIGN 276", "ME 206[AB]", "ENGR 231", "DESIGN 294", "DESIGN 268", "DESIGN 399", "DESIGN 368", "DESIGN 245", "DESIGN 265", "DESIGN 284", "DESIGN 287", "DESIGN 261", "DESIGN 187N", "DESIGN 255", "DESIGN 273", "DESIGN 251", "DESIGN 204"],
    "CS dept electives": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^CS'
      },
      {
        "type": 'remove',
        "method": 'number',
        "comparator": '<=',
        "number": 111
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": '^(CS 19[38]|CS 390[A-C])$'
      },
    ],
    "All SoE": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^(AA|BIOE|CHEMENG|CEE|CME|DESIGN|DESINST|EE|ENGR|MS&E|MATSCI|ME|SCCM) '
      },
      {
        "type": 'remove',
        "method": 'number',
        "comparator": '<=',
        "number": 100
      }
    ]
  },
  "requirements": [
    {
      "type": "and",
      "name": "Foundations",
      "bundle": true,
      "content": [
        {
          "type": "observe",
          "lut": "Logic",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Probability",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Algorithms",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "Systems",
          "allowBS": true
        },
        {
          "type": "observe",
          "lut": "OS",
          "allowBS": true
        }
      ]
    },
    {
      "type": "observe",
      "lut": "Sig imp"
    },
    {
      "type": "or",
      "name": "Breadth",
      "amount": 3,
      "content": [
        {
          "type": "observe",
          "lut": "Breadth A"
        },
        {
          "type": "observe",
          "lut": "Breadth B"
        },
        {
          "type": "observe",
          "lut": "Breadth C"
        },
        {
          "type": "observe",
          "lut": "Breadth D"
        }
      ]
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 21,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Depth A",
        },
        {
          "lut": "Depth B",
        },
        {
          "lutList": ["Depth B", "Depth C"],
          "amount": 2
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C", "Depth D"],
        }
      ]
    }
  ]
}

export default degree;