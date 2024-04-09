package me.bread.supreme.integration.domain.accounts.entity

import me.bread.supreme.integration.domain.accounts.vo.Email
import me.bread.supreme.integration.domain.accounts.vo.Password
import me.bread.supreme.integration.domain.accounts.vo.PhoneNumber

data class Authentication(
	val email: Email,
	val password: Password,
	val phoneNumber: PhoneNumber,
)
