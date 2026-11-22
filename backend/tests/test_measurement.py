from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)
BASE = {'image_width':1000,'image_height':600,'snout':{'x':100,'y':200},'tail_tip':{'x':500,'y':200},'reference_start':{'x':100,'y':450},'reference_end':{'x':300,'y':450},'reference_length_cm':10,'coplanar_confirmed':True,'length_definition':'total_length_straight_line'}

def test_measurement_20cm():
    r=client.post('/api/v1/measure',json=BASE)
    assert r.status_code==200,r.text
    assert r.json()['length_cm']==20
    assert r.json()['ground_truth_accuracy_validated'] is False

def test_coplanar_required():
    r=client.post('/api/v1/measure',json={**BASE,'coplanar_confirmed':False})
    assert r.status_code==422

def test_zero_length_reference_rejected():
    r=client.post('/api/v1/measure',json={**BASE,'reference_end':BASE['reference_start']})
    assert r.status_code==422

def test_points_outside_frame_rejected():
    r=client.post('/api/v1/measure',json={**BASE,'tail_tip':{'x':1200,'y':200}})
    assert r.status_code==422

def test_no_fabricated_zero_without_scale():
    r=client.post('/api/v1/measure',json={k:v for k,v in BASE.items() if k!='reference_length_cm'})
    assert r.status_code==422
