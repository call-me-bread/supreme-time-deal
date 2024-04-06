package me.bread.supreme.integration.application

class AuthService {
	/**
	 * 인증 서비스
	 */
	fun checkLogin(token: String): Boolean {
		return validateToken(token)
	}

	private fun validateToken(token: String): Boolean {
		// 토큰 유효성 검사
		return true
	}
}
