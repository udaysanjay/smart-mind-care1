import importlib
import os
import sys

# Ensure project `backend` package is on sys.path so `import app` works
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

modules = [
    'app.api.v1.endpoints.chatbot',
    'app.api.v1.endpoints.auth',
    'app.api.v1.endpoints.analytics',
    'app.api.v1.endpoints.meetings',
    'app.api.v1.endpoints.notifications',
    'app.api.v1.endpoints.users',
    'app.api.v1.endpoints.tracker',
    'app.api.v1.endpoints.requests',
    'app.api.v1.endpoints.psychologists'
]

for m in modules:
    try:
        importlib.import_module(m)
        print(m + ': OK')
    except Exception as e:
        print(m + ': ERROR ->', type(e).__name__, e)
