import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "backend"))
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_discloses_no_ai():
    r = client.get('/api/health')
    assert r.status_code == 200 and r.json()['ai_connected'] is False

def test_ch_and_eu_are_separate_modules():
    r = client.get('/api/jurisdictions')
    assert r.status_code == 200
    items = {j['id']: j for j in r.json()}
    assert 'ch' in items and 'eu' in items
    assert items['ch']['sources'][0]['id'] != items['eu']['sources'][0]['id']
    assert all(not j['enabled_for_research'] for j in items.values())

def test_intake_does_not_claim_analysis():
    r = client.post('/api/matters', json={'title':'Demo agreement','text':'Fictional agreement only.', 'jurisdiction':'ch', 'language':'en','kind':'contract'})
    assert r.status_code == 200
    assert 'No legal analysis' in r.json()['analysis']
    assert 'Fictional agreement only.' not in str(r.json())

def test_unknown_jurisdiction_fails():
    r = client.post('/api/matters', json={'title':'Demo agreement','text':'Fictional agreement only.', 'jurisdiction':'zz', 'language':'en','kind':'contract'})
    assert r.status_code == 422
