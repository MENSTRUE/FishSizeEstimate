"""API contract tests without loading any trained checkpoint."""
import io
import numpy as np
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
import fish_ml_router


def test_segment_returns_mask_not_centimetres(monkeypatch):
    class FakeBox:
        xyxy = [np.array([2, 4, 34, 32])]
        conf = [0.88]
    class FakeMasks:
        xy = [np.array([[2, 4], [34, 4], [34, 32], [2, 32]], dtype=float)]
    class FakeResult:
        boxes = [FakeBox()]
        masks = FakeMasks()
    class FakeModel:
        def predict(self, **kwargs):
            assert kwargs['device'] == 'cpu'
            return [FakeResult()]
    monkeypatch.setattr(fish_ml_router, 'get_model', lambda: FakeModel())
    image = Image.new('RGB', (64, 48), (10, 20, 30))
    raw = io.BytesIO()
    image.save(raw, format='PNG')
    response = TestClient(app).post('/api/v1/ml/segment', files={'image': ('test.png', raw.getvalue(), 'image/png')})
    assert response.status_code == 200, response.text
    value = response.json()
    assert value['fish_count'] == 1
    assert value['objects'][0]['polygon_xy']
    assert value['physical_length_cm'] is None
    assert value['frame'] == {'width': 64, 'height': 48}


def test_segment_rejects_non_image():
    response = TestClient(app).post('/api/v1/ml/segment', files={'image': ('bad.txt', b'not an image', 'text/plain')})
    assert response.status_code == 415
