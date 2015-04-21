import time
import socket, BaseHTTPServer

HOST_NAME = '0.0.0.0'
PORT_NUMBER = 21430

class ServerHandler(BaseHTTPServer.BaseHTTPRequestHandler):
  def do_HEAD(s):
    s.send_response(200)
    s.send_header("Content-type", "text/html")
    s.end_headers()
  def do_GET(s):
    print "hello"
    """Respond to a GET request."""
    s.send_response(200)
    s.send_header("Content-type", "text/html")
    s.end_headers()
    s.wfile.write("<html><head><title>Test</title></head><body>OK</body></html>")
    # use s.path to get accessed server directory

if __name__ == '__main__':
  server_class = BaseHTTPServer.HTTPServer
  httpd = server_class((HOST_NAME, PORT_NUMBER), ServerHandler)
  print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)
  try:
    httpd.serve_forever()
  except KeyboardInterrupt:
    pass
  httpd.server_close()
  print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)