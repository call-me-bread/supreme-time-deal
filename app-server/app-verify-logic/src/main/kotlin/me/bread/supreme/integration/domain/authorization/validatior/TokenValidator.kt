package me.bread.supreme.integration.domain.authorization.validatior

interface TokenValidator {
	enum class CheckResult {
		SUCCESS,
		FAIL
	}

	fun check(token: String): CheckResult
}
