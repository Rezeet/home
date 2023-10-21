import json
from zapv2 import ZAPv2
import sys

def sanity(target_url, form_data):
    zap = ZAPv2()
    zap.urlopen(target_url)

    request_data = {
        "formParams": form_data
    }

    response = zap.urlopen(target_url, postdata=json.dumps(request_data))

    scan_id = zap.spider.scan(target_url)
    zap.spider.scan_as_user(target_url, contextid=1, userid=1)
    zap.ascan.scan(target_url, scanid=scan_id)

    while int(zap.ascan.status(scan_id)) < 100:
        print(f"Scan progress: {zap.ascan.status(scan_id)}%")
    
    alerts = zap.core.alerts()
    
    return alerts

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python security_scan.py <target_url> <form_data_json>")
        sys.exit(1)

    target_url = sys.argv[1]
    form_data = json.loads(sys.argv[2])

    scan_results = security_scan(target_url, form_data)

    for alert in scan_results:
        print(alert)

