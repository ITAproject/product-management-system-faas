# 🛍️ Product Management System

Ta projekt prikazuje, kako razviti strežniško nezahtevno backend rešitev za sistem upravljanja izdelkov z uporabo AWS Lambda, DynamoDB in S3 s Serverless Framework. Backend je razvit in testiran lokalno z uporabo Localstack.
## 🚀 Nastavitev projekta

### Korak 1: Namestite Node.js in Serverless Framework

Prepričajte se, da imate nameščen Node.js. Nato namestite Serverless Framework globalno:

```console
npm install -g serverless
```

### Korak 2: Ustvarite Serverless projekt

Ustvarite nov Serverless projekt:

```console
serverless create --template aws-nodejs --path product-management-system
cd product-management-system
npm init -y
npm install aws-sdk serverless-offline serverless-localstack
```

## ⚙️ Konfiguracija

### Korak 3: Konfigurirajte serverless.yml

Posodobite serverless.yml za konfiguracijo DynamoDB in S3 lokalno z uporabo Localstack, ter vključite serverless-offline za lokalni API Gateway.

## 📝 Lambda Funkcije

### Korak 4: Ustvarite Lambda funkcije

Ustvarite handler.js datoteko z Lambda funkcijami za obravnavo API končnih točk.

## 🛠 Lokalni razvoj

### Korak 5: Zaženite Localstack

Zaženite Localstack:

```console
localstack start
```

Ustvarite DynamoDB tabelo in S3 bucket lokalno:

```bash
aws --endpoint-url=http://localhost:4566 dynamodb create-table --table-name product-management-system-products --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=1,WriteCapacityUnits=1 --region us-east-1

aws --endpoint-url=http://localhost:4566 s3api create-bucket --bucket product-management-system-uploads --region us-east-1
```

### Korak 6: Zaženite Serverless Offline

Zaženite serverless offline plugin za lokalno izvajanje API-ja:

```console
serverless offline --stage local
```

### Korak 7: Testiranje lokalno

Uporabite Postman ali curl za testiranje končnih točk lokalno:

#### 🛍️ Ustvarjanje izdelka:

```bash
curl -X POST http://localhost:3000/local/products -H "Content-Type: application/json" -d '{"name":"Izdelek 1","description":"Opis izdelka","price":100}'
```

#### 📋 Pridobi vse izdelke:

```bash
curl http://localhost:3000/local/products
```

#### 🔍 Pridobi izdelek po ID-ju:

```bash
curl http://localhost:3000/local/products/{id}
```

#### ✏️ Posodobi izdelek:

```bash
curl -X PUT http://localhost:3000/local/products/{id} -H "Content-Type: application/json" -d '{"name":"Posodobljen izdelek","description":"Posodobljen opis","price":150}'
```

#### ❌ Izbriši izdelek:

```bash
curl -X DELETE http://localhost:3000/local/products/{id}
```
