let degree = {
  "degree": "B.A. Economics",
  "level": "undergraduate",
  "year": 2023,
  "uniqueID": "2023_UG_Econ_BA_Standard",
  "lookuptables": {
    "Core": ["ECON 1", "ECON 5[012]", "ECON 102[AB]"],
    "Field": [
      {
        type: 'add',
        method: 'regex',
        string: '^ECON'
      },
      {
        type: 'remove',
        method: 'number',
        comparator: '<',
        number: 200
      },
      {
        type: 'remove',
        method: 'number',
        comparator: '>=',
        number: 300
      },
      {
        type: 'add',
        method: 'regex',
        string: "^ECON (102C|102D|108|111|112|113|118|125|126|127|135|136|137|140|141|144|146|147|149|150|155|156|157|158|160|165|166|177|178|179|198|199D)$"
      }
    ],
    "Elective": [
      {
        type: 'add',
        method: 'regex',
        string: '^ECON'
      },
      {
        "type": "add",
        "method": "regex",
        "string": "^(FINANCE 345|HRP 392|MED 432|ACCT 313|BIO 141|CME 100|CME 103|CME 106|CS 103|CS 109|CS 161|CS 221|CS 224M|CS 227B|CS 228|CS 229|CS 230|CS 269I|EARTHSYS 144|ECON 204|ENGR 60|ENGR 150|ESS 268|INTLPOL 272|FINANCE 320|FINANCE 323|FINANCE 327|FINANCE 377|FINANCE 385|GSBGEN 336|GSBGEN 561|GSBGEN 562|GSBGEN 646|HISTORY 200E|HISTORY 269|HISTORY 279|HRP 252|BMI 251|MED 252|HRP 259|HUMBIO 111|HUMBIO 124E|MED 236|INTLPOL 207|INTLPOL 272|ESS 268|LAW 7502|MATH 113|MATH 114|MATH 115|MATH 118|MATH 120|MATH 136|MATH 151|MATH 161|MATH 171|MATH 172|MATH 175|MATH 180|MATH 50V|MATH 113V|MATH 61CM|MATH 62CM|MATH 61DM|MS&E 120|MS&E 211|MS&E 111|MS&E 221|MS&E 226|MS&E 231|MS&E 245A|MS&E 252|MSE 120|MSE 121|OSPFLOR 26|OSPFLOR 27|OSPHONGK 22|OSPOXFRD 199A|PHIL 50|POLISCI 110C|POLISCI 247G|PUBLPOL 105|PUBLPOL 113|PUBLPOL 174|URBAN 173|PUBLPOL 303D|PUBLPOL 184|PUBLPOL 302B|SINY 128|SINY 202|SOC 114|STANFORD SUMMER M52A|B|MATH103|STAT 110|MS&E 120|STAT 116|STAT 191|STAT 200|STAT 202|STAT 204|STAT 206|STAT 207|STAT 208|STAT 209|STAT 209A|STAT 216|STAT 217|STAT 218|STAT 219|STAT 221|STAT 222|STAT 237|STAT 240|STAT 243|STAT 245|STAT 245P|STAT 315B|STRAMGT 329|EARTHSYS 121|HUMBIO 110|EDUC 107|MS&E 145|MS&E 125|ECON 154|MS&E 241)$"
      }
    ],
    "WIM/Cap": ["ECON 101"],
  },
  "requirements": [
    {
      "lut": "Core",
      "amount": 6
    },
    {
      "type": "and",
      "name": "Field",
      "minUnits": 25,
      "content": [
        {
          "name": " ",
          "lut": "Field",
        }
      ]
    },
    {
      "type": "and",
      "name": "Elective",
      "minUnits": 20,
      "content": [
        {
          "name": " ",
          "lut": "Elective",
        }
      ]
    },
    {
      "lut": "WIM/Cap",
      "amount": 1
    }
  ]
}

export default degree;