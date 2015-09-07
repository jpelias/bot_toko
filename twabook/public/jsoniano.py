import io
import json
from pprint import pprint

with open('Texto.json') as f:    
    data = json.load(f)

#print data['results'][0]['objectId']

largo = range(8401)

ceros = "000000000000"

dato = data

for i in largo:

    si = str(i)
    si = ceros[:10-len(si)] + si
    print si, data['results'][i]['objectId']
    data['results'][i]['objectId'] = si



with io.open('watership.json','w', encoding='utf-8') as f:
    f.write(json.dumps(data, ensure_ascii=False))
