/**
 * 参数加解密操作
 */
// const CryptoJS = require('crypto-js')
import CryptoJS from 'crypto-js'
// 加密秘钥
const SECRET_KEY = CryptoJS.enc.Utf8.parse('12234122341223412234')
// 加密盐
const SECRET_IV = CryptoJS.enc.Utf8.parse('12234122341223412234')

// 加密
export const encrypt = (data: any) => {
	if (typeof data === 'object') {
		try {
			data = JSON.stringify(data)
		} catch (error) {
			console.log('data加密转换失败----->', error)
		}
	}
	const dataHex = CryptoJS.enc.Utf8.parse(data)
	const encrypted = CryptoJS.AES.encrypt(dataHex, SECRET_KEY, {
		iv: SECRET_IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	})
	return encrypted.ciphertext.toString()
}

export const decrypt = (data: any) => {
	const encryptedHexStr = CryptoJS.enc.Hex.parse(data)
	const str = CryptoJS.enc.Base64.stringify(encryptedHexStr)
	const decrypt = CryptoJS.AES.decrypt(str, SECRET_KEY, {
		iv: SECRET_IV,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7,
	})
	const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8)
	return decryptedStr
}
