curl -X POST http://localhost:3000/send-confirmation-email \
    -H "Content-Type: application/json" \
    -H "x-access-token: ${SECRET_TOKEN}" \
    -d '{
        "to": "example@gmail.com",
        "token": "fdslkf-snadfdas-l2332fosd",
        "domain": "https://example.com"
    }'

curl -X POST http://localhost:3000/send-password-reset-email \
    -H "Content-Type: application/json" \
    -H "x-access-token: ${SECRET_TOKEN}" \
    -d '{
        "to": "ramongs237@gmail.com",
        "resetToken": "fdslkf-snadfdas-l2332fosd",
        "domain": "https://example.com"
    }'

