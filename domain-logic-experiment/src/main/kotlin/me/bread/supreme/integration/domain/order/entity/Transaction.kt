package me.bread.supreme.integration.domain.order.entity

import me.bread.supreme.integration.domain.money.Money
import me.bread.supreme.integration.domain.order.vo.TransactionStatus
import java.time.LocalDateTime

class Transaction(
	var accountId: Long,
	var resultPrice: Money,
	var status: TransactionStatus,
	var createdAt: LocalDateTime
) {

	fun record(accountId: Long, totalPrice: Money) {
		this.accountId = accountId
		this.resultPrice = totalPrice
	}

	fun status(status: TransactionStatus) {
		this.status = status
	}
}
