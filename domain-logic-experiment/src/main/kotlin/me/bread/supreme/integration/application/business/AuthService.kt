package me.bread.supreme.integration.application.business

import me.bread.supreme.integration.domain.accounts.exception.NoAuthorizationException
import me.bread.supreme.integration.domain.accounts.repsository.AccountsRepository
import me.bread.supreme.integration.domain.accounts.validatior.FakeTokenValidator
import me.bread.supreme.integration.domain.accounts.validatior.TokenValidator

class AuthService(
	private val accountsRepository: AccountsRepository,
	private val tokenValidator: TokenValidator = FakeTokenValidator
) {
	fun isValid(token: String): Boolean {
		if (tokenValidator.check(token) === TokenValidator.CheckResult.SUCCESS){
			return true
		}

		throw NoAuthorizationException()
	}

}
