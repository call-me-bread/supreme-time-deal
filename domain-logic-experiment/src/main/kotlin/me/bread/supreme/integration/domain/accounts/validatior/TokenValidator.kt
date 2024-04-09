package me.bread.supreme.integration.domain.accounts.validatior

interface TokenValidator {
	enum class CheckResult {
		SUCCESS,
		FAIL
	}

	fun check(token: String): CheckResult
}
