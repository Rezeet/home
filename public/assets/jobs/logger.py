import logging
from logging.handlers import RotatingFileHandler

logger = logging.getLogger("log4js")
logger.setLevel(logging.DEBUG)  

log_file = 'node_app_logs.log'
handler = RotatingFileHandler(log_file, maxBytes=10*1024*1024, backupCount=5) 
handler.setLevel(logging.DEBUG)

console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO) 

formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

logger.addHandler(handler)
logger.addHandler(console_handler)

if __name__ == "__main__":
    try:
        1 / 0  
    except Exception as e:
        logger.exception("An error occurred: %s", str(e))
