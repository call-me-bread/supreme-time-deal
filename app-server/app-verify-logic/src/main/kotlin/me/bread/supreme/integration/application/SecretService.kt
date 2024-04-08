package me.bread.supreme.integration.application

import me.bread.supreme.integration.application.helper.FakeTokenValidator
import me.bread.supreme.integration.application.helper.TokenValidator
import me.bread.supreme.integration.domain.secret.SecretRepository
import java.nio.file.AccessDeniedException

class SecretService(
	private val secretRepository: SecretRepository,
	private val tokenValidator: TokenValidator = FakeTokenValidator
) {
	/**
	 * 인증 서비스
	 */
	fun checkLogin(token: String): Boolean {
		if (tokenValidator.check(token) === TokenValidator.CheckResult.SUCCESS){
			return true
		}

		throw AccessDeniedException("access deny")
	}

}
