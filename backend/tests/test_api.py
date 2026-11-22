import io
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
client=TestClient(app)

def test_health():
    r=client.get('/api/v1/health');assert r.status_code==200
    assert r.json()['metric_length_model_ready'] is False

def test_overview_no_fabricated_metric():
    r=client.get('/api/v1/overview');assert r.status_code==200
    assert r.json()['length_mae_cm'] is None
    assert r.json()['verified_metric_length'] is False

def test_upload_bad_format():
    r=client.post('/api/v1/analyze',files={'image':('fake.txt',b'aaa','text/plain')})
    assert r.status_code==415

def test_upload_actual_image():
    img=Image.new('RGB',(150,120),(12,14,25))
    b=io.BytesIO();img.save(b,format='PNG')
    r=client.post('/api/v1/analyze',files={'image':('scene.png',b.getvalue(),'image/png')})
    assert r.status_code==200
    assert r.json()['length_cm'] is None

def test_no_path_traversal_in_gallery():
    assert client.get('/api/v1/gallery/-1').status_code==404
