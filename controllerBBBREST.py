'''
MIT License

Copyright (c) 2017 Arshdeep Bahga and Vijay Madisetti

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
'''
from ethjsonrpc import EthJsonRpc
import RPi.GPIO as GPIO
import time
import requests
import json

stationID='123'
#url='http://192.168.0.104:5000/api/stationstate/'+stationID
GPIO.setmode(GPIO.BOARD)
GPIO.setup(7, GPIO.OUT) #GPIO - 68
c = EthJsonRpc('192.168.0.109' ,8545)
account_to_watch = '0xa587bb720ac71ca217887ad0e3f156fb85784dec'
call_time = int(time.time());
onStatus=False

details = c.call(account_to_watch,'getStation(uint256)',[123],['uint256','string','uint256','uint256','uint256'])
print details;

while True:
    #r = requests.get(url)
    r = c.call(account_to_watch, 'getStationState(uint256)',[stationID], ['uint256'])
    #r = str(r.text)
    #result = json.loads(r)
    call_time = int(time.time());
    print call_time
    print r[0]
    if call_time < r[0]:
        result = "true"
    else:
        result = "false"
    print result

    if (onStatus==False):
        if(result[0]==True):
            print "Switch ON"
            onStatus=True
            GPIO.output(7, True)
    elif (onStatus==True):
        if(result[0]==False):
            print "Switch OFF"
            onStatus=False
            GPIO.output(7, False)

    time.sleep(2)
