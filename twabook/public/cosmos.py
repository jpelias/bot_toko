import requests
import json

contador = 1

with open('cosmos.txt') as f:
 
    for line in f:
 
        data =line.strip("\n")

        print data
        
        url = 'https://s6a99m0aklc7.runscope.net'

        url = 'http://tweetabook.parseapp.com/texto'


        headers = {'Content-Type': 'application/json', 
           'Accept-Encoding': 'gzip, deflate' , 
           'User-Agent': 'Ninguno' ,
           'Connection': 'keep-alive'}


        payload = { "text" : data }

        r = requests.post(url,headers=headers, data=json.dumps(payload))

        

        print r.status_code ,">" ,contador

        contador = contador + 1




