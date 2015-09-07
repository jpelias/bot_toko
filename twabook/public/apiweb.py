#!/usr/bin/env python
# coding=utf-8
from __future__ import unicode_literals

from pytg import Telegram
tg = Telegram(
    telegram="/home/usuario/tg/bin/telegram-cli",
    pubkey_file="/home/usuario/tg/tg-server.pub")
receiver = tg.receiver
sender = tg.sender

import web
import json


def notfound():
    #return web.notfound("Sorry, the page you were looking for was not found.")
    return json.dumps({'ok':0, 'errcode': 404})

def internalerror():
    #return web.internalerror("Bad, bad server. No donut for you.")
    return json.dumps({'ok':0, 'errcode': 500})


urls = (
    '/(.*)', 'handleRequest',
)


class handleRequest:

    def GET(self, method_id):
        if not method_id: 
            return web.notfound()
        else:
            return json.dumps({'ok': method_id})

    def POST(self,method_id):
        try:
            i = web.input()

            data = json.loads(web.data()) # you can get data use this method

            sender.send_msg( data[u'user'], data[u'msg'])

                        
            return json.dumps({'ok':0, 'errcode': 200})
        except Error(e):
            print e   



app = web.application(urls, globals())
app.notfound = notfound
app.internalerror = internalerror




if __name__ == "__main__":
       
    app.run() 