package me.bread.supreme.integration.domain.accounts.repsository

import me.bread.supreme.integration.domain.accounts.entity.Accounts

interface AccountsRepository {
	fun save(accounts: Accounts): Accounts
}
