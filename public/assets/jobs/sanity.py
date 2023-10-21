import sys
import requests
import sqlmap
import csrf

def check_sql_injection(data):
    try:
        sqlmap_instance = sqlmap.Sqlmap(data=data)

        result = sqlmap_instance.scan()
        return result
    except Exception as e:
        return str(e)

def check_csrf(data):
    try:
        csrf_instance = csrf.CSRF(data=data)

        result = csrf_instance.check_csrf()
        return result
    except Exception as e:
        return str(e)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        form_data = sys.argv[1]

        sql_injection_result = check_sql_injection(form_data)

        csrf_result = check_csrf(form_data)

        print(sql_injection_result)

        print(csrf_result)
    else:
        print("Please provide form data as a command-line argument.")

