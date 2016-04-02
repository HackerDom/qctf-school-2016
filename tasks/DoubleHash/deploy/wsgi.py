#!/usr/bin/env python3
from app import app

if __name__ == '__main__':
    app.secret_key = 'H4RDP455W0RD'
    app.run()
