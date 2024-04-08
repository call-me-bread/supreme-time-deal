package me.bread.supreme.integration.application.business

import me.bread.supreme.integration.domain.authorization.validatior.TokenValidator
import me.bread.supreme.integration.domain.authorization.repsository.AuthRepository
import me.bread.supreme.integration.domain.authorization.validatior.FakeTokenValidator
import me.bread.supreme.integration.domain.authorization.exception.NoAuthorizationException

class AuthService(
	private val authRepository: AuthRepository,
	private val tokenValidator: TokenValidator = FakeTokenValidator
) {
	fun isValid(token: String): Boolean {
		if (tokenValidator.check(token) === TokenValidator.CheckResult.SUCCESS){
			return true
		}

		throw NoAuthorizationException()
	}

}
