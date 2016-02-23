#Build Apple Push Service Key
openssl x509 -in ios/aps.cer -inform der -out PushIKmatCert.pem

openssl pkcs12 -nocerts -out PushIKmatKey.pem -in ios/key.p12

cat PushIKmatCert.pem PushIKmatKey.pem > ios/PushIKmat.pem

openssl s_client -connect gateway.push.apple.com:2195 -cert PushIKmatCert.pem -key PushIKmatKey.pem

rm -rf PushIKmatKey.pem PushIKmatCert.pem
