let degree = {
  "degree": "M.S. Computer Science (Systems)",
  "level": "graduate",
  "year": 2023,
  "uniqueID": "2023_G_CS_MS_Systems",
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
    "Depth A": ["CS 140", "CS 212", "CS 140E", "CS 112", "CS 112E", "CS 144", "CS 240"],
    "Depth B": ["CS 190", "CS 242", "CS 243", "CS 244", "CS 245", "CS 248", "CS 248A", "CS 348B", "EE 271", "EE 282"],
    "Depth C": ["CS 149", "CS 217", "CS 229S", "CS 241", "CS 244B", "CS 246", "CS 251", "CS 255", "CS 270", "CS 272", "CS 294S", "CS 295", "CS 315B", "CS 316", "CS 340[A-Z]*", "CS 343D", "CS 344[A-Z]*", "CS 348[A-Z]*", "CS 349[A-Z]*", "CS 356", "CS 357S", "CS 399", "CS 448[A-Z]*", "EE 267", "EE 273", "EE 382C", "EE 384A", "EE 384C", "EE 384S"],
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
          "amount": 3
        },
        {
          "lut": "Depth B",
          "amount": 4
        },
        {
          "lutList": ["Depth A", "Depth B", "Depth C"]
        }
      ]
    }
  ]
}

export default degree;