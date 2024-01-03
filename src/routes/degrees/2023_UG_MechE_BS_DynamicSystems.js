let degree = {
  "degree": "B.S. MechE (Dynamic Systems)",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_MechE_BS_DynamicSystems",
  "lookuptables": {
    "MATH 19": ["MATH 19"],
    "MATH 20": ["MATH 20"],
    "MATH 21": ["MATH 21"],
    "Stats": ["CME 106", "STATS 110", "STATS 116"],
    "ODEs": ["CME 102", "MATH 53"],
    'Math': [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^MATH'
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": 'ACE'
      }
    ],
    "Mechanics": ["PHYSICS 21", "PHYSICS 41", "PHYSICS 61"],
    "E&M": ["PHYSICS 23", "PHYSICS 43", "PHYSICS 63", "PHYSICS 81"],
    "Physics": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^PHYSICS'
      },
    ],
    "CHEM 31": ["CHEM 31A", "CHEM 31B", "CHEM 31M"],
    "CHEM 33": ["CHEM 33"],
    "Chemistry": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^CHEM'
      },
      {
        "type": 'remove',
        "method": 'regex',
        "string": 'ACE'
      }
    ],
    "Science": [
      {
        "type": 'add',
        "method": 'regex',
        "string": '^(BIO|PHYSICS|CHEM|BIOPHYS|APPHYS|CEE|BIOE|HUMBIO|EARTHSYS|GEOPHYS|ENVRES|ENERGY)'
      }
    ],
    "TIS": ["AA 252", "BIOE 131", "COMM 120W", "CS 181", "HUMBIO 174", "MS&E 193"],
    "Eng Fund": ["ENGR 14", "CS 106A", "CS 106B"],
    "Core": ["ENGR 15", "ME 1", "ME [378]0", "ME 10[234]", "ME 131", "ME 123", "ME 170[AB]"],
    "Dynamic systems required": ["ME 161", "ENGR 105"],
    "Dynamic systems optional": ["ME 327", "ENGR 205", "ME 210", "ME 220", "ME 331A", "ME 485"],
    "Materials and structures required": ["ME 149", "ME 152"],
    "Materials and structures optional": ["ME 234", "ME 241", "ME 281", "ME 283", "ME 287", "ME 331A", "ME 335A", "ME 338", "ME 339"],
    "Product realization required": ["ME 127", "ME 128", "ME 129"],
    "Product realization optional": ["ENGR 110", "ENGR 240", "CME 106", "ME 210", "ME 217", "ME 263", "ME 298"],
    "Thermo, fluids, heat transfer required": ["ME 132", "ME 133", "ME 149"],
    "Thermo, fluids, heat transfer optional": ["ME 250", "ME 257", "ME 351A", "ME 351B", "ME 352A", "ME 352B", "ME 352C", "ME 362A", "ME 370A", "ME 370B", "ME 371", "AA 283"],
    "ME 191": ["ME 191"],
  },
  "requirements": [
    {
      "type": "and",
      "name": "Math",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 24,
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
          "lut": "Stats"
        },
        {
          "lut": "ODEs"
        },
        {
          "lut": "Math",
          "amount": 0
        }
      ]
    },
    {
      "type": "and",
      "name": "Science",
      "bundleName": " ",
      "bundle": true,
      "minUnits": 20,
      "content": [
        {
          //Chem/physics
          "name": "AAAAA",
          "type": "or",
          "amount": 4,
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
              "lut": "Physics"
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
                }
              ]
            },
            {
              "lut": "CHEM 31",
            },
            {
              "lut": "CHEM 33",
            },
            {
              "lut": "Chemistry",
            }
          ]
        },
        {
          "lut": "Science",
          "amount": 0
        }
      ]
    },
    {
      "lut": "TIS"
    },
    {
      "lut": "Eng Fund",
      "amount": 2
    },
    {
      "lut": "Core",
      "amount": 12
    },
    {
      "type": "and",
      "name": "Depth",
      "minUnits": 18,
      "bundle": true,
      "bundleName": " ",
      "content": [
        {
          "lut": "Dynamic systems required",
          "amount": 2
        },
        {
          "lut": "Dynamic systems optional",
          "amount": 2
        },
        {
          "name": "Elective",
          "lutList": ["Dynamic systems required", "Dynamic systems optional", "Materials and structures required", "Materials and structures optional", "Product realization required", "Product realization optional", "Thermo, fluids, heat transfer required", "Thermo, fluids, heat transfer optional", "ME 191"],
        }
        
      ]
    },
  ]
}

export default degree;