# GET
```bash
curl -X GET "http://localhost:80/records?id_nodo=1&temperatura=25.1&humedad=60.2&co2=499.8&volatiles=100.0"
```

# POST
```bash
curl -X POST "http://localhost:80/records" \
  -H "Content-Type: application/json" \
  -d '{
    "id_nodo": 2,
    "temperatura": 24.8,
    "humedad": 56.1,
    "co2": 485.5,
    "volatiles": 110.3
  }'

```