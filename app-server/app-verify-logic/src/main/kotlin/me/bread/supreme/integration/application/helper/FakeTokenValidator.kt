package me.bread.supreme.integration.application.helper

object FakeTokenValidator: TokenValidator {
	private val INVALID_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cwibmFtZ"

	override fun check(token: String): TokenValidator.CheckResult {
		if (token == INVALID_TOKEN) {
			return TokenValidator.CheckResult.SUCCESS
		}

		return TokenValidator.CheckResult.FAIL
	}
}
