#!flask/bin/python
from app import app

app.secret_key = 'H4RDP455W0RD'
app.run(debug=True)