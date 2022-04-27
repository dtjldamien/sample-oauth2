# Sample OAuth 2.0 Express server
Sample OAuth 2.0 Express server to test connection and endpoints.

## Installation
```bash
yarn
```

## Usage
To test without scope and credentials only
```bash
yarn start
```

To test with scope only
```bash
yarn start:scope
```

To test with certificates only
```bash
yarn start:cert
```

To test with scope and certificates
```bash
yarn start:cert-scope
```

## Endpoints
Install [Insomnia](insomnia.rest) or [Postman](postman.com)\
Sample endpoints are available in `./endpoints`, which can be imported into Insomnia.
Add client certificates under `Collection Settings` with CRT as `certs/client1-crt.pem` and Key as `certs/client1-key.pem` for lvh.me:8002 and lvh.me:8003.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
